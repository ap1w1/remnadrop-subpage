import { Request } from 'express';

import { Injectable, Logger } from '@nestjs/common';
import {
    SubscriptionPageRawConfigSchema,
    TSubscriptionPageRawConfig,
    SUBPAGE_DEFAULT_CONFIG_UUID,
} from '@remnawave/subscription-page-types';

import { decryptUuid, encryptUuid } from '@common/utils/crypt-utils';
import { TypedConfigService } from '@common/config/app-config';
import { AxiosService } from '@common/axios';

const CONFIG_TTL_MS = 15_000;
const RETRY_TTL_MS = 5_000;
const MAX_CACHED_CONFIGS = 512;

type CachedConfig = { value: TSubscriptionPageRawConfig; expiresAt: number };

@Injectable()
export class SubpageConfigService {
    private readonly logger = new Logger(SubpageConfigService.name);
    private readonly internalJwtSecret: string;
    private readonly subpageConfigUuid: string;
    private readonly cache = new Map<string, CachedConfig>();
    private readonly inFlight = new Map<string, Promise<TSubscriptionPageRawConfig | null>>();

    constructor(
        private readonly configService: TypedConfigService,
        private readonly axiosService: AxiosService,
    ) {
        this.internalJwtSecret = this.configService.getOrThrow('INTERNAL_JWT_SECRET');
        this.subpageConfigUuid = this.configService.getOrThrow('SUBPAGE_CONFIG_UUID');
    }

    private async loadConfig(uuid: string): Promise<TSubscriptionPageRawConfig | null> {
        const cached = this.cache.get(uuid);
        if (cached && cached.expiresAt > Date.now()) return cached.value;

        const pending = this.inFlight.get(uuid);
        if (pending) return pending;

        const request = (async () => {
            const response = await this.axiosService.getSubscriptionPageConfigByUuid(uuid);
            if (response.isOk && response.response) {
                const parsed = await SubscriptionPageRawConfigSchema.safeParseAsync(response.response.config);
                if (parsed.success) {
                    const rawBranding = (response.response.config as {
                        brandingSettings?: { pageColors?: unknown };
                    }).brandingSettings;
                    if (rawBranding?.pageColors && typeof rawBranding.pageColors === 'object') {
                        Object.assign(parsed.data.brandingSettings, { pageColors: rawBranding.pageColors });
                    }
                    this.cache.delete(uuid);
                    this.cache.set(uuid, { value: parsed.data, expiresAt: Date.now() + CONFIG_TTL_MS });
                    if (this.cache.size > MAX_CACHED_CONFIGS) {
                        this.cache.delete(this.cache.keys().next().value!);
                    }
                    return parsed.data;
                }
                this.logger.warn(`Invalid Subpage config ${uuid}: ${parsed.error.message}`);
            }

            if (cached) {
                cached.expiresAt = Date.now() + RETRY_TTL_MS;
                return cached.value;
            }
            return null;
        })().finally(() => this.inFlight.delete(uuid));

        this.inFlight.set(uuid, request);
        return request;
    }

    public async getSubscriptionPageConfig(
        encryptedSubpageConfigUuid: string,
        req: Request,
    ): Promise<object | void> {
        const uuid = decryptUuid(encryptedSubpageConfigUuid, this.internalJwtSecret);
        if (!uuid) {
            req.socket?.destroy();
            return;
        }

        const config = await this.loadConfig(uuid);
        if (!config) {
            this.logger.warn(`Subpage config ${uuid} is unavailable`);
            req.socket?.destroy();
            return;
        }
        return config;
    }

    public getEncryptedSubpageConfigUuid(subpageConfigUuidFromRemnawave: string | null): string {
        return encryptUuid(
            this.getFinalSubpageConfigUuid(subpageConfigUuidFromRemnawave),
            this.internalJwtSecret,
        );
    }

    public async getBaseSettings(
        subpageConfigUuid: string | null,
    ): Promise<TSubscriptionPageRawConfig['baseSettings']> {
        const config = await this.loadConfig(this.getFinalSubpageConfigUuid(subpageConfigUuid));
        if (!config) {
            return {
                metaTitle: 'Subscription Page',
                metaDescription: 'Subscription Page',
                showConnectionKeys: false,
                hideGetLinkButton: false,
            };
        }

        return {
            metaTitle: config.baseSettings.metaTitle,
            metaDescription: config.baseSettings.metaDescription,
            showConnectionKeys: config.baseSettings.showConnectionKeys,
            hideGetLinkButton: config.baseSettings.hideGetLinkButton,
        };
    }

    private getFinalSubpageConfigUuid(subpageConfigUuid: string | null): string {
        return this.subpageConfigUuid === SUBPAGE_DEFAULT_CONFIG_UUID && subpageConfigUuid
            ? subpageConfigUuid
            : this.subpageConfigUuid;
    }
}

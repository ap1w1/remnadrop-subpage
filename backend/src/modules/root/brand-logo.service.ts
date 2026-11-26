import { lookup } from 'node:dns/promises';
import { request } from 'node:https';

import { Injectable } from '@nestjs/common';

const MAX_IMAGE_BYTES = 1024 * 1024;
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_CACHED_IMAGES = 20;
const IMAGE_TYPES = new Set(['image/gif', 'image/jpeg', 'image/png', 'image/webp']);

interface CachedImage {
    bytes: Buffer;
    contentType: string;
    expiresAt: number;
}

export function isPublicIpv4(address: string): boolean {
    const parts = address.split('.').map(Number);
    if (
        parts.length !== 4 ||
        parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
    ) {
        return false;
    }
    const [first, second, third] = parts;
    return !(
        first === 0 ||
        first === 10 ||
        first === 127 ||
        first >= 224 ||
        (first === 100 && second >= 64 && second <= 127) ||
        (first === 169 && second === 254) ||
        (first === 172 && second >= 16 && second <= 31) ||
        (first === 192 && second === 168) ||
        (first === 192 && second === 0 && third === 0) ||
        (first === 198 && second >= 18 && second <= 19)
    );
}

@Injectable()
export class BrandLogoService {
    private readonly cache = new Map<string, CachedImage>();

    public async getImage(rawUrl: string): Promise<CachedImage | null> {
        const cached = this.cache.get(rawUrl);
        if (cached && cached.expiresAt > Date.now()) return cached;

        let url: URL;
        try {
            url = new URL(rawUrl);
            if (url.protocol !== 'https:' || url.username || url.password) return null;
        } catch {
            return null;
        }

        let address: string;
        try {
            const resolved = await lookup(url.hostname, { family: 4, all: true });
            address = resolved.find((entry) => isPublicIpv4(entry.address))?.address ?? '';
            if (!address) return null;
        } catch {
            return null;
        }

        const image = await new Promise<CachedImage | null>((resolve) => {
            const req = request(
                {
                    hostname: address,
                    port: url.port || 443,
                    path: `${url.pathname}${url.search}`,
                    method: 'GET',
                    servername: url.hostname,
                    headers: {
                        Host: url.host,
                        Accept: 'image/png,image/jpeg,image/webp,image/gif',
                    },
                    timeout: 5000,
                },
                (response) => {
                    const contentType = String(response.headers['content-type'] ?? '')
                        .split(';')[0]
                        .trim()
                        .toLowerCase();
                    const contentLength = Number(response.headers['content-length'] ?? 0);
                    if (
                        response.statusCode !== 200 ||
                        !IMAGE_TYPES.has(contentType) ||
                        contentLength > MAX_IMAGE_BYTES
                    ) {
                        response.destroy();
                        resolve(null);
                        return;
                    }

                    const chunks: Buffer[] = [];
                    let total = 0;
                    response.on('data', (chunk: Buffer) => {
                        total += chunk.length;
                        if (total > MAX_IMAGE_BYTES) {
                            response.destroy();
                            resolve(null);
                            return;
                        }
                        chunks.push(chunk);
                    });
                    response.on('end', () =>
                        resolve({
                            bytes: Buffer.concat(chunks),
                            contentType,
                            expiresAt: Date.now() + CACHE_TTL_MS,
                        }),
                    );
                    response.on('error', () => resolve(null));
                },
            );
            req.on('timeout', () => req.destroy());
            req.on('error', () => resolve(null));
            req.end();
        });

        if (image) {
            this.cache.delete(rawUrl);
            this.cache.set(rawUrl, image);
            if (this.cache.size > MAX_CACHED_IMAGES) {
                this.cache.delete(this.cache.keys().next().value!);
            }
        }
        return image;
    }
}

import type { IncomingHttpHeaders } from 'node:http';

// Only client metadata needed for subscription templates and HWID checks may reach the panel.
const CLIENT_HEADERS = new Set([
    'accept',
    'accept-language',
    'user-agent',
    'x-app-version',
    'x-device-model',
    'x-device-os',
    'x-hwid',
    'x-ver-os',
]);

// Do not relay cookies, redirects, authentication, or proxy control headers to clients.
export const SUBSCRIPTION_RESPONSE_HEADERS = new Set([
    'announce',
    'content-disposition',
    'content-type',
    'profile-title',
    'profile-update-interval',
    'profile-web-page-url',
    'routing',
    'subscription-refill-date',
    'subscription-userinfo',
    'support-url',
    'x-hwid-active',
    'x-hwid-limit',
    'x-hwid-max-devices-reached',
    'x-hwid-not-supported',
]);

export function getSafeClientHeaders(headers: IncomingHttpHeaders): Record<string, string> {
    return Object.fromEntries(
        Object.entries(headers)
            .filter(([key, value]) => CLIENT_HEADERS.has(key.toLowerCase()) && typeof value === 'string')
            .map(([key, value]) => [key.toLowerCase(), value as string]),
    );
}

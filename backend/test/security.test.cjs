const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const ejs = require('ejs');
const axios = require('axios');
const { getSafeClientHeaders, SUBSCRIPTION_RESPONSE_HEADERS } = require('../dist/src/common/axios/subscription-headers.js');
const { isPublicIpv4, BrandLogoService } = require('../dist/src/modules/root/brand-logo.service.js');

test('brand logo proxy rejects local and non-HTTPS sources', async () => {
    assert.equal(isPublicIpv4('127.0.0.1'), false);
    assert.equal(isPublicIpv4('10.0.0.5'), false);
    assert.equal(isPublicIpv4('169.254.169.254'), false);
    assert.equal(isPublicIpv4('172.20.0.1'), false);
    assert.equal(isPublicIpv4('192.168.1.1'), false);
    assert.equal(isPublicIpv4('8.8.8.8'), true);
    const proxy = new BrandLogoService();
    assert.equal(await proxy.getImage('http://example.com/logo.png'), null);
    assert.equal(await proxy.getImage('https://user:password@example.com/logo.png'), null);
});

test('only subscription client metadata reaches panel', () => {
    const result = getSafeClientHeaders({
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'client',
        'x-hwid': 'device-id',
        cookie: 'session=secret',
        authorization: 'Bearer secret',
        'x-original-url': '/api/users',
        'x-rewrite-url': '/api/users',
        'x-forwarded-host': 'evil.example',
    });
    assert.deepEqual(result, {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'client',
        'x-hwid': 'device-id',
    });
    assert.equal(SUBSCRIPTION_RESPONSE_HEADERS.has('set-cookie'), false);
    assert.equal(SUBSCRIPTION_RESPONSE_HEADERS.has('location'), false);
});

test('raw subscription request does not inherit admin bearer token', async () => {
    const client = axios.create({ headers: { Authorization: 'Bearer admin-secret' } });
    const response = await client.get('/api/sub/test', {
        headers: { Authorization: undefined },
        adapter: async (config) => ({
            config,
            data: { authorization: config.headers.get('Authorization') },
            headers: {},
            status: 200,
            statusText: 'OK',
        }),
    });
    assert.equal(response.data.authorization, undefined);
});

test('production HTML escapes configured metadata', () => {
    const template = readFileSync(path.join(__dirname, '../../frontend/dist/index.html'), 'utf8');
    const output = ejs.render(template, {
        metaTitle: '</title><script>alert(1)</script>',
        metaDescription: '" onload="alert(1)',
        panelData: 'YWJj',
    });
    assert.match(output, /&lt;script&gt;/);
    assert.doesNotMatch(output, /<script>alert\(1\)<\/script>/);
    assert.match(output, /&#34; onload=/);
});

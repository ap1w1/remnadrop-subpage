import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'

globalThis.window = new JSDOM('').window

const { sanitizeRichText, sanitizeSvg } = await import('../src/shared/utils/sanitize-markup.ts')
const { getSafeOpenUrl } = await import('../src/shared/utils/safe-open-url.ts')

test('rich text removes scriptable markup and URLs', () => {
    const html = sanitizeRichText('<img src=x onerror=alert(1)><b>safe</b><a href="javascript:alert(1)">bad</a>')
    assert.match(html, /<b>safe<\/b>/)
    assert.doesNotMatch(html, /img|onerror|javascript:/i)
})

test('SVG removes active content and external references', () => {
    const svg = sanitizeSvg('<svg onload="alert(1)"><foreignObject><script>alert(1)</script></foreignObject><use href="https://evil.example/icon"/><path d="M0 0"/></svg>')
    assert.match(svg, /<path/)
    assert.doesNotMatch(svg, /onload|foreignObject|script|<use|evil\.example/i)
})

test('external actions reject executable URLs and preserve app links', () => {
    assert.equal(getSafeOpenUrl('javascript:alert(1)', true), null)
    assert.equal(getSafeOpenUrl('data:text/html,evil', true), null)
    assert.equal(getSafeOpenUrl('//evil.example'), null)
    assert.equal(getSafeOpenUrl('https://example.com/download'), 'https://example.com/download')
    assert.equal(getSafeOpenUrl('happ://import/subscription', true), 'happ://import/subscription')
    assert.equal(getSafeOpenUrl('happ://import/subscription'), null)
})

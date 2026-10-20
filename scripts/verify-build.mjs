import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const html = readFileSync('dist/index.html', 'utf8');
assert.ok(!html.includes('/src/'), 'Production HTML must reference compiled files.');
const references = [...html.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g)].map((match) => match[1]);
assert.ok(
  references.some((path) => path.endsWith('.js')),
  'Missing entry bundle.',
);
for (const path of references)
  assert.ok(existsSync(join('dist', path)), `Missing build asset: ${path}`);
assert.ok(
  !existsSync('dist/Xidian-source-complete.zip'),
  'Source archives do not belong in the site.',
);
// The published artifact contains runtime assets, never source files, maps or archives.
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      inspect(path);
      continue;
    }
    assert.ok(
      !/\.(?:map|tsx?|jsx|zip|tar|tgz|gz|pem|key)$|^\.env(?:\.|$)/i.test(entry.name),
      `Private/source artifact in build: ${path}`,
    );
    if (entry.name.endsWith('.js'))
      assert.ok(
        !readFileSync(path, 'utf8').includes('sourceMappingURL='),
        `Source map reference in ${path}`,
      );
  }
}
inspect('dist');
assert.match(html, /Content-Security-Policy/);
const decodedHtml = html.replaceAll('&#39;', "'");
assert.match(decodedHtml, /script-src 'self'/);
assert.match(decodedHtml, /object-src 'none'/);
console.log(`Build verified: ${references.length} local entry assets exist.`);

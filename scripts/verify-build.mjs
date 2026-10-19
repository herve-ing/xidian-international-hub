import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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
console.log(`Build verified: ${references.length} local entry assets exist.`);

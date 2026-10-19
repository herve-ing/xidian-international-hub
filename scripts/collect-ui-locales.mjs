import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('src'),
  catalog = {};
function add(en, fr = '', zh = '') {
  if (!en?.trim() || !/[A-Za-z]/.test(en) || en.startsWith('http') || en.length > 6000) return;
  catalog[en] = { ...(catalog[en] || {}), ...(fr ? { fr } : {}), ...(zh ? { zh } : {}) };
}
const literal = (n) =>
  n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : undefined;
for (const file of fs
  .readdirSync(root)
  .filter(
    (f) => /\.(tsx|ts)$/.test(f) && !/(translations|i18n|supervisors|binary|locale)/.test(f),
  )) {
  const sf = ts.createSourceFile(
    file,
    fs.readFileSync(path.join(root, file), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  function visit(n) {
    if (ts.isCallExpression(n)) {
      const name = n.expression.getText(sf),
        o = name === 'content' ? 1 : 0;
      if (['c', 'content'].includes(name) && literal(n.arguments[o + 1]) !== undefined)
        add(literal(n.arguments[o + 1]), literal(n.arguments[o]), literal(n.arguments[o + 2]));
    }
    if (
      ts.isCallExpression(n) &&
      n.expression.getText(sf) === 'localize' &&
      literal(n.arguments[1])
    )
      add(literal(n.arguments[1]));
    if (
      ts.isArrayLiteralExpression(n) &&
      n.elements.length === 3 &&
      n.elements.every((e) => literal(e) !== undefined) &&
      /[\u3400-\u9fff]/.test(literal(n.elements[2]))
    )
      add(literal(n.elements[1]), literal(n.elements[0]), literal(n.elements[2]));
    if (ts.isObjectLiteralExpression(n)) {
      const p = Object.fromEntries(
        n.properties
          .filter(ts.isPropertyAssignment)
          .map((p) => [p.name.getText(sf).replace(/['"]/g, ''), literal(p.initializer)]),
      );
      if (p.en) add(p.en, p.fr, p.zh);
      for (const k of Object.keys(p))
        if (k.endsWith('En') && p[k]) add(p[k], p[k.slice(0, -2) + 'Fr'], p[k.slice(0, -2) + 'Zh']);
    }
    if (ts.isJsxText(n)) {
      const text = n.text.replace(/\s+/g, ' ').trim();
      if (/[A-Za-z]{2}/.test(text)) add(text);
    }
    if (
      ts.isJsxAttribute(n) &&
      ['placeholder', 'aria-label', 'title'].includes(n.name.getText(sf)) &&
      literal(n.initializer)
    )
      add(literal(n.initializer));
    ts.forEachChild(n, visit);
  }
  visit(sf);
}
// Source data, not personal names or user-authored articles.
const { supervisors } = await import('../src/supervisors.ts');
for (const s of supervisors) {
  add(s.school, s.schoolFr);
  s.research.forEach((en, i) => add(en, s.researchFr[i]));
  if (s.title) add(s.title);
}
const { graduateProgrammes } = await import('../src/admissions-data.ts');
for (const p of graduateProgrammes) {
  add(p.major);
  add(p.school);
}
const { researchAreas } = await import('../src/admissions-data.ts');
for (const [en, fr] of researchAreas) add(en, fr);
const { clubTranslations } = await import('../src/club-translations.ts');
const { translations } = await import('../src/translations.ts');
const { translate } = await import('../src/i18n.ts');
const nav = [
  'home',
  'supervisors',
  'visas',
  'guide',
  'chat',
  'admin',
  'settings',
  'search',
  'notifications',
  'documents',
  'add',
  'save',
  'cancel',
  'all',
  'profile',
  'days',
  'viewAll',
  'welcome',
  'help',
  'favorites',
  'language',
  'export',
  'renew',
  'checklist',
  'student',
  'campus',
];
for (const key of nav) add(translate('en', key), translate('fr', key), translate('zh', key));
for (const [locale, dict] of Object.entries(translations)) {
  for (const [en, text] of Object.entries(dict)) {
    add(en);
    catalog[en][locale] = text;
  }
}
for (const [locale, dict] of Object.entries(clubTranslations)) {
  for (const [en, text] of Object.entries(dict)) {
    add(en);
    catalog[en][locale] = text;
  }
}
fs.mkdirSync('.translation-work', { recursive: true });
fs.writeFileSync('.translation-work/source.json', JSON.stringify(catalog, null, 2));
console.log(
  JSON.stringify({
    keys: Object.keys(catalog).length,
    characters: Object.keys(catalog).join('').length,
  }),
);

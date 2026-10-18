import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { content, languages, translate } from '../src/i18n.ts';
import { clubTranslations } from '../src/club-translations.ts';
import { translations } from '../src/translations.ts';
test('campus visible copy has a translation in every offered locale', () => {
  const sf = ts.createSourceFile(
    'campus.tsx',
    fs.readFileSync(new URL('../src/campus.tsx', import.meta.url), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const copy = [];
  function scan(n) {
    if (
      ts.isCallExpression(n) &&
      n.expression.getText(sf) === 'c' &&
      n.arguments[1] &&
      ts.isStringLiteral(n.arguments[1])
    )
      copy.push(n.arguments[1].text);
    if (ts.isArrayLiteralExpression(n) && n.elements.every(ts.isStringLiteral)) {
      if (n.elements.length === 3 && /[\u3400-\u9fff]/.test(n.elements[2].text))
        copy.push(n.elements[1].text);
      if (n.elements.length === 4 && /[\u3400-\u9fff]/.test(n.elements[3].text))
        copy.push(n.elements[2].text);
    }
    ts.forEachChild(n, scan);
  }
  scan(sf);
  const dialog = ts.createSourceFile(
    'club-dialog.tsx',
    fs.readFileSync(new URL('../src/club-dialog.tsx', import.meta.url), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  function scanDialog(n) {
    if (
      ts.isCallExpression(n) &&
      n.expression.getText(dialog) === 'c' &&
      n.arguments[1] &&
      ts.isStringLiteral(n.arguments[1])
    )
      copy.push(n.arguments[1].text);
    ts.forEachChild(n, scanDialog);
  }
  scanDialog(dialog);
  for (const [locale] of languages) {
    assert.notEqual(translate(locale, 'campus'), 'campus');
    if (['fr', 'en', 'zh'].includes(locale)) continue;
    for (const en of copy)
      assert.ok(clubTranslations[locale]?.[en] || translations[locale][en], locale + ': ' + en);
  }
  assert.equal(content('zh', 'Chargement…', 'Loading…'), '正在加载…');
  assert.equal(content('es', 'Fermer', 'Close'), 'Cerrar');
  assert.equal(content('ar', 'Agenda', 'Events'), 'الفعاليات');
});

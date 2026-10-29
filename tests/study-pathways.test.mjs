import { test } from 'node:test';
import assert from 'node:assert/strict';
import { languages } from '../src/locale-config.ts';
import { studyCatalogues, studyText } from '../src/study-copy.ts';
import {
  normalizeStudyPlan,
  studyStorageKey,
  emptyStudyPlan,
  resources,
} from '../src/study-model.ts';
import { applicationSummary } from '../src/application-summary.ts';

test('study translations cover every key in all 15 languages without English fallback', () => {
  const keys = Object.keys(studyCatalogues.en);
  for (const [locale] of languages) {
    assert.deepEqual(Object.keys(studyCatalogues[locale]), keys);
    for (const key of keys) {
      assert.ok(studyText(locale, key).trim(), locale + key);
      if (locale !== 'en')
        assert.notEqual(studyText(locale, key), studyCatalogues.en[key], locale + key);
    }
  }
  assert.equal(studyText('fr-FR', 'nav'), studyCatalogues.fr.nav);
  assert.equal(studyText('ar-MA', 'local'), studyCatalogues.ary.local);
});
test('roadmap drafts discard invalid IDs, deduplicate checks and bound user text', () => {
  assert.deepEqual(normalizeStudyPlan(null), emptyStudyPlan());
  const plan = normalizeStudyPlan({
    field: 'forged',
    completed: ['debug', 'debug', 'other', 7],
    notes: 'x'.repeat(5000),
    question: 'x'.repeat(2000),
  });
  assert.equal(plan.field, 'cs');
  assert.deepEqual(plan.completed, ['debug']);
  assert.equal(plan.notes.length, 4000);
  assert.equal(plan.question.length, 1200);
  assert.notEqual(studyStorageKey('alice'), studyStorageKey('bob'));
  assert.throws(() => studyStorageKey(''), /account/);
  assert.ok(resources.every((r) => r.href.startsWith('https://')));
});
test('next actions distinguish an unsaved plan from preparation and official steps', () => {
  assert.equal(applicationSummary(null).next, 'start');
  const app = { stage: 'preparing', documents: ['plan', 'plan', 'invented'] };
  const summary = applicationSummary(app);
  assert.equal(summary.prepared, 1);
  assert.equal(summary.next, 'documents');
  assert.ok(summary.missing.every((d) => d.id !== 'plan'));
  assert.equal(applicationSummary({ ...app, stage: 'interview' }).next, 'official');
  assert.equal(applicationSummary({ ...app, stage: 'offer' }).next, 'official');
});

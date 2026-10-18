import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesDegree } from '../src/supervisor-filter.ts';
import { supervisors } from '../src/supervisors.ts';
test('degree filter includes unspecified image-based profiles without declaring a match', () => {
  assert.ok(matchesDegree({ levels: [] }, 'Master'));
  assert.ok(matchesDegree({ levels: [] }, 'PhD'));
  assert.equal(matchesDegree({ levels: ['PhD'] }, 'Master'), false);
  assert.ok(matchesDegree({ levels: ['Master', 'PhD'] }, 'Master'));
  assert.equal(matchesDegree({ levels: [] }, 'Master', false), false);
  assert.ok(matchesDegree({ levels: [] }, 'unconfirmed', false));
  assert.equal(supervisors.filter((s) => matchesDegree(s, 'Master')).length, 254);
  assert.equal(supervisors.filter((s) => matchesDegree(s, 'PhD')).length, 255);
});

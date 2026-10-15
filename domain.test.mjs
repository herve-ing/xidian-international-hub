import assert from 'node:assert/strict';
import {test} from 'node:test';
import {remainingDays,urgency,alertThreshold,validDate,beijingDate} from './domain.ts';
test('expiry uses Beijing calendar day across UTC boundary',()=>{const now=new Date('2026-10-14T16:01:00Z');assert.equal(beijingDate(now),'2026-10-15');assert.equal(remainingDays('2026-10-16',now),1);assert.equal(remainingDays('2026-10-14',now),-1);});
test('status boundaries are inclusive without gaps',()=>{for(const [d,s]of [[-1,'expired'],[0,'critical'],[6,'critical'],[7,'warning'],[29,'warning'],[30,'upcoming'],[90,'upcoming'],[91,'safe']])assert.equal(urgency(d),s);});
test('reminder thresholds catch visits between checkpoints',()=>{for(const [d,t]of [[31,null],[30,30],[23,30],[15,15],[8,15],[7,7],[2,7],[1,1],[0,1],[-2,1]])assert.equal(alertThreshold(d),t);});
test('date validation rejects normalized impossible dates',()=>{assert.equal(validDate('2026-02-29'),false);assert.equal(validDate('2028-02-29'),true);assert.equal(validDate('not a date'),false);assert.equal(validDate('2026-13-01'),false);});

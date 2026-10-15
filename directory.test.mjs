import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {supervisors,directoryMeta} from './supervisors.ts';
import {prototypeRequest as api} from './prototype-api.ts';
test('all 252 official directory entries and all pagination pages are represented once',()=>{
 const sources=JSON.parse(fs.readFileSync(new URL('./supervisor-sources.json',import.meta.url)));
 const official=supervisors.filter(s=>s.directorySource);
 assert.equal(official.length,252);assert.equal(new Set(official.map(s=>s.source)).size,252);
 assert.equal(sources.listPages.length,22);assert.equal(directoryMeta.schools.length,19);
 for(const p of sources.profiles)assert.ok(official.some(s=>s.source===p.url),'Missing '+p.url);
 for(const school of directoryMeta.schools)assert.equal(official.filter(s=>s.schools.includes(school.name)).length,school.count);
 assert.equal(official.filter(s=>s.profileImages.length).length,243);
 assert.ok(official.every(s=>s.title===''&&s.email===''&&s.languages.length===0),'Image-only fields must not be inferred');
});
test('old local workspace migrates directory while retaining documents, preferences and custom faculty',async()=>{
 const key='xidian-pages-prototype-v1';const custom={...supervisors[0],id:'my-custom-faculty',name:'Local faculty'};
 const values=new Map([[key,JSON.stringify({profile:{displayName:'Local student',preferences:'{"favorites":["li-jun"]}'},documents:[{id:'keep',label:'Future passport',type:'passport',expiry:'2099-01-01'}],alerts:[],supervisors:[supervisors[0],custom]})]]);
 Object.defineProperty(globalThis,'localStorage',{value:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)},configurable:true});
 const state=await api('/api/state');const roster=(await api('/api/supervisors')).items;
 assert.equal(roster.length,256);assert.equal(state.documents[0].id,'keep');assert.equal(state.profile.displayName,'Local student');assert.equal(JSON.parse(state.profile.preferences).favorites[0],'li-jun');assert.ok(roster.some(s=>s.id===custom.id));
 assert.equal(JSON.parse(values.get(key)).directoryVersion,directoryMeta.version);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {registerStudent,loginStudent,loginProfessor,signOut,currentAccount,canAccessISO,professorDemoCode,accountsKey,updateAccountProfile} from './accounts.ts';
import {prototypeRequest as api} from './prototype-api.ts';
const local=new Map(),session=new Map();
for(const [name,store] of [['localStorage',local],['sessionStorage',session]])Object.defineProperty(globalThis,name,{value:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},configurable:true});
const student=(id)=>({displayName:'Student '+id,studentId:id,nationality:'Demo country',major:'Computer science',grade:'Master',phone:'+8613800000000',email:id+'@example.com'});
test('student accounts validate identity fields, protect passwords and isolate workspaces',async()=>{
 await assert.rejects(()=>registerStudent({...student('one'),major:''},'DemoPass123'),/required/);
 const one=await registerStudent(student('one'),'DemoPass123');assert.equal(currentAccount().id,one.id);assert.equal(canAccessISO(one),false);
 assert.ok(!local.get(accountsKey).includes('DemoPass123'),'password must not be stored in plaintext');
 await assert.rejects(()=>api('/api/admin'),/reserved/);await assert.rejects(()=>api('/api/supervisors','POST',{name:'Forbidden'}),/reserved/);
 await api('/api/documents','POST',{type:'insurance',label:'One',expiry:'2027-10-16'});
 signOut();await assert.rejects(()=>loginStudent('one@example.com','bad-password'),/credentials/);
 const two=await registerStudent(student('two'),'DemoPass456');assert.notEqual(one.id,two.id);assert.equal((await api('/api/state')).documents.length,0);
 signOut();await loginStudent('ONE','DemoPass123');assert.equal((await api('/api/state')).documents.length,1);
 updateAccountProfile({major:'Engineering',role:'professor'});assert.equal(currentAccount().role,'student');assert.equal(currentAccount().major,'Engineering');
 await assert.rejects(()=>registerStudent(student('one'),'DemoPass123'),/duplicate/);
 signOut();assert.equal(currentAccount(),null);
});
test('professor code grants complete demo access and local roster reminders target chosen student',async()=>{
 assert.throws(()=>loginProfessor('Demo professor','prof@example.com','bad-code'),/code/);
 const professor=loginProfessor('Demo professor','prof@example.com',professorDemoCode);assert.equal(canAccessISO(professor),true);
 const roster=await api('/api/admin');assert.equal(roster.students.length,2);assert.equal(roster.documents.length,1);assert.ok(!JSON.stringify(roster).includes('passwordHash'));
 const result=await api('/api/admin','POST',{studentIds:[roster.students[0].userId]});assert.equal(result.created,1);
 signOut();await loginStudent('one','DemoPass123');assert.ok((await api('/api/state')).alerts.some(a=>a.documentType==='administrative'));
 signOut();await loginStudent('two','DemoPass456');assert.equal((await api('/api/state')).alerts.length,0);
});

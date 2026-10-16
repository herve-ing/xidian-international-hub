import {currentAccount,canAccessISO,workspaceKey,studentAccounts} from './accounts.ts';
import {supervisors,directoryMeta} from './supervisors.ts';
import {remainingDays,alertThreshold,validDate,documentTypes} from './domain.ts';
import {answerFAQ} from './faq.ts';

function read(){const key=workspaceKey();try{const raw=localStorage.getItem(key);if(raw){const data=JSON.parse(raw);if(data&&Array.isArray(data.documents)&&Array.isArray(data.alerts)&&Array.isArray(data.supervisors)){if(data.directoryVersion!==directoryMeta.version){const legacy=new Set(['li-chenxi','li-jun','sheng-kai']);const custom=data.supervisors.filter((s:any)=>!legacy.has(s.id)&&!s.id.startsWith('sie-'));const canonical=new Map(supervisors.map(s=>[s.id,s]));for(const s of custom)canonical.set(s.id,s);data.supervisors=[...canonical.values()];data.directoryVersion=directoryMeta.version;}return data;}}}catch{}const a=currentAccount();return {profile:a?{...a,program:a.grade||'Master',arrivalDate:'',registrationDate:'',checklist:'[]',preferences:'{}'}:null,documents:[],alerts:[],supervisors,directoryVersion:directoryMeta.version};}
function write(data:any){try{localStorage.setItem(workspaceKey(),JSON.stringify(data));}catch{throw new Error('Browser storage is unavailable or full. Changes were not saved.');}}
export async function prototypeRequest(url:string,method='GET',body?:unknown):Promise<any>{
 const account=currentAccount(), data=read(), b=(body||{}) as any, now=new Date().toISOString();
 if((url==='/api/admin'||url==='/api/supervisors'&&method!=='GET')&&!canAccessISO(account))throw new Error('Access reserved for professor accounts.');
 if(url==='/api/chatbot')return answerFAQ(b.question||'',b.lang||'en');
 if(url==='/api/supervisors'&&method==='GET')return {items:data.supervisors};
 if(url==='/api/state'){
  for(const d of data.documents){const n=remainingDays(d.expiry),threshold=alertThreshold(n),id=`${d.id}:${d.expiry}:${threshold}`;if(threshold!==null&&!data.alerts.some((a:any)=>a.id===id))data.alerts.unshift({id,userId:'prototype',documentType:d.type,documentId:d.id,message:`${d.label}: ${n<0?'expired '+Math.abs(n)+' days ago':n+' days remaining'}`,sentAt:now,status:'unread',channel:'local-demo'});}
  write(data);return {profile:data.profile,documents:data.documents,alerts:data.alerts,user:{name:account?.displayName||'Prototype',email:account?.email||'',admin:canAccessISO(account)},mode:'local-demo'};
 }
 if(url==='/api/profile'){data.profile={...(data.profile||{}),...b,userId:'prototype'};}
 else if(url==='/api/preferences'){data.profile={...(data.profile||{}),preferences:JSON.stringify(b),userId:'prototype'};}
 else if(url==='/api/checklist'){data.profile={...(data.profile||{}),checklist:JSON.stringify(b.items),userId:'prototype'};}
 else if(url==='/api/documents'){
  if(method==='DELETE')data.documents=data.documents.filter((d:any)=>d.id!==b.id);
  else{if(!documentTypes.includes(b.type)||!validDate(b.expiry)||(b.issueDate&&!validDate(b.issueDate)))throw new Error('Check the document type and dates.');if(b.issueDate&&b.issueDate>b.expiry)throw new Error('Issue date must precede expiry.');const item={...b,id:b.id||crypto.randomUUID(),userId:'prototype'};data.documents=b.id?data.documents.map((d:any)=>d.id===b.id?item:d):[...data.documents,item];}
 }
 else if(url==='/api/alerts'){data.alerts=data.alerts.map((a:any)=>({...a,status:'read'}));}
 else if(url==='/api/admin'&&method==='GET'){const all=studentAccounts().map(a=>{try{return {account:a,state:JSON.parse(localStorage.getItem(workspaceKey(a))||'null')};}catch{return {account:a,state:null};}});return {students:all.map(({account:a,state:s})=>({...a,...s?.profile,userId:a.id,program:s?.profile?.program||a.grade})),documents:all.flatMap(({account:a,state:s})=>(s?.documents||[]).map((d:any)=>({...d,userId:a.id}))),alerts:all.flatMap(({state:s})=>s?.alerts||[])};}
 else if(url==='/api/admin'){let created=0;for(const a of studentAccounts().filter(a=>Array.isArray(b.studentIds)&&b.studentIds.includes(a.id))){const key=workspaceKey(a);let workspace;try{workspace=JSON.parse(localStorage.getItem(key)||'null');}catch{}if(!workspace)workspace={profile:{...a,program:a.grade},documents:[],alerts:[],supervisors,directoryVersion:directoryMeta.version};workspace.alerts.unshift({id:crypto.randomUUID(),userId:a.id,documentType:'administrative',documentId:'manual',message:'Prototype ISO reminder: check your administrative documents.',sentAt:now,status:'unread',channel:'local-demo'});localStorage.setItem(key,JSON.stringify(workspace));created++;}return {created};}
 else if(url==='/api/supervisors'){const item={...b,id:b.id||crypto.randomUUID(),researchFr:b.research,schoolFr:b.school,languages:[],initials:b.name.split(' ').map((s:string)=>s[0]).join('').slice(0,2),international:'confirm',color:'#e1e6df'};data.supervisors=data.supervisors.some((s:any)=>s.id===item.id)?data.supervisors.map((s:any)=>s.id===item.id?item:s):[...data.supervisors,item];write(data);return {saved:true,item};}
 else throw new Error('This service is not connected in the GitHub Pages prototype.');
 write(data);return {saved:true};
}

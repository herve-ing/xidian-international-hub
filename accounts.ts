export type AccountRole='student'|'professor';
export type Account={id:string;role:AccountRole;displayName:string;email:string;studentId:string;nationality:string;major:string;grade:string;phone:string};
type StoredAccount=Account&{salt:string;passwordHash:string};
export const accountsKey='xidian-accounts-v1';
export const sessionKey='xidian-session-v1';
// Public demonstration code. Production access must be validated on a server.
export const professorDemoCode='XIDIAN-PROF-DEMO-2026';
function accounts():StoredAccount[]{try{return JSON.parse(localStorage.getItem(accountsKey)||'[]');}catch{return [];}}
function publicAccount(a:StoredAccount|Account):Account{const {id,role,displayName,email,studentId,nationality,major,grade,phone}=a;return{id,role,displayName,email,studentId,nationality,major,grade,phone};}
function setSession(a:Account){sessionStorage.setItem(sessionKey,JSON.stringify(publicAccount(a)));return publicAccount(a);}
export function currentAccount():Account|null{try{const a=JSON.parse(sessionStorage.getItem(sessionKey)||'null');if(a?.role==='student'){const stored=accounts().find(x=>x.id===a.id);return stored?publicAccount(stored):null;}return a?.role==='professor'&&a.id&&a.email?publicAccount(a):null;}catch{return null;}}
export function signOut(){sessionStorage.removeItem(sessionKey);}
function hex(bytes:Uint8Array){return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');}
async function hash(password:string,salt:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:210000,hash:'SHA-256'},key,256)));}
export function validateStudent(a:Account){if([a.displayName,a.studentId,a.nationality,a.major,a.grade,a.phone,a.email].some(v=>!v?.trim()))throw new Error('required');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email))throw new Error('email');if(!/^[+\d][\d\s().-]{5,24}$/.test(a.phone))throw new Error('phone');if(!['Bachelor','Master','PhD','Language program'].includes(a.grade))throw new Error('grade');}
export async function registerStudent(input:Omit<Account,'id'|'role'>,password:string){const account:Account={...input,id:crypto.randomUUID(),role:'student',email:input.email.trim().toLowerCase(),studentId:input.studentId.trim().toUpperCase()};validateStudent(account);if(password.length<8)throw new Error('password');const all=accounts();if(all.some(a=>a.email===account.email||a.studentId===account.studentId))throw new Error('duplicate');const salt=hex(crypto.getRandomValues(new Uint8Array(16)));all.push({...account,salt,passwordHash:await hash(password,salt)});localStorage.setItem(accountsKey,JSON.stringify(all));return setSession(account);}
export async function loginStudent(identifier:string,password:string){const value=identifier.trim().toLowerCase(),a=accounts().find(a=>a.email===value||a.studentId.toLowerCase()===value);if(!a||await hash(password,a.salt)!==a.passwordHash)throw new Error('credentials');return setSession(a);}
export function loginProfessor(displayName:string,email:string,code:string){if(!displayName.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))throw new Error('required');if(code.trim()!==professorDemoCode)throw new Error('code');return setSession({id:'professor-'+email.trim().toLowerCase(),role:'professor',displayName:displayName.trim(),email:email.trim().toLowerCase(),studentId:'',nationality:'',major:'',grade:'',phone:''});}
export function updateAccountProfile(changes:Partial<Account>){const current=currentAccount();if(!current)throw new Error('session');const next={...current,...changes,id:current.id,role:current.role,email:current.email,studentId:current.studentId};if(current.role==='student'){validateStudent(next);const all=accounts().map(a=>a.id===next.id?{...a,...next}:a);localStorage.setItem(accountsKey,JSON.stringify(all));}return setSession(next);}
export function studentAccounts(){return accounts().filter(a=>a.role==='student').map(publicAccount);}
export function canAccessISO(a:Account|null){return a?.role==='professor';}
export function workspaceKey(a:Account|null=currentAccount()){return a?'xidian-workspace-v1:'+a.id:'xidian-pages-prototype-v1';}

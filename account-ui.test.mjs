import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const storage=new Map();
Object.defineProperty(globalThis,'localStorage',{value:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},configurable:true});
Object.defineProperty(globalThis,'sessionStorage',{value:{getItem:()=>null},configurable:true});
Object.defineProperty(globalThis,'window',{value:{location:{hash:'#/'}},configurable:true});
test('account portal and role-specific navigation render without exposing ISO to students',async()=>{
 const server=await createServer({root:new URL('.',import.meta.url).pathname,server:{middlewareMode:true},appType:'custom'});
 try{const {default:Portal}=await server.ssrLoadModule('/account-portal.tsx');let html=renderToStaticMarkup(React.createElement(Portal));assert.match(html,/Email ou matricule étudiant/);assert.match(html,/Professeur/);assert.match(html,/Responsable de club/);assert.doesNotMatch(html,/href="#\/admin"/);
 const {default:Hub}=await server.ssrLoadModule('/hub.tsx');const account={id:'test',role:'student',displayName:'Demo Student',email:'demo@example.com',studentId:'DEMO',nationality:'Example',major:'Science',grade:'Master',phone:'+8613800000000'};
 for(const route of ['#/','#/admin','#/club-office']){window.location.hash=route;html=renderToStaticMarkup(React.createElement(Hub,{account,onSignOut(){},onAccountChange(){}}));assert.doesNotMatch(html,/href="#\/admin"/);assert.doesNotMatch(html,/Suivi des étudiants/);assert.doesNotMatch(html,/href="#\/club-office"/);assert.match(html,/Se déconnecter/);}
 window.location.hash='#/';html=renderToStaticMarkup(React.createElement(Hub,{account:{...account,role:'club_leader',clubIds:['basketball']},onSignOut(){},onAccountChange(){}}));assert.match(html,/href="#\/club-office"/);assert.doesNotMatch(html,/href="#\/admin"/);assert.match(html,/href="#\/visas"/);html=renderToStaticMarkup(React.createElement(Hub,{account:{...account,role:'professor'},onSignOut(){},onAccountChange(){}}));assert.match(html,/href="#\/admin"/);assert.match(html,/Professeur · accès complet/);
 window.location.hash='#/clubs';html=renderToStaticMarkup(React.createElement(Portal));assert.match(html,/International Pickleball Club/);assert.match(html,/Filmmaker of Xidian/);assert.doesNotMatch(html,/href="#\/admin"/);assert.equal((html.match(/class="campus-club"/g)||[]).length,13);
 }finally{await server.close();}
});

import fs from 'node:fs';
for(const name of fs.readdirSync('dist')){if(name==='prototype.html'){fs.copyFileSync('dist/'+name,'dist/index.html');fs.copyFileSync('dist/'+name,'index.html');}else if(fs.statSync('dist/'+name).isFile()){fs.copyFileSync('dist/'+name,name);}}
for(const name of ['favicon.svg','openapi.json','supervisors-data.json','supervisor-sources.json','.nojekyll'])fs.copyFileSync(name,'dist/'+name);

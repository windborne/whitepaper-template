const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {createDocument,assertPrivateDestination}=require('./create-document.cjs');
function temp(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'whitepaper-workspace-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir}
test('new workspace is standalone and uses starter content, not the checkout draft',t=>{
 const root=temp(t),dest=path.join(root,'My document');createDocument(dest);
 assert.ok(!fs.existsSync(path.join(dest,'.git')));assert.ok(!fs.existsSync(path.join(dest,'experiments')));assert.ok(!fs.existsSync(path.join(dest,'requirements-dev.txt')));assert.ok(!fs.existsSync(path.join(dest,'.github')));
 assert.match(fs.readFileSync(path.join(dest,'article.html'),'utf8'),/data-document="article"/);
 assert.equal(fs.readFileSync(path.join(dest,'article.html'),'utf8'),fs.readFileSync(path.join(__dirname,'starter.html'),'utf8').replace(/data-document="starter"/,'data-document="article"').replaceAll('starter.pdf','article.pdf'));
 assert.deepEqual(fs.readdirSync(path.join(dest,'assets')).sort(),['editor-preview.png','synthetic-field.png','windborne.svg']);
 assert.ok(fs.existsSync(path.join(dest,'server.cjs')));assert.ok(fs.existsSync(path.join(dest,'runtime.cjs')));
 const origin=JSON.parse(fs.readFileSync(path.join(dest,'template-origin.json')));assert.ok(origin.files['fonts.css']);assert.ok(!origin.files['article.html']);
});
test('refuses source checkout, nested Git workspaces, worktree pointers and existing work',t=>{
 const root=temp(t);assert.throws(()=>assertPrivateDestination(path.join(__dirname,'new-paper')),/outside the public/);
 for(const kind of ['directory','file']){const parent=path.join(root,kind);fs.mkdirSync(parent);kind==='file'?fs.writeFileSync(path.join(parent,'.git'),'gitdir: somewhere'):fs.mkdirSync(path.join(parent,'.git'));assert.throws(()=>createDocument(path.join(parent,'nested','draft')),/outside every Git/);assert.ok(!fs.existsSync(path.join(parent,'nested')))}
 const occupied=path.join(root,'occupied');fs.mkdirSync(occupied);fs.writeFileSync(path.join(occupied,'article.html'),'KEEP MY WORK');assert.throws(()=>createDocument(occupied),/not be overwritten/);assert.equal(fs.readFileSync(path.join(occupied,'article.html'),'utf8'),'KEEP MY WORK');
});
test('rejects a symlink that leads into a Git checkout',t=>{
 const root=temp(t),repo=path.join(root,'repo'),link=path.join(root,'alias');fs.mkdirSync(repo);fs.mkdirSync(path.join(repo,'.git'));
 try{fs.symlinkSync(repo,link,process.platform==='win32'?'junction':'dir')}catch(e){if(e.code==='EPERM')return t.skip('Symlink privilege unavailable');throw e}
 assert.throws(()=>createDocument(path.join(link,'draft')),/outside every Git/);
});

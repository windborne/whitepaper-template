const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
// Explicit distribution list: never copy a checkout's article, arbitrary assets, PDFs or Git metadata.
const files=['starter.html','specimen.html','stress-report.html','style.css','fonts.css','controls.js','renderer.cjs','render.cjs','server.cjs','settings-store.cjs','publish.cjs','pdf_destination_pages.py','runtime.cjs','setup.cjs','doctor.cjs','package.json','package-lock.json','requirements.txt','README.md','SKILL.md','AI-PROMPT.md','DESIGN.md','VALIDATION.md','RELEASE.md','LICENSE-LUCIDE','assets/windborne.svg','assets/synthetic-field.png','assets/editor-preview.png','licenses/newsreader-OFL.txt','licenses/stixtwomath-OFL.txt','licenses/ibmplexsans-OFL.txt','licenses/ibmplexmono-OFL.txt'];
function canonical(destination){let base=path.resolve(destination),parts=[];while(!fs.existsSync(base)){parts.unshift(path.basename(base));const parent=path.dirname(base);if(parent===base)throw Error('Cannot resolve destination');base=parent}return path.join(fs.realpathSync(base),...parts)}
function assertPrivateDestination(destination,source=__dirname){const target=canonical(destination),repo=fs.realpathSync(source);
 if(target===repo||target.startsWith(repo+path.sep))throw Error('Choose a document folder outside the public template checkout.');
 for(let parent=target;;parent=path.dirname(parent)){try{fs.lstatSync(path.join(parent,'.git'));throw Error('Choose a folder outside every Git checkout (including parent folders).')}catch(e){if(e.code!=='ENOENT')throw e}if(path.dirname(parent)===parent)break}
 if(fs.existsSync(target)&&(!fs.statSync(target).isDirectory()||fs.readdirSync(target).length))throw Error('Destination must be new or empty; existing work will not be overwritten.');
 return target;
}
function createDocument(destination,source=__dirname){const target=assertPrivateDestination(destination,source);
 for(const name of files){const file=path.join(source,name);if(!fs.statSync(file).isFile()||fs.lstatSync(file).isSymbolicLink())throw Error('Missing or unsafe template file: '+name)}
 fs.mkdirSync(target,{recursive:true});
 for(const name of files){const dest=path.join(target,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(source,name),dest,fs.constants.COPYFILE_EXCL)}
 let article=fs.readFileSync(path.join(source,'starter.html'),'utf8').replace(/data-document="starter"/,'data-document="article"').replaceAll('starter.pdf','article.pdf');
 fs.writeFileSync(path.join(target,'article.html'),article,{flag:'wx'});
 const pkg=JSON.parse(fs.readFileSync(path.join(target,'package.json')));pkg.scripts={setup:'node setup.cjs',doctor:'node doctor.cjs',start:'node server.cjs',build:'node render.cjs article.html',check:'node doctor.cjs'};fs.writeFileSync(path.join(target,'package.json'),JSON.stringify(pkg,null,2)+'\n');
 fs.writeFileSync(path.join(target,'.gitignore'),'node_modules/\n.venv/\n.cache/\n__pycache__/\n.DS_Store\n');
 let commit=null;try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim()}catch{}
 const hashes=Object.fromEntries(files.map(name=>[name,crypto.createHash('sha256').update(fs.readFileSync(path.join(source,name))).digest('hex')]));
 fs.writeFileSync(path.join(target,'template-origin.json'),JSON.stringify({repository:'https://github.com/windborne/whitepaper-template',commit,createdAt:new Date().toISOString(),files:hashes},null,2)+'\n');
 fs.writeFileSync(path.join(target,'START-HERE.md'),'# Your document workspace\n\nThis folder has no Git checkout or publishing remote. Keep it in storage approved for the document classification; this does not set filesystem permissions, disable cloud sync or approve an AI tool. For CUI, export-controlled or contract-restricted inputs, confirm the approved storage and AI environment with Darius/the responsible owner before providing content. See RELEASE.md for the approved template scope and rollout responsibilities. Do not move it into the public template repository or add that repository as a remote.\n\nRun `node setup.cjs`, then `npm start`. Open the URL printed in the terminal. Ask your agent to edit `article.html`; Template is the synthetic component reference. Save settings saves presentation choices. View PDF generates your current document.\n\nTo return later, run `npm start` here. `npm run doctor` checks PDF export. `template-origin.json` records the source revision/file hashes; `toolchain.json` records the last successful setup check. Neither uploads anything. Keep the editable HTML, shared assets and final PDF together.\n');
 return target;
}
if(require.main===module){try{const destination=process.argv[2];if(!destination||process.argv.length!==3)throw Error('Usage: node create-document.cjs /absolute/path/outside-git/my-document');console.log('Document created: '+createDocument(destination));console.log('Next: enter that folder, run node setup.cjs, then npm start. No Git repository or remote was created.')}catch(e){console.error(e.message);process.exitCode=1}}
module.exports={createDocument,assertPrivateDestination};

const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=__dirname;
function run(command,args,extra={}){const r=spawnSync(command,args,{cwd:root,stdio:'inherit',...extra});if(r.error)throw r.error;if(r.status!==0)throw Error(command+' failed (exit '+r.status+'). Resolve the message above and rerun node setup.cjs; existing documents are preserved.')}
function findPython(){for(const command of [...new Set([process.env.PYTHON,path.join(root,'.venv',process.platform==='win32'?'Scripts/python.exe':'bin/python'),process.platform==='win32'?'python':'python3','python'].filter(Boolean))]){const r=spawnSync(command,['-c','import sys; assert sys.version_info >= (3,10)'],{stdio:'ignore'});if(r.status===0)return command}throw Error('Python 3.10+ is required. Install it or set PYTHON to its executable, then rerun node setup.cjs.')}
async function setup(){
 if(Number(process.versions.node.split('.')[0])<20)throw Error('Node.js 20+ is required. Install Node.js LTS and rerun node setup.cjs.');
 const unknown=process.argv.slice(2).filter(a=>a!=='--skip-system-deps');if(unknown.length)throw Error('Supported option: --skip-system-deps (Linux environments with browser OS libraries already installed).');
 const python=findPython();console.log('Installing locked Node dependencies…');run(process.platform==='win32'?'npm.cmd':'npm',['ci'],{shell:process.platform==='win32'});
 const venv=path.join(root,'.venv',process.platform==='win32'?'Scripts/python.exe':'bin/python');
 if(!fs.existsSync(venv)){console.log('Creating local Python environment…');run(python,['-m','venv',path.join(root,'.venv')])}
 run(venv,['-c','import sys; assert sys.version_info >= (3,10), "Recreate .venv with Python 3.10+"']);
 run(venv,['-m','pip','install','-r',fs.existsSync(path.join(root,'requirements-dev.txt'))?'requirements-dev.txt':'requirements.txt']);
 if(process.env.CHROME){if(!fs.existsSync(process.env.CHROME))throw Error('CHROME must point to an existing Chrome/Chromium executable.');console.log('Using CHROME override; its version will be recorded.')}else{
 const args=[path.join(path.dirname(require.resolve('playwright/package.json')),'cli.js'),'install'];if(process.platform==='linux'&&!process.argv.includes('--skip-system-deps'))args.push('--with-deps');args.push('chromium');console.log('Installing Chromium'+(args.includes('--with-deps')?' and Linux system libraries (may require administrator access)':'')+'…');run(process.execPath,args);
 }
 run(process.execPath,['doctor.cjs'],{env:{...process.env,PYTHON:venv}});
 console.log('\nSetup complete. Run npm start here and open the URL printed in the terminal.');
}
setup().catch(e=>{console.error('\nSetup incomplete: '+e.message);process.exitCode=1});

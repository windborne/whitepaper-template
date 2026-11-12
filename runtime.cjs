const fs=require('node:fs'),path=require('node:path');
function python(){if(process.env.PYTHON)return process.env.PYTHON;const local=path.join(__dirname,'.venv',process.platform==='win32'?'Scripts/python.exe':'bin/python');return fs.existsSync(local)?local:process.platform==='win32'?'python':'python3'}
module.exports={python};

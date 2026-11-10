const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {defaults,validateSettings,resolveDefaults}=require('./renderer.cjs');
const keys=Object.keys(defaults);
function completeSettings(value){
 const result=validateSettings(value);
 if(keys.some(key=>!Object.hasOwn(result,key)))throw Object.assign(Error('All settings are required'),{status:400});
 return result;
}
function same(a,b){return keys.every(key=>a[key]===b[key])}
async function saveSettings(file,settings,expected){
 settings=completeSettings(settings);expected=completeSettings(expected);
 const stat=await fs.lstat(file);if(!stat.isFile())throw Object.assign(Error('Only document files can be saved'),{status:400});
 const original=await fs.readFile(file,'utf8');
 const pattern=/(<script\b[^>]*\bid=["']document-config["'][^>]*>)([\s\S]*?)(<\/script>)/g;
 const matches=[...original.matchAll(pattern)];if(matches.length!==1)throw Object.assign(Error('The document needs one valid document-config block'),{status:400});
 let config;try{config=JSON.parse(matches[0][2]);if(!config||typeof config!=='object'||Array.isArray(config))throw Error()}catch{throw Object.assign(Error('Invalid document configuration'),{status:400})}
 if(config.published)throw Object.assign(Error('Published documents are read-only. Save settings in the editable source.'),{status:400});
 const current=resolveDefaults(config.defaults);
 if(!same(current,expected))throw Object.assign(Error('Settings changed in another editor. Reload the document before saving.'),{status:409});
 config.defaults={...config.defaults,...settings};
 const updated=original.replace(pattern,(_,open,body,close)=>open+JSON.stringify(config).replaceAll('<','\\u003c')+close);
 const temp=path.join(path.dirname(file),'.settings-'+crypto.randomUUID()+'.tmp');
 try{
  await fs.writeFile(temp,updated,{flag:'wx',mode:stat.mode});
  if(await fs.readFile(file,'utf8')!==original)throw Object.assign(Error('The document changed while saving. Reload and try again.'),{status:409});
  await fs.rename(temp,file);
 }finally{await fs.rm(temp,{force:true})}
 return settings;
}
module.exports={saveSettings,completeSettings};

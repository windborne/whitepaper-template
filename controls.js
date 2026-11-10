const config=JSON.parse(document.getElementById('document-config').textContent);
let saveButton,saveStatus,savedDefaults,saving=false,saveFeedback='';
const params=new URLSearchParams(config.published?'':location.search);const kind=document.body.dataset.document;
const localDocument=location.protocol==='file:'||['127.0.0.1','localhost','::1'].includes(location.hostname);
const editing=!config.published&&(params.get('mode')==='edit'||(params.get('mode')!=='public'&&localDocument));
document.body.classList.toggle('editing-mode',editing);
const documentName=location.pathname.split('/').pop()||kind+'.html';
const requestedArticle=params.get('article');
const articleName=documentName==='specimen.html'?(requestedArticle&&/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.html$/.test(requestedArticle)&&requestedArticle!=='specimen.html'?requestedArticle:'article.html'):documentName;
const tabs=[...document.querySelectorAll('.document-tabs a')];
tabs[0].href='specimen.html?'+new URLSearchParams({mode:'edit',article:articleName});tabs[1].href=articleName+'?mode=edit';
document.querySelectorAll('.document-tabs a').forEach(a=>{if(new URL(a.href).pathname.split('/').pop()===documentName)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
const abstract=document.getElementById('abstract-style'),printContents=document.getElementById('print-contents-option'),category=document.getElementById('category'),authors=document.getElementById('authors-demo'),authorDetails=document.getElementById('author-details');
const meta=document.querySelector('.metadata'),cat=document.querySelector('.category-field');
const distribution=document.getElementById('distribution'),distributionField=document.querySelector('.distribution-field'),customEditor=document.querySelector('.custom-label-editor'),customInput=document.getElementById('custom-category');
let selectedCategory=category.value;
const footerStyle=document.createElement('style');document.head.append(footerStyle);
const baseAuthors=config.authors;
const exampleAuthors=[{name:'Author One',title:'Research scientist',organization:'WindBorne'},{name:'Author Two',title:'Machine learning engineer',organization:'WindBorne'},{name:'Author Three',title:'Research engineer',organization:'WindBorne'}];
let currentAuthors=baseAuthors;
function updateReaderLink(){const q=new URLSearchParams({mode:'public',abstract:abstract.checked?'shaded':'plain',contents:printContents.value,category:selectedCategory,details:authorDetails.value});if(authors)q.set('authors',authors.value);q.set('distribution',distribution.value);document.querySelector('.reader-link').href=location.pathname+'?'+q.toString();refreshSaveState(true)}
function updatePDFLink(){document.querySelector('[data-pdf-link]').href=config.pdf||kind+'.pdf';updateReaderLink()}
function populateNavigation(){
 const source=[...document.querySelectorAll('.prose h2,.prose h3')];
 const ids=new Set([...document.querySelectorAll('[id]')].map(e=>e.id));let section=0,sub=0;
 const rows=[],top=[];
 for(const h of source){
  if(!h.id){const stem=h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section';let id=stem,n=2;while(ids.has(id))id=stem+'-'+n++;h.id=id;ids.add(id)}
  const isSub=h.tagName==='H3';if(isSub){if(!section)continue;sub++}else{section++;sub=0;top.push(h)}
  const li=document.createElement('li');if(isSub)li.className='subsection';
  const a=document.createElement('a');a.href='#'+h.id;
  const title=document.createElement('span');title.className='toc-entry-title';
  const number=document.createElement('span');number.className='toc-section-number';number.textContent=isSub?section+'.'+sub:section+'.';
  title.append(number,document.createTextNode(h.textContent));
  const page=document.createElement('span');page.className='toc-page';page.dataset.pageFor=h.id;a.append(title,page);li.append(a);rows.push(li);
 }
 document.querySelector('.print-contents > ol').replaceChildren(...rows);
 for(const selector of ['.toc ol','.mobile-toc ol']){
  const list=document.querySelector(selector);list.replaceChildren();top.forEach((h,i)=>{const li=document.createElement('li'),a=document.createElement('a');a.href='#'+h.id;if(selector==='.toc ol'){const n=document.createElement('span');n.className='toc-number';n.textContent=String(i+1).padStart(2,'0');a.append(n)}const label=document.createElement('span');label.textContent=h.textContent;a.append(label);li.append(a);list.append(li)})
 }
 // Captions have one source; side captions are a screen-only presentation copy.
 document.querySelectorAll('.table-block').forEach(block=>{const caption=block.querySelector('caption');if(!caption)return;let side=block.querySelector('.table-side-caption');if(!side){side=document.createElement('div');side.className='table-side-caption';side.setAttribute('aria-hidden','true');block.append(side)}side.innerHTML=caption.innerHTML});
}
populateNavigation();
// One column is a detailed index; two columns are a top-level overview.
const contentsList=document.querySelector('.print-contents > ol');
const contentsRows=[...contentsList.children];
function arrangeContents(mode){
 const nav=document.querySelector('.print-contents');nav.querySelectorAll('ol,.toc-columns').forEach(el=>el.remove());
 if(mode!=='two'){const list=document.createElement('ol');contentsRows.forEach(row=>list.append(row));nav.append(list);return}
 const sections=contentsRows.filter(row=>!row.classList.contains('subsection'));
 const split=Math.ceil(sections.length/2);
 const columns=document.createElement('div');columns.className='toc-columns';for(const part of [sections.slice(0,split),sections.slice(split)]){const list=document.createElement('ol');part.forEach(row=>list.append(row));columns.append(list)}nav.append(columns);
}
function setPrintContents(value){const wasOn=document.body.classList.contains('with-print-contents');const mode=value==='on'?'one':['one','two'].includes(value)?value:'none';printContents.value=mode;document.body.dataset.contentsLayout=mode;document.body.classList.toggle('with-print-contents',mode!=='none');arrangeContents(mode);if(mode!=='none'&&!wasOn)setAbstract('plain');updatePDFLink()}
function setAbstract(value){abstract.checked=value!=='plain';document.body.classList.toggle('abstract-plain',!abstract.checked);updatePDFLink()}
function setCategory(value){value=String(value||'').trim().slice(0,80);if(value==='__custom__')return;selectedCategory=value;
 if(![...category.options].some(o=>o.value===value)){const option=new Option(value,value);category.add(option,category.querySelector('[value="__custom__"]'))}
 cat.hidden=!value;meta.classList.toggle('has-category',!!value);cat.querySelector('dt').textContent='Category';cat.querySelector('dd').textContent=value;category.value=value;customEditor.hidden=true;updateFooter();updateReaderLink()}
function setDistribution(value){const allowed=['Public','Internal','Proprietary','Confidential'];distribution.value=allowed.includes(value)?value:'';const enabled=!!distribution.value;distributionField.hidden=!enabled;meta.classList.toggle('has-distribution',enabled);distributionField.querySelector('dd').textContent=distribution.value;
 updateFooter();updateReaderLink()}
function updateFooter(){
 const wording={Internal:'Internal use only',Proprietary:'Proprietary information',Confidential:'Confidential'};
 const categoryText=selectedCategory.replace(/[.\s]+$/,'');
 const footer=[config.organization||'WindBorne Systems',categoryText,wording[distribution.value]].filter(Boolean).join('. ')+'.';
 document.querySelector('.doc-end').textContent=footer;
 const confidential=distribution.value==='Confidential';
 const firstFooter=confidential?footer+' For authorized recipients only. Do not copy or distribute without '+(config.organization||'WindBorne Systems')+'’ permission.':footer;
 footerStyle.textContent='@page{@bottom-left{content:'+JSON.stringify(footer)+'}}@page:first{@bottom-left{content:'+JSON.stringify(firstFooter)+';'+(confidential?'width:100%;white-space:normal;line-height:1.35;text-align:left;':'')+'}}';
}
function renderAuthors(){const dd=document.querySelector('.author-value'),mode=authorDetails.value;dd.replaceChildren();document.querySelector('.author-label').textContent=currentAuthors.length===1?'Author':'Authors';
 if(mode==='none'){dd.textContent=currentAuthors.map(a=>a.name).join(', ')}else{currentAuthors.forEach(a=>{const row=document.createElement('span');row.className='author-row';row.textContent=[a.name,...(['full','title'].includes(mode)?[a.title]:[]),...(mode==='title'?[]:[a.organization])].filter(Boolean).join(', ');dd.append(row)})}
 meta.classList.toggle('authors-long',currentAuthors.length>1||currentAuthors.map(a=>a.name).join(', ').length>50);updateReaderLink()}
abstract.onchange=()=>setAbstract(abstract.checked?'shaded':'plain');printContents.onchange=()=>setPrintContents(printContents.value);category.onchange=()=>{if(category.value==='__custom__'){customEditor.hidden=false;customInput.value='';customInput.focus()}else setCategory(category.value)};authorDetails.onchange=renderAuthors;
document.querySelector('.add-label').onclick=()=>{if(customInput.value.trim())setCategory(customInput.value);else customInput.focus()};customInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();document.querySelector('.add-label').click()}});
distribution.onchange=()=>setDistribution(distribution.value);
if(authors){authors.value=(params.get('authors')||config.defaults?.authors)==='many'?'many':'single';currentAuthors=authors.value==='many'?exampleAuthors:baseAuthors;authors.onchange=()=>{currentAuthors=authors.value==='many'?exampleAuthors:baseAuthors;renderAuthors()}}
if(['none','title','organization','full'].includes(params.get('details')))authorDetails.value=params.get('details');
const defaults={abstract:'plain',contents:'two',details:'title',category:'',distribution:'Confidential',...config.defaults};
if(!params.has('details'))authorDetails.value=defaults.details;
setPrintContents(params.has('contents')?params.get('contents'):defaults.contents);setAbstract(params.get('abstract')||defaults.abstract);setCategory(params.has('category')?params.get('category'):defaults.category);renderAuthors();setDistribution(params.has('distribution')?params.get('distribution'):defaults.distribution);
addEventListener('beforeprint',()=>{if(!document.body.dataset.pdfBuild)document.body.classList.add('native-print')});addEventListener('afterprint',()=>document.body.classList.remove('native-print'));
async function printCurrent(){await document.fonts.ready;window.print()}
document.querySelector('.print-trigger').onclick=printCurrent;
function exportSettings(){return {abstract:abstract.checked?'shaded':'plain',contents:printContents.value,category:selectedCategory,distribution:distribution.value,details:authorDetails.value,authors:authors?.value||'single'}}
// Save only document settings; the article's content stays in the HTML source.
function refreshSaveState(clearFeedback=false){
 if(!saveButton)return;
 if(clearFeedback&&!saving)saveFeedback='';
 const current=exportSettings();const dirty=Object.keys(current).some(key=>current[key]!==savedDefaults[key]);
 saveButton.disabled=saving||!dirty;saveButton.setAttribute('aria-busy',String(saving));
 saveButton.querySelector('span').textContent=saving?'Saving…':'Save settings';
 saveStatus.textContent=saving?'':saveFeedback||(dirty?'Unsaved changes':'');
}
savedDefaults={authors:'single',...defaults};
saveButton=document.querySelector('.save-settings');saveStatus=document.querySelector('.save-status');
saveButton.addEventListener('click',async()=>{
 if(saving||saveButton.disabled)return;
 const snapshot=exportSettings();saving=true;saveFeedback='';refreshSaveState();
 try{
  const response=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({document:documentName,settings:snapshot,expected:savedDefaults})});
  if(!response.ok){const message=await response.text();throw Error(response.status===409?message:response.status===400?message:'Could not save. Open this document through the local editor and try again.')}
  const result=await response.json();savedDefaults=result.settings;config.defaults={...result.settings};
  const url=new URL(location.href);Object.keys(snapshot).forEach(key=>url.searchParams.delete(key));history.replaceState(null,'',url);
  saveFeedback=Object.keys(snapshot).some(key=>exportSettings()[key]!==snapshot[key])?'Saved; newer changes unsaved':'Saved';
 }catch(error){saveFeedback=error instanceof TypeError?'Could not save. Open this document through the local editor and try again.':error.message}
 finally{saving=false;refreshSaveState()}
});
refreshSaveState();
const status=document.createElement('p');status.className='export-status';status.setAttribute('role','status');status.hidden=true;document.querySelector('.options-panel').append(status);
let exporting=false;
document.querySelector('[data-pdf-link]').addEventListener('click',async e=>{
 if(config.published)return;
 e.preventDefault();if(exporting)return;
 const link=e.currentTarget,original=link.querySelector('span').textContent;
 // Open synchronously so browser popup protection doesn't swallow an async export.
 const viewer=window.open('about:blank','_blank');if(viewer)viewer.document.body.textContent='Preparing PDF…';
 exporting=true;link.setAttribute('aria-busy','true');link.querySelector('span').textContent='Preparing PDF…';
 try{
  const response=await fetch('/api/export',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({document:documentName,settings:exportSettings()})});
  if(!response.ok)throw Error('Export unavailable');const result=await response.json();
  if(viewer)viewer.location.replace(result.url);else location.assign(result.url);
  status.hidden=true;
 }catch(error){
  if(viewer)viewer.close();
  // A published static document carries an exact baked PDF, never a mismatched preset.
  const exact=config.publishedSettings&&Object.entries(exportSettings()).every(([key,value])=>config.publishedSettings[key]===value);
  if(exact){location.assign(config.pdf||kind+'.pdf');return}
  status.textContent='PDF generation needs the local document server. Run npm start, open this document there, then choose View PDF. You can also use Print current version.';status.hidden=false;
  if(!editing)alert(status.textContent);else document.querySelector('.options').open=true;
 }finally{exporting=false;link.removeAttribute('aria-busy');link.querySelector('span').textContent=original}
});

const settings=document.querySelector('.options');document.addEventListener('click',e=>{if(!settings.contains(e.target))settings.open=false});settings.addEventListener('keydown',e=>{if(e.key==='Escape'){settings.open=false;settings.querySelector('summary').focus()}});
const toc=[...document.querySelectorAll('.toc a')];const headings=toc.map(a=>document.getElementById(a.hash.slice(1))).filter(Boolean);let scheduled=false;
function update(){const threshold=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)+4;let current=headings[0];for(const h of headings){if(h.getBoundingClientRect().top<=threshold)current=h}if(innerHeight+scrollY>=document.documentElement.scrollHeight-3)current=headings.at(-1);toc.forEach(a=>{if(a.hash==='#'+current?.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});scheduled=false}
function scheduleUpdate(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}addEventListener('scroll',scheduleUpdate,{passive:true});addEventListener('resize',scheduleUpdate);addEventListener('hashchange',scheduleUpdate);document.fonts.ready.then(scheduleUpdate);if(headings.length)update();
const dialog=document.querySelector('dialog');document.querySelectorAll('.figure-art').forEach(b=>b.onclick=()=>{const f=b.closest('figure');const art=dialog.querySelector('.enlarged-art');art.innerHTML=b.innerHTML;art.querySelectorAll('[id]').forEach(el=>{const old=el.id;const next='lightbox-'+old;el.id=next;art.querySelectorAll('*').forEach(node=>{for(const attr of [...node.attributes]){if(attr.value.includes('url(#'+old+')'))node.setAttribute(attr.name,attr.value.replaceAll('url(#'+old+')','url(#'+next+')'))}})});dialog.querySelector('.enlarged-caption').innerHTML=f.querySelector('figcaption').innerHTML;dialog.showModal()});dialog.querySelector('button').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog)dialog.close()};

"""Structural checks for authored HTML; no network or source rewriting."""
from html.parser import HTMLParser
from pathlib import Path
import json,sys
class Document(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.errors=[];self.config='';self.in_config=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id'in a:self.ids.append(a['id'])
  if tag=='a' and a.get('href','').startswith('#'):self.links.append(a['href'][1:])
  if tag=='img' and not a.get('alt'):self.errors.append('Image needs alt text')
  if tag in ['h2','h3'] and not a.get('id') and a.get('class')!='contents-label':pass # Runtime assigns stable slugs when omitted.
  if tag=='script' and a.get('id')=='document-config':self.in_config=True
 def handle_endtag(self,tag):
  if tag=='script':self.in_config=False
 def handle_data(self,data):
  if self.in_config:self.config+=data
for file in sys.argv[1:] or ['starter.html','specimen.html','conop.html','stress-report.html']:
 p=Document();p.feed(Path(file).read_text());p.errors += ['Duplicate ID: '+v for v in set(p.ids) if p.ids.count(v)>1]
 p.errors += ['Broken internal link: #'+v for v in p.links if v not in p.ids]
 try:
  cfg=json.loads(p.config)
  assert cfg['authors'] and all(a.get('name') for a in cfg['authors'])
 except Exception:p.errors.append('document-config needs valid JSON and named authors')
 if p.errors:raise SystemExit(file+':\n'+'\n'.join(p.errors))
 print('Structure passed: '+file)

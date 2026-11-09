import json,sys
from pypdf import PdfReader
r=PdfReader(sys.argv[1]);print(json.dumps({str(k).lstrip('/'):r.get_destination_page_number(v)+1 for k,v in r.named_destinations.items()}))

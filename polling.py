import urllib2
import time
import sys
import pickle
proxy_handler = urllib2.ProxyHandler({})
opener = urllib2.build_opener(proxy_handler)
urllib2.install_opener(opener)

while True:
	print('yes')
	sys.stdout.flush()
	html='<html><table>'
	js='<script src="http://10.11.11.35:3001/readjquery">  </script>';
	f1=open('listofips','r');
	ip_index=0
	allfiles=''
	ips=pickle.load(open("ips","rb"))
	for line in f1:
		if(line[:-1] not in ips):
			ips[line[:-1]]="1"
	for key in ips:
		try:
			
			url='http://'+key+':3000/downloads'
			print(url);
			sys.stdout.flush()
			temp=urllib2.urlopen(url,timeout=0.1).read()
			temp=temp.split('\n')
			temp=temp[:-1]
			ids=ip_index*10000
			for files in temp:
				html+='<tr>'
				html+='<tr><td><button type="TEXT" id="'+(str)(ids)+'" size="40">'+files+'<br></td></td>';
				html+='</tr>'
				js+='<script>$(document).ready(function(){$("#'+(str)(ids)+'").click(function(){window.location="http://'+key+':3000/downloads/'+(str)(ids%10000)+'";});})</script>';
				allfiles+=key+' '+files+'\n'
				ids+=1
			ip_index+=1
		except:
			continue
	pickle.dump(ips,open("ips","wb"))
	html+='</table></html>'
	f2=open('allfiles.html','w')
	f2.write(html+js)
	f2.close()
	f1.close()
	f2=open('allfiles','w')
	f2.write(allfiles)
	f2.close()
	f1.close()
	time.sleep(5);
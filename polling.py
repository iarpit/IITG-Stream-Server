import urllib2
import time
import sys
proxy_handler = urllib2.ProxyHandler({})
opener = urllib2.build_opener(proxy_handler)
urllib2.install_opener(opener)

while True:
	print('yes')
	sys.stdout.flush()
	html='<html><table>'
	js='<script src="http://10.11.11.35:3000/readjquery">  </script>';
	f1=open('listofips','r');
	ip_index=0
	for line in f1:
		try:
			
			url='http://'+line[:-1]+':3000/downloads'
			print(url);
			sys.stdout.flush()
			temp=urllib2.urlopen(url).read()
			temp=temp.split('\n')
			temp=temp[:-1]
			ids=ip_index*10000
			for files in temp:
				html+='<tr>'
				html+='<tr><td><button type="TEXT" id="'+(str)(ids)+'" size="40">'+files+'<br></td></td>';
				html+='</tr>'
				js+='<script>$(document).ready(function(){$("#'+(str)(ids)+'").click(function(){window.location="http://'+line[:-1]+':3000/downloads/'+(str)(ids%10000)+'";});})</script>';
				ids+=1
			ip_index+=1
		except:
			continue
	html+='</table></html>'
	f2=open('allfiles.html','w')
	f2.write(html+js)
	f2.close()
	f1.close()
	time.sleep(5);
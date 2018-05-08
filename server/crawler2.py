from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re
import sys
from flask import Flask, url_for
from flask import request
from flask import jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

lastid = 0 
@app.route('/')
def api_root():
    return 'Welcome'

def setlastid(value):
    global lastid
    lastid = value

def getlastid():
    global lastid
    return  lastid 

def setmaxdepth(value):
    global maxdepth
    maxdepth = value

def getmaxdepth():
    global maxdepth
    return  maxdepth

class MyClass(object):

    def __init__(self, params):
        self.maxdepth = 4
        self.lastid = 0
        '''
        Constructor
        '''
#def addURL(self,parentURL,childURL):
#    self.urlList[parentURL].append(childURL)
     
def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None

    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200 
            and content_type is not None 
            and content_type.find('html') > -1)


def log_error(e):
    """
    It is always a good idea to log errors. 
    This function just prints them, but you can
    make it do anything.
    """
    print(e)        

@app.route('/findurl',methods=['GET','POST'])
def api_URLFIND():
 
    if request.method == 'POST':
        data = request.get_json()
        if data is not None:
            print("Request is a JSON")
            url = data['url']
            dfs = data['dfs']
            depth = int(data['depth'])
        else:
            url = request.form.get('url')
            dfs = request.form.get('dfs')
            depth = int(request.form.get('depth'))
    else:
        url = "http://yahoo.com"
        dfs = "bfs"
        depth = 3
    if not(isinstance(depth, int)):
        depth = 3
    setmaxdepth(depth)        
    urlList = []
 
    ReadURLOnPage(url,1,1,urlList)
    results = BuildList(urlList,1)
     
    return jsonify(results)
        #geturls()
     

#def ReadURLOnPage(url):
def BuildList(URLList,targetdepth):
    if (targetdepth==getmaxdepth()):
        return URLList
    for childurl in URLList:
            if (childurl.get('depth',None) == targetdepth):
                ReadURLOnPage(childurl.get('url',None),childurl.get('id',None),targetdepth+1,URLList)
    BuildList(URLList,targetdepth+1)
    return URLList

def ReadURLOnPage(url,parentid,depth,URLList):
    if url is None:
        return
    raw_html = simple_get(url)
    if raw_html is None:
        return
    html = BeautifulSoup(raw_html, 'html.parser')
 #found code below here: https://pythonspot.com/extract-links-from-webpage-beautifulsoup/ 
 
    id = getlastid()
    for link in html.findAll('a', attrs={'href': re.compile("^http://")}):
       # links.append(link.get('href'))
        foundurl = link.get('href')
        id = id + 1
        urlrecord = {"id": id,"url":foundurl,"parenturl":url,"parentid":parentid,"depth":depth}
        URLList.append(urlrecord)
    setlastid(id)
    return URLList

@app.after_request
def apply_caching(response):
    #response.headers.add('Access-Control-Allow-Origin', '*')
    #response.headers.add('Access-Control-Allow-Headers', '*')
    return response

if __name__ == "__main__":
    #app.run(host= '0.0.0.0') 
    app.run(host= '172.31.22.173',port=5000)
    
    

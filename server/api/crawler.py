'''
Created on Apr 16, 2018

@author: swright
'''
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re
from flask import Flask, url_for
from flask import request
from flask import jsonify
from flask_cors import CORS
from random import randint
from sys import platform

app = Flask(__name__)
CORS(app)
lastid = 0
isDFS = False 
searchTerm = "" 
 
@app.route('/')
def api_root():
    return 'Welcome'

def setisDFS(value):
    global isDFS
    if value == "dfs":
        isDFS = True
    else:
        isDFS = False

def getisDFS():
    global isDFS
    return  isDFS 
 
def setsearchTerm(value):
    global searchTerm
    searchTerm = value

def getsearchTerm():
    global searchTerm
    return  searchTerm 
  
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
            url = data['url']
            dfs = data['dfs']
            depth = int(data['depth'])
            #searchTerm = data['searchTerm']
        else:
            url = request.form.get('url')
            dfs = request.form.get('dfs')
            depth = int(request.form.get('depth'))
            #searchTerm = request.form.get('searchTerm')
    else:
        url = "http://yahoo.com"
        dfs = "bfs"
        depth = 3    
    setmaxdepth(depth)
    #setsearchTerm(searchTerm)
    urlList = []
    initList(urlList,url)     
    
    setisDFS(dfs)
    if getisDFS():
        urlRecord = ReadURLOnPage(url,1,1,urlList)
        results = DFS_Search(urlRecord,1,urlList)
    else:
        ReadURLOnPage(url,1,1,urlList)
        results = BFS_Search(urlList,1)         
    return jsonify(results)
def initList(URLList,url):
    urlrecord = {"id": 1,"url":url,"parenturl":url,"parentid":0,"depth":0,"searchmatch":0}
    setlastid(1)
    URLList.append(urlrecord)
    

def BFS_Search(URLList,targetdepth):
    if (targetdepth==getmaxdepth()):
        return URLList
    for childurl in URLList:
            if (childurl.get('depth',None) == targetdepth):
                ReadURLOnPage(childurl.get('url',None),childurl.get('id',None),targetdepth+1,URLList)
    BFS_Search(URLList,targetdepth+1)
    return URLList

def DFS_Search(urlRecord,targetdepth,URLList):
    if (targetdepth==getmaxdepth()):
        return URLList
    if isinstance(urlRecord, dict): #TODO: Fix this code and get rid of this patch
        urlResult = ReadURLOnPage(urlRecord.get('url',None),urlRecord.get('id',None),targetdepth+1,URLList)
    else:
        urlResult = ReadURLOnPage(urlRecord[0].get('url',None),urlRecord[0].get('id',None),targetdepth+1,URLList)
    if urlResult is None:
        return URLList #ended up in a dead-end, bail out for now
    DFS_Search(urlResult,targetdepth+1,URLList)
    return URLList

def ReadURLOnPage(url,parentid,depth,URLList):
    if url is None:
        return
    raw_html = simple_get(url)
    if raw_html is None:
        return
    html = BeautifulSoup(raw_html, 'html.parser')
 #found code below here: https://pythonspot.com/extract-links-from-webpage-beautifulsoup/ 
    url_id = getlastid()
    htmlSearch = html.findAll('a', attrs={'href': re.compile("^http://")})
    #FIXME searchResults = html.findAll(text=re.compile(getsearchTerm()), limit=1)
    #FIXME searchLen = len(searchResults)
    found = 0   
    #if searchLen > 0:
     #   found = 1
    if getisDFS():
        resultLen = len(htmlSearch)
        if (resultLen > 0):
            randURLID = randint(0, resultLen-1)
            htmlSearch = htmlSearch[randURLID]
            foundurl = htmlSearch.get('href')
            url_id = url_id + 1
            urlrecord = {"id": url_id,"url":foundurl,"parenturl":url,"parentid":parentid,"depth":depth, "searchmatch":found}
            URLList.append(urlrecord)
            setlastid(url_id)
            return urlrecord
    else:
        for link in  htmlSearch:#html.findAll('a', attrs={'href': re.compile("^http://")}):
            foundurl = link.get('href')
            url_id = url_id + 1
            urlrecord = {"id": url_id,"url":foundurl,"parenturl":url,"parentid":parentid,"depth":depth,"searchmatch":found}
            URLList.append(urlrecord)
        setlastid(url_id)
    return URLList

@app.after_request
def apply_caching(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

if __name__ == "__main__":
    #app.run(host= '0.0.0.0',port=5002) 
    #app.run(host= '127.0.0.1',port=5002) 
    #http://127.0.0.1:5002
    if platform == "linux" or platform == "linux2":
        app.run(host= '172.31.22.173',port=5002)
    else:
        app.run(host= '127.0.0.1',port=5002) 
        
    

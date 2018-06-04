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
import logging 
from fileinput import filename
import time
# from test.test_logging import LEVEL_RANGE 

app = Flask(__name__)
CORS(app)
lastid = 0
isDFS = False 
searchTerm = "" 
SearchTermIsFound = 0
deadEnd = 0
abortTime = 0
# repeat = 0 #for debugging
searchedURLs = []
 

 
@app.route('/')
def api_root():
    return 'Welcome'


def setdeadEnd(value):
    global deadEnd
    deadEnd = value


def getdeadEnd():
    global deadEnd
    return  deadEnd 


def setisDFS(value):
    global isDFS
    if value == "dfs":
        isDFS = True
    else:
        isDFS = False


def getisDFS():
    global isDFS
    return  isDFS 

 
###########################
def getAbortTime():
    global abortTime  
    return abortTime

 
def setAbortTime(value):
    global abortTime  
    if (value > 0):
        abort_after = value
    else:
        abort_after = 5 * 60
    abortTime = time.time() + abort_after
 
###########################


def setsearchTerm(value):
    global searchTerm
    if isinstance(value, str):
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


def setSearchTermIsFound(value):
    global SearchTermIsFound
    SearchTermIsFound = value


def getSearchTermIsFound():
    global SearchTermIsFound
    return  SearchTermIsFound 

  
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
# def addURL(self,parentURL,childURL):
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
            elif is_Too_Many_Request_response(resp):
                return "429"
            else:
                return None

    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None


def is_Too_Many_Request_response(resp):
    """
    Returns true if the response is 429, indicating too many request to this server 
    """
    return (resp.status_code == 429) 


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


@app.route('/findurl', methods=['GET', 'POST'])
def api_URLFIND():
    
    if request.method == 'POST':
        data = request.get_json()
        if data is not None:
            if 'url' in data:
                url = data['url']
            else:
                url = "http://www.yahoo.com/"
            if 'dfs' in data:
                dfs = data['dfs']
            else:
                dfs = "bfs"
            if 'depth' in data:
                depth = int(data['depth'])
            else:
                depth = 3
            if 'searchterm' in data:
                searchTerm = data['searchterm']
            else:
                searchTerm = ""    
        else:
            url = request.form.get('url')
            dfs = request.form.get('dfs')
            depth = int(request.form.get('depth'))
            searchTerm = request.form.get('searchterm')
    else:
        url = "http://yahoo.com"
        dfs = "bfs"
        depth = 3    
    setmaxdepth(depth)
    setsearchTerm(searchTerm)
    URLList = []
    setAbortTime(0)
    URLList = initList(URLList, url)     
    
    setisDFS(dfs)
    if getisDFS():
        urlRecord = ReadURLOnPage(url, 1, 1, URLList)
        results = DFS_Search(urlRecord, 1, URLList)
    else:
        ReadURLOnPage(url, 1, 1, URLList)
        results = BFS_Search(URLList, 1) 
    # global repeat #for debugging
    # print("found this" + str(repeat))             
    return jsonify(results)


def initList(URLList, url):
    urlrecord = {"id": 1, "url":url, "parenturl":url, "parentid":0, "depth":0, "searchmatch":0, "deadend":0} 
    setlastid(1)
    URLList.append(urlrecord)
    global searchedURLs
    searchedURLs = []
    setdeadEnd(0)
    setSearchTermIsFound(0)
    return URLList


def BFS_Search(URLList, targetdepth):
    if ((targetdepth == getmaxdepth() or (getSearchTermIsFound() == 1))):
        return URLList
    for childurl in URLList:
            # url":foundurl,"parenturl":url
            if (getdeadEnd() == 1):
                return URLList
            if (childurl.get('depth', None) == targetdepth) :
                ReadURLOnPage(childurl.get('url', None), childurl.get('id', None), targetdepth + 1, URLList)
                if (getSearchTermIsFound() == 1):
                    return URLList
    BFS_Search(URLList, targetdepth + 1)
    return URLList


def DFS_Search(urlRecord, targetdepth, URLList):
    if ((targetdepth == getmaxdepth() or (getSearchTermIsFound() == 1)) or (getdeadEnd() == 1)):  
        return URLList
    #if (getlastid() % 250 == 0):
       # print(str(getAbortTime()))
#        if (time().time() > getAbortTime()):
 #           return URLList
    if isinstance(urlRecord, dict):  # TODO: Fix this code and get rid of this patch 
        urlResult = ReadURLOnPage(urlRecord.get('url', None), urlRecord.get('id', None), targetdepth + 1, URLList)
    else:
        urlResult = ReadURLOnPage(urlRecord[0].get('url', None), urlRecord[0].get('id', None), targetdepth + 1, URLList)
    if urlResult is None:
        return URLList  # ended up in a dead-end, bail out for now  
    DFS_Search(urlResult, targetdepth + 1, URLList)
    return URLList


def searchThisPageForSearchWord(html, webpage):
    found = 0
    if (len(getsearchTerm()) > 0):
        
        searchResults = html.findAll(text=re.compile(getsearchTerm()), limit=1)
        searchLen = len(searchResults)
        if searchLen > 0:
            found = 1
            setSearchTermIsFound(1)   
    return found


def handleDeadEnd(URLList, url,flag=1):
    if len(URLList) > 1:
        lastItem = URLList[-1]
    elif len(URLList) == 1:
        lastItem = URLList[0]
    else:    
        initList(URLList, url)
        lastItem = URLList[0]
        
    lastItem["deadend"] = flag
    newUrlList = URLList[:-1]
    newUrlList.append(lastItem)
    URLList = newUrlList
    setdeadEnd(1)
    return URLList


def ReadURLOnPage(url, parentid, depth, URLList):
    if url is None:
        return
    if url in searchedURLs:
       # global repeat #for debugging
       # repeat = repeat + 1 #for debugging
        return URLList
    
    searchedURLs.append(url)    
    raw_html = simple_get(url)
    if raw_html is None:
        return
    if raw_html == 429:
        return handleDeadEnd(URLList, url)
    html = BeautifulSoup(raw_html, 'html.parser')
 # found code below here: https://pythonspot.com/extract-links-from-webpage-beautifulsoup/   
    url_id = getlastid()
    htmlSearch = html.findAll('a', attrs={'href': re.compile("^http://|^https://")})
 
    if getisDFS():
        resultLen = len(htmlSearch)
        if (resultLen == 0):
            return handleDeadEnd(URLList, url)
        else:
            randURLID = randint(0, resultLen - 1)
            htmlSearch = htmlSearch[randURLID]
            foundurl = htmlSearch.get('href')
            if (foundurl == url):  # url we found matches the parent, so bail out
                return handleDeadEnd(URLList, url)
            found = searchThisPageForSearchWord(html, foundurl)
            url_id = url_id + 1
            urlrecord = {"id": url_id, "url":foundurl, "parenturl":url, "parentid":parentid, "depth":depth, "searchmatch":found, "deadend":0}
            URLList.append(urlrecord)
            setlastid(url_id)
            return urlrecord
    else:  # BFS search
        for link in  htmlSearch:  # html.findAll('a', attrs={'href': re.compile("^http://")}):
            foundurl = link.get('href')
            found = searchThisPageForSearchWord(html, foundurl)
            url_id = url_id + 1
            urlrecord = {"id": url_id, "url":foundurl, "parenturl":url, "parentid":parentid, "depth":depth, "searchmatch":found, "deadend":0}
            #print (foundurl + url)
            #print (str(url_id))
            
             
            if ((foundurl != url) or (parentid == 1)):
                URLList.append(urlrecord)
            if (url_id % 250 == 0): #every 250 nodes, check to see if more than 5 minutes has elapsed. if it has, then end the search
                if (time.time() > getAbortTime()) or (url_id >= 2000):  #end search after 2000 nodes. 2 team members ran test on multiple browsers and found 2000 to be the max threshold our graph could consistently render
                    handleDeadEnd(URLList, url,2)
                    return URLList
            if (found == 1):
                return URLList  # break
        setlastid(url_id)
    return URLList


@app.after_request
def apply_caching(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response


if __name__ == "__main__":
    logging.basicConfig(filename='crawler.log', level=logging.DEBUG)
    if platform == "linux" or platform == "linux2":
        app.run(host='172.31.22.173', port=5006)
    else:
        app.run(host='127.0.0.1', port=5006) 
    

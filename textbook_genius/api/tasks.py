# from .models import
from celery import shared_task
from requests import Request,post,get,patch

APIKEY="0ac44ae016490db2204ce0a042db2916"

@shared_task
def get_douban_info(isbn):
    header = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74."}
    base='https://api.douban.com'
    req=Request('GET',base+'/v2/book/isbn/:'+isbn,params={'apiKey':APIKEY},headers=header)
    url=req.prepare().url

    res=get(url,headers=header)
    return res.json()
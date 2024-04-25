from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RoomSerializer
from .models import Room
from requests import Request,post,get
APIKEY="0ac44ae016490db2204ce0a042db2916"
# Create your views here.

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    print('in room')
    serializer_class = RoomSerializer

class getBook(APIView):
    def get(self,request,farmat=None):
        scopes='book_basic_r'
        isbn = request.GET.get('isbn')
        header = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74."}
        base='https://api.douban.com'
        req=Request('GET',base+'/v2/book/isbn/:'+isbn,params={'apiKey':APIKEY},headers=header)
        url=req.prepare().url

        res=get(url,headers=header)
        print(res.json())
        # return Response(res.json(),status=status.HTTP_200_OK)
        return Response(res.json(),status=status.HTTP_200_OK)
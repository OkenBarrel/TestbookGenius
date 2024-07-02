from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import RoomSerializer,BookSerializer
from .models import Room,Book
from requests import Request,post,get
APIKEY="0ac44ae016490db2204ce0a042db2916"
# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    print('in room')
    serializer_class = RoomSerializer

class get_doubanBook(APIView):
    def get(self,request,format=None):
        # scopes='book_basic_r'
        isbn = request.GET.get('isbn')
        header = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74."}
        base='https://api.douban.com'
        req=Request('GET',base+'/v2/book/isbn/:'+isbn,params={'apiKey':APIKEY},headers=header)
        url=req.prepare().url

        res=get(url,headers=header)
        # print(res.json())
        # return Response(res.json(),status=status.HTTP_200_OK)
        return Response(res.json(),status=status.HTTP_200_OK)
    
class get_book(APIView):
    lookup_kwarg='isbn'
    serializer_class=BookSerializer
    def get(self,request,format=None):
        isbn=request.GET.get(self.lookup_kwarg)
        if isbn!=None:
            book=Book.objects.filter(isbn=isbn)
            if len(book)>0:
                data=BookSerializer(book[0]).data
                return Response(data,status=status.HTTP_200_OK)
            return Response({'Book not found":"invalid ISBN.'},status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request':'isbn not found in request'},status=status.HTTP_400_BAD_REQUEST)

    
class createBook(APIView):

    serializer_class=BookSerializer
    def post(self,request,format=None):

        book_serializer=self.serializer_class(data=request.data)
        print(book_serializer)
        if book_serializer.is_valid():
            title=book_serializer.data.get('title')
            isbn=book_serializer.data.get('isbn')
            author=book_serializer.data.get('author')
            publisher=book_serializer.data.get('publisher')
            pubdate=book_serializer.data.get('pubdate')
            cover=book_serializer.data.get('cover')
            douban_url=book_serializer.data.get('douban_url')

            teacher=book_serializer.data.get('teacher')
            course=book_serializer.data.get('course')
            
            # book = Book(isbn=isbn)
            queryset=Book.objects.filter(isbn=isbn)
            if queryset.exists():
                return Response({'Created':'already exists'},status.HTTP_409_CONFLICT)
            else:
                book=Book(isbn=isbn,title=title,author=author,publisher=publisher,pubdate=pubdate,cover=cover,douban_url=douban_url)
                book.save()
                return Response(BookSerializer(book).data,status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response({'Bad Request':'invalid'},status.HTTP_404_NOT_FOUND)
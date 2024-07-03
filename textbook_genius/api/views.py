from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import RoomSerializer,BookSerializer,TeacherSerializer,CourseSerializer,CommentSerializer,LikeSerializer,UserSerializer,UsebookSerializer,MarkSerializer
from .models import Room,Book,Teacher,Course,Comment,Usebook,User,Like,Mark
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
    '''
    {
        "book": {
            "isbn": "",
            "title": "",
            "author": [""],
            "publisher": "",
            "pubdate": "",
            "cover": "",
            "douban_url": ""
        },
        "teacher": {
            "teacher_name":""
        },
        "course": {
            "course_name": "",
            "department":""
        },
        "school_year":"2",
        "semester":""
    }
    '''
    book_serializer_class=BookSerializer
    useBook_serializer_class=UsebookSerializer
    course_serializer_class=CourseSerializer
    teacher_serializer_class=TeacherSerializer
    def post(self,request,format=None):
        book_data=request.data.get("book")
        # print(request.data)
        # print(book_data)
        book_serializer=self.book_serializer_class(data=book_data)
        if book_serializer.is_valid():
            title=book_serializer.data.get('title')
            isbn=book_serializer.data.get('isbn')
            author=book_serializer.data.get('author')
            publisher=book_serializer.data.get('publisher')
            pubdate=book_serializer.data.get('pubdate')
            cover=book_serializer.data.get('cover')
            douban_url=book_serializer.data.get('douban_url')
            
            queryset=Book.objects.filter(isbn=isbn)
            if queryset.exists():
                print("{0} is already created".format(title))
                book=queryset[0]
                print(book)
                # return Response({'Created':'already exists'},status.HTTP_409_CONFLICT)
            else:
                book=Book(isbn=isbn,title=title,author=author,publisher=publisher,pubdate=pubdate,cover=cover,douban_url=douban_url)
                book.save()
                # return Response(BookSerializer(book).data,status.HTTP_201_CREATED)
        else:
            print('book')
            queryset=Book.objects.filter(isbn=book_data['isbn'])
            book=queryset[0]
            print(book)
            print(book_serializer.errors)
        course_name=request.data.get("course")
        course_serializer=self.course_serializer_class(data=course_name)
        if course_serializer.is_valid():
            course_name=course_serializer.data.get('course_name')
            department=course_serializer.data.get('department')
            queryset=Course.objects.filter(course_name=course_name)
            if queryset.exists():
                print("{0} is already created".format(course_name))
                course=queryset[0]
                # return Response({'Created':'already exists'},status.HTTP_409_CONFLICT)
            else:
                course=Course(course_name=course_name,department=department)
                course.save()
                # return Response(BookSerializer(book).data,status.HTTP_201_CREATED)
        else:
            print('course')
            queryset=Course.objects.filter(course_name=course['course_name'],department=course['department'])
            course=queryset[0]
            print(course_serializer.errors)
        
        teacher=request.data.get("teacher")
        print(teacher)
        teacher_serializer=self.teacher_serializer_class(data=teacher)
        
        if teacher_serializer.is_valid():
            teacher_name=teacher_serializer.data.get('teacher_name')
            queryset=Teacher.objects.filter(teacher_name=teacher_name)
            if queryset.exists():
                print("{0} is already created".format(teacher_name))
                teacher=queryset[0]
                # return Response({'Created':'already exists'},status.HTTP_409_CONFLICT)
            else:
                teacher=Teacher(teacher_name=teacher_name)
                teacher.save()
                # return Response(BookSerializer(book).data,status.HTTP_201_CREATED)
        else:
            print('teacher')
            queryset=Teacher.objects.filter(teacher_name=teacher["teacher_name"])
            course=queryset[0]
            # print(teacher_serializer)
            print(teacher_serializer.errors)
        
        usebook_data={
            "course":course_name,
            "teacher":teacher_serializer.data.get('teacher_name'),
            "book":book_serializer.data.get('isbn'),
            "school_year":request.data.get("school_year"),
            "semester":request.data.get("semester")
        }
        useBook_serializer=self.useBook_serializer_class(data=usebook_data)
        print(useBook_serializer)
        if useBook_serializer.is_valid():
            
            # book = Book(isbn=isbn)
            queryset=Usebook.objects.filter(book=book,course=course,teacher=teacher)
            if queryset.exists():
                return Response({'Created':'already exists'},status.HTTP_409_CONFLICT)
            else:
                useBook=Usebook(book=book,course=course,teacher=teacher)
                useBook.save()
                return Response(UsebookSerializer(useBook).data,status.HTTP_201_CREATED)
        else:
            print('useBook')
            print(useBook_serializer.errors)
        return Response({'Bad Request':'invalid'},status.HTTP_404_NOT_FOUND)
    


class updateBook(APIView):
    serializer_class=BookSerializer
    def patch(self,request,format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            isbn=serializer.data.get('isbn')
            title=serializer.data.get('title')
            author=serializer.data.get('author')
            publisher=serializer.data.get('publisher')
            pubdate=serializer.data.get('pubdate')
            cover=serializer.data.get('cover')
            douban_url=serializer.data.get('douban_url')

            Book.objects.filter(isbn=isbn).update(title=title,author=author,publisher=publisher,pubdate=pubdate,cover=cover,douban_url=douban_url)
            return Response(BookSerializer(Book.objects.filter(isbn=isbn)).data,status.HTTP_200_OK)
        
        
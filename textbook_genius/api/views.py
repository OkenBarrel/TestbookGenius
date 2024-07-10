from django.shortcuts import render
from django.db.models import Q
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view,renderer_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from .serializers import RoomSerializer,BookSerializer,TeacherSerializer,CourseSerializer,\
    CommentSerializer,LikeSerializer,UserSerializer,UsebookSerializer,MarkSerializer,\
    ScoreUserRelationSerializer,SearchSerializer
from .models import Room,Book,Teacher,Course,Comment,Usebook,User,Like,Mark,ScoreUserRelation
from requests import Request,post,get,patch

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
        "school_year":"",
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
        #print(book_data)
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
        course=request.data.get("course")
        course_serializer=self.course_serializer_class(data=course)
        if course_serializer.is_valid():
            course_name=course_serializer.data.get('course_name')
            department=course_serializer.data.get('department')
            queryset=Course.objects.filter(course_name=course_name,department=department)
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
            print(teacher_serializer.errors)
            print(teacher)
            queryset=Teacher.objects.filter(teacher_name=teacher["teacher_name"])
            teacher=queryset[0]
            # print(teacher_serializer)
            
        
        usebook_data={
            "course_name":course.course_name,
            "department":course.department,
            "teacher":teacher.teacher_name,
            "book":book.isbn,
            "school_year":request.data.get("school_year"),
            "semester":request.data.get("semester")
        }
        print(usebook_data)
        useBook_serializer=self.useBook_serializer_class(data=usebook_data)
        print(useBook_serializer)
        if useBook_serializer.is_valid():
            queryset=Usebook.objects.filter(book=book,course=course,teacher=teacher)
            if queryset.exists():
                return Response({'Created':'already exists'},status.HTTP_409_CONFLICT)
            else:
                useBook=Usebook(book=book,course=course,teacher=teacher,school_year=usebook_data['school_year'],semester=usebook_data['semester'])
                useBook.save()
                return Response(UsebookSerializer(useBook).data,status.HTTP_200_OK)
        else:
            print('useBook')
            print(useBook_serializer.errors)
            return Response({'Created':'already exists'},status.HTTP_409_CONFLICT)
        return Response({'Bad Request':'invalid'},status.HTTP_404_NOT_FOUND)
    

class updateBook(APIView):
    #book_serializer_class=BookSerializer
    #useBook_serializer_class=UsebookSerializer
    #course_serializer_class=CourseSerializer
    #teacher_serializer_class=TeacherSerializer

    def patch(self,request):
        book_data=request.data.get("book")
        #book_data=JSONParser().parse(request.data.get("book"))
        print(book_data)
        #book_serializer=self.book_serializer_class(data=book_data)
       # book_serializer=BookSerializer(data=book_data)
        book=Book.objects.get(isbn=book_data['isbn'])
        book_up=BookSerializer(instance=book,data=book_data)
        if book_up.is_valid():
            book_up.save()
            return Response(BookSerializer(book).data,status.HTTP_200_OK)
        else:
            return Response({'Bad Request':'invalid'},status.HTTP_404_NOT_FOUND) 
        """
        if book_serializer.is_valid():
            isbn=book_serializer.data.get('isbn')
            title=book_serializer.data.get('title')
            author=book_serializer.data.get('author')
            publisher=book_serializer.data.get('publisher')
            pubdate=book_serializer.data.get('pubdate')
            cover=book_serializer.data.get('cover')
            douban_url=book_serializer.data.get('douban_url')

            Book.objects.filter(isbn=isbn).update(title=title,author=author,publisher=publisher,pubdate=pubdate,cover=cover,douban_url=douban_url)
            return Response(BookSerializer(Book.objects.filter(isbn=(book_data['isbn']))).data,status.HTTP_200_OK)
        else:
            return Response({'Bad Request':'invalid'},status.HTTP_404_NOT_FOUND) 
        """


class getUseBook(APIView):
    def get(self,request,format=None):
        query_params=request.GET
        filter_params={}
        print(query_params)
        if 'isbn' in query_params:
            filter_params['book__isbn']=query_params.get('isbn')

        usebook_queryset = Usebook.objects.filter(**filter_params)
        
        # Serialize the queryset
        serializer = UsebookSerializer(usebook_queryset, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
        
class register(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class scoreUser(APIView):
    '''
    {
        useBook:{useBook的id},
        user:{user_id}
    }
    '''
    serializer_class=ScoreUserRelationSerializer
    def post(self,request):
        # usebook_id=request.data.get('useBook')
        # user_id=request.data.get('user_id')

        serializer=self.serializer_class(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response({"Already exists":"already scored this one."},status=status.HTTP_409_CONFLICT)
        user_id=serializer.data.get('user')
        usebook_id=serializer.data.get('useBook')
        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        try:
            usebook=Usebook.objects.get(id=usebook_id)
        except Usebook.DoesNotExist:
            return Response({"error": "UseBook relation not found."}, status=status.HTTP_404_NOT_FOUND)
        scoreUser=ScoreUserRelation(user=user,useBook=usebook)
        scoreUser.save()
        return Response(ScoreUserRelationSerializer(scoreUser).data,status=status.HTTP_200_OK)
        # useBook=Usebook.objects.filter(id=usebook_id)
        # if not useBook.exists():
        #      return Response({"Bad Request": "Invalid useBook relation."},status=status.HTTP_404_NOT_FOUND)

        # serializer=self.serializer_class(data=request.data)
        # if serializer.is_valid():
        #     user_id=serializer.data.get('user_id')
        #     user=User.objects.filter(user_id=user_id)
        #     if not user.exists():
        #         return Response({"Bad request":"Ivalid User."},status=status.HTTP_404_NOT_FOUND)
        #     scoreUser=ScoreUserRelation(useBook=useBook,user=user)
        #     scoreUser.save()
        #     return Response(scoreUser.data,status=status.HTTP_200_OK)
        # else:
        #     print(serializer.errors)
        #     return Response({"Already exists":"already scored this one."},status=status.HTTP_409_CONFLICT)

    def delete(self,request):
        usebook_id=request.data.get('usebook')
        useBook=Usebook.objects.filter(id=usebook_id)
        if not useBook.exists():
             return Response({"Bad Request": "Invalid useBook relation."},status=status.HTTP_404_NOT_FOUND)

        serializer=self.serializer_class(data=request.data)
        pass 

class SearchView(APIView):
    serializer_class = SearchSerializer

    def get(self, request):
        query_params = request.query_params
        query = query_params.get('query', '')

        title_filter = Q(book__title__icontains=query)
        course_filter = Q(course__course_name__icontains=query)
        department_filter = Q(course__department__icontains=query)

        search_results = Usebook.objects.filter(title_filter | course_filter | department_filter).select_related('book', 'teacher', 'course').distinct()

        serialized_results = self.serializer_class(search_results, many=True).data

        return Response(serialized_results, status=status.HTTP_200_OK)
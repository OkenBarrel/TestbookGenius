from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view,renderer_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from .serializers import RoomSerializer,BookSerializer,TeacherSerializer,CourseSerializer,\
    CommentSerializer,LikeSerializer,UsebookSerializer,MarkSerializer,\
    UpScoreUserRelationSerializer,ProfileSerializer,DownScoreUserRelationSerializer
from .models import Room,Book,Teacher,Course,Comment,Usebook,Like,Mark,\
                    UpScoreUserRelation, Profile,DownScoreUserRelation
from requests import Request,post,get,patch
from django.db.models import Count
from django.shortcuts import get_object_or_404

from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout

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
        "isbn": “isbn号”,str,长度:13,,
        "title": "书名",str,长度范围:1-50,
        "author": ["作者"],JSON,
        "publisher": "出版社",str,长度范围:0-50,     
        "pubdate": "出版日期",str,长度范围:7-10,格式:允许”2012-12”和“2012-12-12”两种格式,
        "cover": "封面url",str,长度范围“1-100”,
        "douban_url": "豆瓣url",str,长度范围:1-50
    },
    "teacher": {
        "teacher_name":"教师名称",str,长度范围:1-50
    },
    "course": {
        "course_name": "课程名称",str,长度范围:1-50,
        "department":"学部名称",str,内容必须在已存在学部中
    },
    "school_year":"学年",str,长度:9,格式形如“2012-2013”,
    "semester":2,int,只能为1或2
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
        '''
        输出:[
                {
                    "book": "9787101162097",isbn号
                    "teacher": "王翔",老师名称
                    "course": {
                        "course_name": "中国古代文学",课程名称
                        "department": "文法" 学部
                    },
                    "school_year": "12-13",学年
                    "semester": 学期,
                    "upvote_count": 1,实用投票票数
                    "downvote_count": 0,不实用投票票数
                },
            ]
        '''
        query_params=request.GET
        filter_params={}
        print(query_params)
        if 'isbn' in query_params:
            filter_params['book__isbn']=query_params.get('isbn')

        usebook_queryset = Usebook.objects.filter(**filter_params)
        if not usebook_queryset.exists():
            return Response({"Bad Request":"Invalid ISBN."},status=status.HTTP_404_NOT_FOUND)

        
        # Serialize the queryset
        serializer = UsebookSerializer(usebook_queryset, many=True)
        
        # Annotate usebook_queryset with upvotes and downvotes counts
        usebook_queryset = usebook_queryset.annotate(
            upvote_count=Count('upscoreuserrelation'),
            downvote_count=Count('downscoreuserrelation')
        )
        response_data = serializer.data
        for idx, usebook in enumerate(usebook_queryset):
            response_data[idx]['id'] = usebook.id
            response_data[idx]['upvote_count'] = usebook.upvote_count
            response_data[idx]['downvote_count'] = usebook.downvote_count

        return Response(response_data,status=status.HTTP_200_OK)
        
class register(APIView):
    '''
    {
        user_name:,
        user_email:,
        user_password:
    }
    '''
    def post(self, request):
        print(request.data)
        user=User.objects.create_user(username=request.data.get('user_name'),
                                      email=request.data.get('user_email'),
                                      password=request.data.get('user_password'))
        user.save()
        serializer=ProfileSerializer()
        return Response({"user_name":user.username,"email":user.email}, status=status.HTTP_200_OK)

        # serializer = UserSerializer(data=request.data)
        # if serializer.is_valid():
        #     print(serializer.data)
        #     user_name= serializer.data.get('user_name')
        #     user_password= serializer.data.get('user_password')
        #     user_email= serializer.data.get('user_email')
        #     user=User(user_name = user_name, user_password = user_password, user_email = user_email)
        #     print(user.user_id)
        #     user.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # else:
        #     print(serializer.errors)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class upScoreUser(APIView):
    '''
    {
        useBook:{useBook的id},
        
    }
    cookie中正常设置user_id字段
    '''
    serializer_class=UpScoreUserRelationSerializer
    def post(self,request):
        usebook_id=request.data.get('useBook')
        # user_id=request.data.get('user_id')
        user_id=request.COOKIES.get('user_id')
        upScore_data={
            "useBook":usebook_id,
            "user":user_id
        }

        serializer=self.serializer_class(data=upScore_data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response({"Already exists":"{} already scored this one.".format(user_id)},status=status.HTTP_409_CONFLICT)
        user_id=serializer.data.get('user')
        usebook_id=serializer.data.get('useBook')
        down=DownScoreUserRelation.objects.filter(useBook_id=usebook_id,user_id=user_id)
        if down.exists():
            return Response({"Bad Request":"Cannot up and down at the same time."},status=status.HTTP_404_NOT_FOUND)
        
        user = get_object_or_404(User, id=user_id)
        usebook = get_object_or_404(Usebook, id=usebook_id)
        
        scoreUser = UpScoreUserRelation.objects.create(user=user, useBook=usebook)
        scoreUser.save()
        return Response(UpScoreUserRelationSerializer(scoreUser).data,status=status.HTTP_200_OK)
    
    def delete(self,request):
        usebook_id = request.data.get('useBook')
        user_id=request.COOKIES.get('user_id')
        if not usebook_id:
            return Response({"Bad Request": "usebook ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

        scoreUser = UpScoreUserRelation.objects.filter(useBook_id=usebook_id,user_id=user_id).first()
        if not scoreUser:
            return Response({"Bad Request": "Invalid usebook relation."}, status=status.HTTP_404_NOT_FOUND)

        scoreUser.delete()
        return Response({"Success": "Usebook relation deleted."}, status=status.HTTP_200_OK)


class loggin(APIView):
    def post(self,request):
        username=request.data.get('username')
        password=request.data.get('password')
        user=authenticate(request=request,username=username,password=password)
        if user is not None:
            login(request,user)
            return Response({"username":user.get_username(),"email":user.get_email_field_name()})
        else:
            return Response({"Bas Request":"Invalid Login"},status=status.HTTP_400_BAD_REQUEST)
        

class downScoreUser(APIView):
    '''
    {
        useBook:{useBook的id},
        
    }
    cookie中正常设置user_id字段
    '''
    serializer_class=DownScoreUserRelationSerializer
    def post(self,request):
        usebook_id=request.data.get('useBook')
        # user_id=request.data.get('user_id')
        user_id=request.COOKIES.get('user_id')
        upScore_data={
            "useBook":usebook_id,
            "user":user_id
        }

        serializer=self.serializer_class(data=upScore_data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response({"Already exists":"{} already scored this one.".format(user_id)},status=status.HTTP_409_CONFLICT)
        user_id=serializer.data.get('user')
        usebook_id=serializer.data.get('useBook')
        up=UpScoreUserRelation.objects.filter(useBook_id=usebook_id,user_id=user_id)
        if up.exists():
            return Response({"Bad Request":"Cannot up and down at the same time."},status=status.HTTP_404_NOT_FOUND)
        
        user = get_object_or_404(User, id=user_id)
        usebook = get_object_or_404(Usebook, id=usebook_id)

        scoreUser=DownScoreUserRelation.objects.create(user=user,useBook=usebook)
        scoreUser.save()
        return Response(DownScoreUserRelationSerializer(scoreUser).data,status=status.HTTP_200_OK)
    
    def delete(self,request):
        usebook_id = request.data.get('useBook')
        user_id=request.COOKIES.get('user_id')
        if not usebook_id:
            return Response({"Bad Request": "usebook ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

        scoreUser = DownScoreUserRelation.objects.filter(useBook_id=usebook_id,user_id=user_id).first()
        if not scoreUser:
            return Response({"Bad Request": "Invalid usebook relation."}, status=status.HTTP_404_NOT_FOUND)

        scoreUser.delete()
        return Response({"Success": "Usebook relation deleted."}, status=status.HTTP_200_OK)
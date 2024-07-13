from django.shortcuts import render
from django.db.models import Q
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view,renderer_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from .serializers import RoomSerializer,BookSerializer,TeacherSerializer,CourseSerializer,\
    CommentSerializer,LikeSerializer,UsebookSerializer,MarkSerializer,\
    UpScoreUserRelationSerializer,ProfileSerializer,DownScoreUserRelationSerializer,\
    ValidationCodeSerializer,SearchSerializer
from .models import Room,Book,Teacher,Course,Comment,Usebook,Like,Mark,\
                    UpScoreUserRelation, Profile,DownScoreUserRelation,ValidationCode
from requests import Request,post,get,patch
from django.db.models import Count
from django.shortcuts import get_object_or_404

from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
# from tasks import get_douban_info

APIKEY="0ac44ae016490db2204ce0a042db2916"
# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    print('in room')
    serializer_class = RoomSerializer


class get_doubanBook(APIView):
    # redirect_field_name = "redirect_to"
    def get(self,request,format=None):
        # scopes='book_basic_r'
        isbn = request.GET.get('isbn')
        print(isbn)
        header = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74."}
        base='https://api.douban.com'
        req=Request('GET',base+'/v2/book/isbn/:'+isbn,params={'apiKey':APIKEY},headers=header)
        url=req.prepare().url

        res=get(url,headers=header)
        if not res.ok:
            return Response({"msg":"ISBN无效，请重新输入"},status=status.HTTP_404_NOT_FOUND)
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
        school_year=request.data.get("school_year")
        if len(school_year)!=9:
            return Response({"msg":"学年格式不正确"},status=status.HTTP_406_NOT_ACCEPTABLE)
        semester=request.data.get("semester")
        if semester not in ['1','2',"1","2",1,2]:
            print(semester)
            return Response({"msg":"学期格式不正确"},status=status.HTTP_406_NOT_ACCEPTABLE)
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
            
            # queryset=Book.objects.filter(isbn=isbn)
            # if queryset.exists():
            #     print("{0} is already created".format(title))
            #     book=queryset[0]
            #     print(book)
            # else:
            book=Book(isbn=isbn,title=title,author=author,publisher=publisher,pubdate=pubdate,cover=cover,douban_url=douban_url)
            book.save()
        else:
            # print('book')
            queryset=Book.objects.filter(isbn=book_data['isbn'])
            # book=queryset[0]
            if queryset.exists():
                book=queryset[0]
            else:
                print(book_serializer.errors)
                return Response({'msg':'书籍信息格式有误'},status=status.HTTP_404_NOT_FOUND)
            
        course=request.data.get("course")
        course_serializer=self.course_serializer_class(data=course)
        if course_serializer.is_valid():
            course_name=course_serializer.data.get('course_name')
            department=course_serializer.data.get('department')
            queryset=Course.objects.filter(course_name=course_name,department=department)
            # if queryset.exists():
                # print("{0} is already created".format(course_name))
                # course=queryset[0]
                # return Response({'Created':'already exists'},status.HTTP_409_CONFLICT)
            # else:
            course=Course(course_name=course_name,department=department)
            course.save()
                # return Response(BookSerializer(book).data,status.HTTP_201_CREATED)
        else:
            print('course')
            queryset=Course.objects.filter(course_name=course['course_name'],department=course['department'])
            if queryset.exists():
                course=queryset[0]
            else: 
                print(course_serializer.errors)
                return Response({'msg':'课程信息格式有误'},status=status.HTTP_404_NOT_FOUND)
        
        teacher=request.data.get("teacher")
        # print(teacher)
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
            if queryset.exists():
                teacher=queryset[0]
            else: return Response({'msg':'教师信息格式有误'},status=status.HTTP_404_NOT_FOUND)
            # print(teacher_serializer)
            
        
        usebook_data={
            "course_name":course.course_name,
            "department":course.department,
            "teacher":teacher.teacher_name,
            "book":book.isbn,
            "school_year":school_year,
            "semester":semester
        }
        # print(usebook_data)
        useBook_serializer=self.useBook_serializer_class(data=usebook_data)
        print(useBook_serializer)
        if useBook_serializer.is_valid():
            queryset=Usebook.objects.filter(book=book,course=course,teacher=teacher)
            if queryset.exists():
                return Response({'msg':'关系已存在'},status.HTTP_409_CONFLICT)
            else:
                useBook=Usebook(book=book,course=course,teacher=teacher,school_year=usebook_data['school_year'],semester=usebook_data['semester'])
                useBook.save()
                return Response(UsebookSerializer(useBook).data,status.HTTP_200_OK)
        else:
            print('useBook')
            print(useBook_serializer.errors)
            queryset=Usebook.objects.filter(book=book,course=course,teacher=teacher)
            if queryset.exists():
                return Response({'msg':'关系已存在'},status.HTTP_409_CONFLICT)
            return Response({'msg':'信息格式有误'},status.HTTP_409_CONFLICT)
    

class updateBook(APIView):
    '''
    书籍的isbn号不允许修改
    '''
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
        
class markBook(APIView):
    mark_serializer_class=MarkSerializer
    book_serializer_class=BookSerializer
    def post(self,request,format=None):
        print(request.data)
        #print(request.session.get('_auth_user_id',None))
        print(request.session.get('user_id',None))
        request_data=request.data.get("mark")

        queryset=Book.objects.filter(isbn=request_data['bookisbn'])
        if queryset.exists():
            book=queryset[0]
            print(book.isbn)
        else:
            return Response({'msg':'未找到该书籍'},status.HTTP_404_NOT_FOUND)
       
        queryset=User.objects.filter(id=request_data['userid'])
        if queryset.exists():
            user_mark=queryset[0]
            print(user_mark.id)
        else:
            return Response({'msg':'未找到该用户'},status.HTTP_404_NOT_FOUND)

        mark_data={
            "userid":user_mark.id,
            "bookisbn":book.isbn
        }

        mark_serializer=self.mark_serializer_class(data=mark_data)
        print(mark_serializer)
        if mark_serializer.is_valid():
            mark=Mark(userid_id=user_mark.id,bookisbn_id=book.isbn) #在外键字段后面需加_id
            mark.save()
            print("ok")
            return Response(MarkSerializer(mark).data,status.HTTP_200_OK)
        else:
            print('mark')
            print(mark_serializer.errors)
            return Response({'msg':'收藏失败'},status.HTTP_404_NOT_FOUND)


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
from django.core.mail import send_mail

class register(APIView):
    '''
    {
        user_name:,
        user_email:,
        user_password:,
        validation:
    }
    '''
    def post(self, request):
        print(request.data)
        vali=get_object_or_404(ValidationCode,email=request.data.get('user_email'))
        if vali.code!=request.data.get('validation'):
            return Response({"msg":"验证码错误"},status=status.HTTP_404_NOT_FOUND)
        history=User.objects.filter(email=request.data.get('email')).first()
        if history is not None:
            return Response({"Conflict":"Already registered"},status=status.HTTP_409_CONFLICT)


        # try:
        user=User.objects.create_user(username=request.data.get('user_name'),
                                    email=request.data.get('user_email'),
                                    password=request.data.get('user_password'))
        user.save()
        """
        login(request,user)
        request.session['user_id'] = user.pk
        if not request.session.session_key:
            request.session.save()
        print("session key:"+request.session.session_key)
        print(request.session.get('user_id',None))
        """
        vali.delete()
        return Response({"username":user.get_username(),"email":user.get_email_field_name()},status=status.HTTP_200_OK)

        #     send_mail(
        #     "Testing for email validation",
        #     "Here is the message.",
        #     "3014033378@qq.com",
        #     [request.data.get('user_email')],
        #     fail_silently=False,
        # )
        # serializer=ProfileSerializer()
        # user=authenticate(request=request,username=username,password=password)
        # if user is not None:
            # login(request,user)
            # if not request.session.session_key:
            #     request.session.save()
            # print("session key:"+request.session.session_key)
            #print("usernsme:"+request.session['user_name'])
            #print(request.session.session_key)
            # return Response({"username":user.get_username(),"email":user.get_email_field_name()})
        # else:
        #     print("error")
        #     return Response({"Bad Request":"Invalid Login"},status=status.HTTP_400_BAD_REQUEST)
            #return Response({"user_name":user.username,"email":user.email}, status=status.HTTP_200_OK)
        # except Exception:



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
            return Response({"msg":"{} already scored this one.".format(user_id)},status=status.HTTP_409_CONFLICT)
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
        
        print(username)
        print(password)
        user=authenticate(request=request,username=username,password=password)

        if user is not None:
            login(request,user) #用户id对应写在_auth_user_id里
            request.session['user_id'] = user.pk
            request.session['is_login'] = True
            if not request.session.session_key:
                request.session.save()
            print("session key:"+request.session.session_key)
            print(request.session.get('_auth_user_id',None))
            print(request.session.items()) #获取session键值对
            #data=request.session.items()
            res=JsonResponse({'msg':'login seccessfully'},status=status.HTTP_200_OK)
            res.set_cookie('username',username,httponly=False,secure=True)
            res.set_cookie('user_id',user.id,httponly=False,secure=True)
            return res
            # return Response({"username":user.get_username(),"email":user.get_email_field_name()},status=status.HTTP_200_OK)
        else:
            return Response({"Bas Request":"Invalid Login"},status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class ProfileViewer(APIView):
#     @csrf_exempt
    def get(self, request):
            user_id=request.GET.get('user_id')
            try:
                profile = Profile.objects.get(user__id=user_id)
                serializer = ProfileSerializer(profile)
                print("find")

                data = {
                    'username': profile.user.username,
                    'user_department': profile.user_department,
                    'user_major': profile.user_major,
                    'user_credit': profile.user_credit
                }
                return Response(data, status=status.HTTP_200_OK)
#                 return res
            except Profile.DoesNotExist:
                print("fail")
                return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
#
#     @csrf_exempt
    def put(self, request, user_id):
            try:
                print("valid")
                profile = Profile.objects.get(user__username=user_id)
                serializer = ProfileSerializer(profile, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    data = {
                        'username': profile.user.username,
                        'user_department': profile.user_department,
                        'user_major': profile.user_major,
                        'user_credit': profile.user_credit
                    }
                    print("valid")
                    return Response(data, status=status.HTTP_200_OK)
                print("not valid")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except Profile.DoesNotExist:
                print("except")
                return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response({"Bad Request":"Invalid Login"},status=status.HTTP_400_BAD_REQUEST)



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


class validation(APIView):
    '''
        {
            email:
        }
    '''
    def post(self,request):
        # email=request.data.get('email')
        print(request.data)
        history=ValidationCode.objects.filter(email=request.data.get('email')).first()
        if history :
            return Response({"msg":"验证码已发送"},status=status.HTTP_409_CONFLICT)
        serializer=ValidationCodeSerializer(data=request.data)
        if not serializer.is_valid():
            return
        email=serializer.data.get('email')
        code=ValidationCode(email=email)
        code.save()
        send_mail(
            "This is for validation",
            "Here is the code code {0}.".format(code.code),
            "3014033378@qq.com",
            [email],
            fail_silently=False,
        )
        return Response({"email":email},status=status.HTTP_200_OK)
    def delete(self,request):
        email=request.data.get('email')
        vali=get_object_or_404(ValidationCode,email=email)
        # vali=ValidationCode.objects.filter(email=email).first()
        # if not vali:
        #     return Response({"Bad Request":"Invalid email."},status=status.HTTP_404_NOT_FOUND)
        vali.delete()
        return Response({"OK":"Deleted."},status=status.HTTP_202_ACCEPTED)

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
    
class loggout(APIView):
    def post(self,request):
        if request.user is None:
            return Response({'msg':'未登录，无需注销'},status=status.HTTP_406_NOT_ACCEPTABLE)
        logout(request=request)
        return Response({'success':'成功注销'},status=status.HTTP_200_OK)
    def get(self,request):
        if request.user is None:
            return Response({'msg':'未登录，无需注销'},status=status.HTTP_406_NOT_ACCEPTABLE)
        logout(request=request)
        return Response({'success':'成功注销'},status=status.HTTP_200_OK)
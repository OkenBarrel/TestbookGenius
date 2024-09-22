from django.core.cache import cache
import redis
from django_redis import get_redis_connection
from django.shortcuts import render
from django.db.models import Q
from django.db import connection
from django.core.paginator import Paginator
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from .serializers import (
    RoomSerializer,
    BookSerializer,
    TeacherSerializer,
    CourseSerializer,
    CommentSerializer,
    UsebookSerializer,
    MarkSerializer,
    UpScoreUserRelationSerializer,
    ProfileSerializer,
    DownScoreUserRelationSerializer,
    ValidationCodeSerializer,
    SearchSerializer,
)
from .models import (
    Room,
    Book,
    Teacher,
    Course,
    Comment,
    Usebook,
    Mark,
    UpScoreUserRelation,
    Profile,
    DownScoreUserRelation,
    ValidationCode,
)
from requests import Request, post, get, patch

# from requests import post,patch
from django.db.models import Count
from django.db import transaction
from django.shortcuts import get_object_or_404
from itertools import chain

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
from django.http import JsonResponse

# from tasks import get_douban_info
from rest_framework.parsers import MultiPartParser, FormParser

from django.views.decorators.http import require_http_methods
from urllib.parse import unquote
from django.http import HttpResponse

APIKEY = "0ac44ae016490db2204ce0a042db2916"
TOP_BOOK = "topbook"
# Create your views here.

print(connection.queries)


def get_redis():
    """
    get redis connection
    """
    pool = get_redis_connection("default").connection_pool
    r = redis.Redis(connection_pool=pool)
    return r


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    print("in room")
    serializer_class = RoomSerializer


class get_doubanBook(APIView):
    def get(self, request, format=None):
        # scopes='book_basic_r'
        isbn = request.GET.get("isbn")
        print(isbn)
        header = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74."
        }
        base = "https://api.douban.com"
        req = Request(
            "GET",
            base + "/v2/book/isbn/:" + isbn,
            params={"apiKey": APIKEY},
            headers=header,
        )
        url = req.prepare().url

        res = get(url, headers=header)
        if not res.ok:
            return Response(
                {"msg": "ISBN无效，请重新输入"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(res.json(), status=status.HTTP_200_OK)


class get_book(APIView):
    lookup_kwarg = "isbn"
    serializer_class = BookSerializer

    def get(self, request, format=None):
        isbn = request.GET.get(self.lookup_kwarg)
        redis_book = cache.get(f"bookinfo:{isbn}")
        r = get_redis()
        # r.
        member = f"book:{isbn}"
        if r.zscore(TOP_BOOK, member) is None:
            score = 0
            r.zadd(name=TOP_BOOK, mapping={member: score})
        else:
            r.zincrby(TOP_BOOK, 1, member)
        if redis_book:
            return Response(redis_book, status=status.HTTP_200_OK)
        if isbn is not None:
            book = Book.objects.filter(isbn=isbn)
            if len(book) > 0:
                data = BookSerializer(book[0]).data
                cache.set(f"bookinfo:{isbn}", data, timeout=60 * 60)
                return Response(data, status=status.HTTP_200_OK)
            return Response(
                {'Book not found":"invalid ISBN.'}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(
            {"Bad Request": "isbn not found in request"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class rank(APIView):
    def get(self, request):
        '''
        {
            "0": {
                "isbn": "973760100333",
                "title": "书名333",
                "author": [
                    "作者333"
                ],
                "publisher": "出版社1",
                "pubdate": "2020-03-25",
                "cover": "https://img1.doubanio.com/view/subject/s/public/s34894009.jpg",
                "douban_url": "https://book.douban.com/subject/7360215/"
                },
        }
        '''
        edge = int(request.GET.get("top"))
        data = []
        r = get_redis()
        top5 = r.zrevrange(TOP_BOOK, 0, edge-1, withscores=True)
        # print(top5)
        for index, i in enumerate(top5):
            print(i[0].decode('utf-8'))
            isbn = i[0].decode('utf-8').split(":")[1]
            b = cache.get(f"bookinfo:{isbn}")
            print(isbn)
            if b is None:
                book = Book.objects.filter(isbn=isbn)
                if len(book) > 0:
                    t = BookSerializer(book[0]).data
                else:
                    t = {"msg": f"book {isbn} not found"}
                data.append(t)
            else:
                data.append(b)

        return Response(data, status=status.HTTP_200_OK)


# @require_http_methods(["GET"])
class proxy_image(APIView):
    def get(self, request):
        print("Request received")
        # 获取 URL 参数
        image_url = unquote(request.GET.get("url"))
        if not image_url:
            return Response("No URL provided", status=400)
        print("img:" + image_url)
        # 发送 GET 请求到目标图片 URL
        response = get(image_url, headers={"User-Agent": "Mozilla/5.0"})
        print(response.headers.get("Content-Type"))
        # 返回目标图片的响应内容
        return HttpResponse(
            response.content, content_type=response.headers.get("Content-Type")
        )


class createBook(APIView):
    """
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

    """

    book_serializer_class = BookSerializer
    useBook_serializer_class = UsebookSerializer
    course_serializer_class = CourseSerializer
    teacher_serializer_class = TeacherSerializer

    @transaction.atomic
    def post(self, request, format=None):
        school_year = request.data.get("school_year")
        if len(school_year) != 9:
            return Response(
                {"msg": "学年格式不正确"}, status=status.HTTP_406_NOT_ACCEPTABLE
            )
        semester = request.data.get("semester")
        if semester not in ["1", "2", "1", "2", 1, 2]:
            print(semester)
            return Response(
                {"msg": "学期格式不正确"}, status=status.HTTP_406_NOT_ACCEPTABLE
            )
        book_data = request.data.get("book")
        # print(request.data)
        # print(book_data)
        book_serializer = self.book_serializer_class(data=book_data)
        if book_serializer.is_valid():
            isbn = book_serializer.data.get("isbn")
            title = book_serializer.data.get("title")

            author = book_serializer.data.get("author")
            publisher = book_serializer.data.get("publisher")
            pubdate = book_serializer.data.get("pubdate")
            cover = book_serializer.data.get("cover")
            douban_url = book_serializer.data.get("douban_url")

            # queryset=Book.objects.filter(isbn=isbn)
            # if queryset.exists():
            #     print("{0} is already created".format(title))
            #     book=queryset[0]
            #     print(book)
            # else:
            book = Book(
                isbn=isbn,
                title=title,
                author=author,
                publisher=publisher,
                pubdate=pubdate,
                cover=cover,
                douban_url=douban_url,
            )
            book.save()
        else:
            # print('book')
            queryset = Book.objects.filter(isbn=book_data["isbn"])
            # book=queryset[0]
            if queryset.exists():
                book = queryset[0]
            else:
                print(book_serializer.errors)
                return Response(
                    {"msg": "书籍信息格式有误"}, status=status.HTTP_404_NOT_FOUND
                )
        course = request.data.get("course")
        course_serializer = self.course_serializer_class(data=course)
        if course_serializer.is_valid():
            course_name = course_serializer.data.get("course_name")
            department = course_serializer.data.get("department")
            queryset = Course.objects.filter(
                course_name=course_name, department=department
            )
            # if queryset.exists():
            # print("{0} is already created".format(course_name))
            # course=queryset[0]
            # return Response({'Created':'already exists'},status.HTTP_409_CONFLICT)
            # else:
            course = Course(course_name=course_name, department=department)
            course.save()
        # return Response(BookSerializer(book).data,status.HTTP_201_CREATED)
        else:
            print("course")
            queryset = Course.objects.filter(
                course_name=course["course_name"], department=course["department"]
            )
            if queryset.exists():
                course = queryset[0]
            else:
                print(course_serializer.errors)
                return Response(
                    {"msg": "课程信息格式有误"}, status=status.HTTP_404_NOT_FOUND
                )

        teacher = request.data.get("teacher")
        # print(teacher)
        teacher_serializer = self.teacher_serializer_class(data=teacher)

        if teacher_serializer.is_valid():
            teacher_name = teacher_serializer.data.get("teacher_name")
            queryset = Teacher.objects.filter(teacher_name=teacher_name)
            if queryset.exists():
                print("{0} is already created".format(teacher_name))
                teacher = queryset[0]
                # return Response({'Created':'already exists'},status.HTTP_409_CONFLICT)
            else:
                teacher = Teacher(teacher_name=teacher_name)
                teacher.save()
                # return Response(BookSerializer(book).data,status.HTTP_201_CREATED)
        else:
            print("teacher")
            print(teacher_serializer.errors)
            print(teacher)
            queryset = Teacher.objects.filter(teacher_name=teacher["teacher_name"])
            if queryset.exists():
                teacher = queryset[0]
            else:
                return Response(
                    {"msg": "教师信息格式有误"}, status=status.HTTP_404_NOT_FOUND
                )
            # print(teacher_serializer)

        usebook_data = {
            "course_name": course.course_name,
            "department": course.department,
            "teacher": teacher.teacher_name,
            "book": book.isbn,
            "school_year": school_year,
            "semester": semester,
        }
        # print(usebook_data)
        useBook_serializer = self.useBook_serializer_class(data=usebook_data)
        print(useBook_serializer)
        if useBook_serializer.is_valid():
            queryset = Usebook.objects.filter(book=book, course=course, teacher=teacher)
            if queryset.exists():
                return Response({"msg": "关系已存在"}, status.HTTP_409_CONFLICT)
            else:
                useBook = Usebook(
                    book=book,
                    course=course,
                    teacher=teacher,
                    school_year=usebook_data["school_year"],
                    semester=usebook_data["semester"],
                )
                useBook.save()
                return Response(UsebookSerializer(useBook).data, status.HTTP_200_OK)
        else:
            print("useBook")
            print(useBook_serializer.errors)
            queryset = Usebook.objects.filter(book=book, course=course, teacher=teacher)
            if queryset.exists():
                return Response({"msg": "关系已存在"}, status.HTTP_409_CONFLICT)
            return Response({"msg": "信息格式有误"}, status.HTTP_409_CONFLICT)


class updateBook(APIView):
    """
    书籍的isbn号不允许修改
    """

    # book_serializer_class=BookSerializer
    # useBook_serializer_class=UsebookSerializer
    # course_serializer_class=CourseSerializer
    # teacher_serializer_class=TeacherSerializer

    def patch(self, request):
        book_data = request.data.get("book")
        # book_data=JSONParser().parse(request.data.get("book"))
        print(book_data)
        # book_serializer=self.book_serializer_class(data=book_data)
        # book_serializer=BookSerializer(data=book_data)
        book = Book.objects.get(isbn=book_data["isbn"])
        book_up = BookSerializer(instance=book, data=book_data)
        if book_up.is_valid():
            book_up.save()
            return Response(BookSerializer(book).data, status.HTTP_200_OK)
        else:
            return Response({"Bad Request": "invalid"}, status.HTTP_404_NOT_FOUND)


class markBook(APIView):
    mark_serializer_class = MarkSerializer
    book_serializer_class = BookSerializer

    def post(self, request):
        """
        print(request.data)
        #print(request.session.get('_auth_user_id',None))
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

        #user_id=request.COOKIES.get('user_id')
        """
        user_id = request.data.get("userid")
        book_isbn = request.data.get("bookisbn")
        mark_data = {"userid": user_id, "bookisbn": book_isbn}

        mark_serializer = self.mark_serializer_class(data=mark_data)
        # print(mark_serializer)
        if mark_serializer.is_valid():
            user_id = mark_serializer.data.get("userid")
            book_isbn = mark_serializer.data.get("bookisbn")
            # user=get_object_or_404(User, id=user_id)
            # book=get_object_or_404(Book, isbn=book_isbn)
            queryset = User.objects.filter(id=user_id)
            if queryset.exists():
                user = queryset[0]
                print(user)
            queryset = Book.objects.filter(isbn=book_isbn)
            if queryset.exists():
                book = queryset[0]
                print(book)
            mark = Mark(userid=user, bookisbn=book)
            mark.save()
            print(mark)
            print("ok")
            return Response(MarkSerializer(mark).data, status.HTTP_200_OK)
        else:
            print("error")
            print(mark_serializer.errors)
            return Response({"msg": "收藏失败"}, status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        # request_data=request.data.get("mark")
        # print(request_data)
        """
        queryset=Book.objects.filter(isbn=request_data['bookisbn'])
        if queryset.exists():
            book=queryset[0]
            book_isbn=book.isbn
            print(book_isbn)
        else:
            return Response({'msg':'未找到该书籍'},status.HTTP_404_NOT_FOUND)
        queryset=User.objects.filter(id=request_data['userid'])
        if queryset.exists():
            user_mark=queryset[0]
            user_id=user_mark.id
            print(user_id)
        else:
            return Response({'msg':'未找到该用户'},status.HTTP_404_NOT_FOUND)
        """

        user_id = request.data.get("userid")
        book_isbn = request.data.get("bookisbn")

        mark_del = Mark.objects.filter(userid=user_id, bookisbn=book_isbn)
        if not mark_del:
            return Response({"msg": "收藏关系不存在"}, status.HTTP_404_NOT_FOUND)
        mark_del.delete()
        return Response({"msg": "取消收藏成功！"}, status.HTTP_200_OK)


class getMarkStatus(APIView):
    def get(self, request):
        user_id = request.GET.get("userid")
        print(user_id)
        book_isbn = request.GET.get("bookisbn")
        print(book_isbn)
        # user_id=request.session.get('_auth_user_id',None)
        # print(user_id)

        try:
            book = Book.objects.get(isbn=book_isbn)
        except Mark.DoesNotExist:
            return Response({"msg": "关系不存在"}, status=status.HTTP_404_NOT_FOUND)
        try:
            user = User.objects.get(id=user_id)
        except Exception:
            data = {"userid": 0, "bookisbn": book_isbn, "ismark": False}
            return Response(data=data, status=status.HTTP_200_OK)

        data = {
            "userid": user_id,
            "bookisbn": book_isbn,
            "ismark": Mark.objects.filter(userid=user, bookisbn=book).exists(),
        }
        return Response(data=data, status=status.HTTP_200_OK)


class getUseBook(APIView):
    def get(self, request, format=None):
        """
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
                    "id":关系主键
                },
            ]
        """
        query_params = request.GET
        filter_params = {}
        print("this is params: ", end=" ")
        print(query_params)
        if "isbn" in query_params:
            isbn = query_params.get("isbn")
            redis_use = cache.get(f"usebookinfo:{isbn}")
            if redis_use is not None:
                return Response(redis_use, status=status.HTTP_200_OK)
            filter_params["book__isbn"] = query_params.get("isbn")

        usebook_queryset = Usebook.objects.filter(**filter_params)
        if not usebook_queryset.exists():
            return Response(
                {"Bad Request": "Invalid ISBN."}, status=status.HTTP_404_NOT_FOUND
            )

        # Serialize the queryset
        serializer = UsebookSerializer(usebook_queryset, many=True)

        # Annotate usebook_queryset with upvotes and downvotes counts
        usebook_queryset = usebook_queryset.annotate(
            upvote_count=Count("upscoreuserrelation"),
            downvote_count=Count("downscoreuserrelation"),
        )
        response_data = serializer.data
        for idx, usebook in enumerate(usebook_queryset):
            response_data[idx]["id"] = usebook.id
            response_data[idx]["upvote_count"] = usebook.upvote_count
            response_data[idx]["downvote_count"] = usebook.downvote_count
        cache.set(f"usebookinfo:{isbn}", response_data, 60 * 60)
        return Response(response_data, status=status.HTTP_200_OK)


class getComment(APIView):
    def get(self, request, format=None):
        # 通过URL参数获取Usebook的ID
        usebook_id = request.GET.get("usebook_id")
        print("获取的usebook_id:" + usebook_id + "this")
        usebook_id = usebook_id.strip()
        # 根据Usebook的ID查询评论
        usebook_id = int(usebook_id)
        comments = Comment.objects.filter(usebook__id=usebook_id)

        # 如果没有找到评论，返回404
        if not comments.exists():
            return Response({"msg": "没有找到评论"}, status=status.HTTP_404_NOT_FOUND)

        # 序列化查询到的评论数据
        # serializer = CommentSerializer(comments, many=True)
        # print(serializer.data)

        # 手动构建每个评论的JSON数据
        comments_data = []
        for comment in comments:
            temp = {
                "user_id": comment.user.id,
                "username": comment.user.username,
                "data": comment.com_date,
                "avatar": request.build_absolute_uri(
                    Profile.objects.get(user=comment.user).user_avatar.url
                )
                if Profile.objects.get(user=comment.user).user_avatar
                else None,
                "info": comment.info,
                "usebook_id": comment.usebook.id,
            }
            comments_data.append(temp)

        # 返回序列化后的数据
        return Response(comments_data, status=status.HTTP_200_OK)


class createComment(APIView):
    """
    user , info , usebook
    """

    def post(self, request, format=None):
        # 获取请求数据
        # user_id=request.COOKIES.get('user_id')
        user_id = request.data.get("user")
        print(user_id)
        comment_data = request.data.get("info")
        print(comment_data)
        usebook_id = request.data.get("usebook")
        print(usebook_id)

        # 验证数据完整性
        if not all([user_id, comment_data, usebook_id]):
            return Response({"msg": "缺少必要信息"}, status=status.HTTP_400_BAD_REQUEST)

        # 查找关联对象
        try:
            usebook = Usebook.objects.get(id=usebook_id)
        except Usebook.DoesNotExist as e:
            return Response(
                {"msg": "提供的信息无法找到对应的Usebook实例"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"msg": "用户不存在"}, status=status.HTTP_404_NOT_FOUND)

        # 创建评论
        comment = Comment(user=user, info=comment_data, usebook=usebook)
        comment.save()
        data = {"user": user_id, "info": comment_data, "usebook": usebook_id}

        # 返回成功响应
        return Response(data, status=status.HTTP_201_CREATED)


class getOneUseBook(APIView):
    """
    输入
    {
        use_id
        user_id
    }
    输出
    {


    }
    """

    def get(self, request):
        use_id = request.GET.get("use_id")
        print(use_id)
        user_id = request.GET.get("user_id")
        print(user_id)
        try:
            use = Usebook.objects.get(id=use_id)
        except Exception:  # Usebook.DoesNotExist
            return Response({"msg": "关系未找到"}, status=status.HTTP_404_NOT_FOUND)
        # use=get_object_or_404(Usebook,id=use_id)
        upvote_count = UpScoreUserRelation.objects.filter(useBook=use).count()
        downvote_count = DownScoreUserRelation.objects.filter(useBook=use).count()
        try:
            user = User.objects.get(id=user_id)
        except Exception:
            data = {
                "use_id": None,
                "upvote": upvote_count,
                "downvote": downvote_count,
                "is_upvoted": False,
                "is_downvoted": False,
            }
            return Response(data=data, status=status.HTTP_200_OK)

        data = {
            "use_id": use_id,
            "upvote": upvote_count,
            "downvote": downvote_count,
            "is_upvoted": UpScoreUserRelation.objects.filter(
                user=user, useBook=use
            ).exists(),
            "is_downvoted": DownScoreUserRelation.objects.filter(
                user=user, useBook=use
            ).exists(),
        }

        return Response(data=data, status=status.HTTP_200_OK)


from django.core.mail import send_mail


class register(APIView):
    """
    {
        user_name:,
        user_email:,
        user_password:,
        validation:
    }
    """

    @transaction.atomic
    def post(self, request):
        print(request.data)
        email = request.data.get("user_email")
        vali = cache.get(f"code:{email}")
        print(vali)
        # vali=get_object_or_404(ValidationCode,email=request.data.get('user_email'))
        if vali != request.data.get("validation"):
            return Response({"msg": "验证码错误"}, status=status.HTTP_404_NOT_FOUND)
        history = User.objects.filter(email=request.data.get("email")).first()
        if User.objects.filter(email=request.data.get("email")).exists():
            return Response(
                {"Conflict": "Already registered"}, status=status.HTTP_409_CONFLICT
            )

        # try:
        user = User.objects.create_user(
            username=request.data.get("user_name"),
            email=request.data.get("user_email"),
            password=request.data.get("user_password"),
        )
        user.save()
        Profile.objects.create(user=user)  ###
        """
        login(request,user)
        request.session['user_id'] = user.pk
        if not request.session.session_key:
            request.session.save()
        print("session key:"+request.session.session_key)
        print(request.session.get('user_id',None))
        """
        # vali.delete()
        return Response(
            {"username": user.get_username(), "email": user.get_email_field_name()},
            status=status.HTTP_200_OK,
        )


class upScoreUser(APIView):
    """
    {
        useBook:{useBook的id},

    }
    cookie中正常设置user_id字段
    """

    serializer_class = UpScoreUserRelationSerializer

    def post(self, request):
        usebook_id = request.data.get("useBook")
        # user_id=request.data.get('user_id')
        user_id = request.COOKIES.get("user_id")
        upScore_data = {"useBook": usebook_id, "user": user_id}

        serializer = self.serializer_class(data=upScore_data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(
                {"msg": "{} already scored this one.".format(user_id)},
                status=status.HTTP_409_CONFLICT,
            )
        user_id = serializer.data.get("user")
        usebook_id = serializer.data.get("useBook")
        down = DownScoreUserRelation.objects.filter(
            useBook_id=usebook_id, user_id=user_id
        )
        if down.exists():
            return Response(
                {"Bad Request": "Cannot up and down at the same time."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = get_object_or_404(User, id=user_id)
        usebook = get_object_or_404(Usebook, id=usebook_id)

        scoreUser = UpScoreUserRelation.objects.create(user=user, useBook=usebook)
        scoreUser.save()
        return Response(
            UpScoreUserRelationSerializer(scoreUser).data, status=status.HTTP_200_OK
        )

    def delete(self, request):
        usebook_id = request.data.get("useBook")
        user_id = request.COOKIES.get("user_id")
        if not usebook_id:
            return Response(
                {"Bad Request": "usebook ID not provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        scoreUser = UpScoreUserRelation.objects.filter(
            useBook_id=usebook_id, user_id=user_id
        ).first()
        if not scoreUser:
            return Response(
                {"Bad Request": "Invalid usebook relation."},
                status=status.HTTP_404_NOT_FOUND,
            )

        scoreUser.delete()
        return Response(
            {"Success": "Usebook relation deleted."}, status=status.HTTP_200_OK
        )


class loggin(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        print(username)
        print(password)
        user = authenticate(request=request, username=username, password=password)

        if user is not None:
            login(request, user)  # 用户id对应写在_auth_user_id里
            request.session["user_id"] = user.pk
            request.session["is_login"] = True
            if not request.session.session_key:
                request.session.save()
            print("session key:" + request.session.session_key)
            print(request.session.get("_auth_user_id", None))
            print(request.session.items())  # 获取session键值对
            # data=request.session.items()
            res = JsonResponse({"msg": "login seccessfully"}, status=status.HTTP_200_OK)
            res.set_cookie("username", username, httponly=False, max_age=60 * 60)
            res.set_cookie("user_id", user.id, httponly=False, max_age=60 * 60)
            return res
            # return Response({"username":user.get_username(),"email":user.get_email_field_name()},status=status.HTTP_200_OK)
        else:
            return Response(
                {"Bas Request": "Invalid Login"}, status=status.HTTP_400_BAD_REQUEST
            )


# @method_decorator(csrf_exempt, name='dispatch')
class ProfileViewer(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        user_id = request.GET.get("user_id")
        try:
            profile = Profile.objects.get(user__id=user_id)
            serializer = ProfileSerializer(profile)
            print("find")

            data = {
                "username": profile.user.username,
                "user_department": profile.user_department,
                "user_major": profile.user_major,
                "user_credit": profile.user_credit,
                "avatar_url": request.build_absolute_uri(profile.user_avatar.url)
                if profile.user_avatar
                else None,
            }
            print(request.build_absolute_uri(profile.user_avatar.url))
            return Response(data, status=status.HTTP_200_OK)
        #                 return res
        except Profile.DoesNotExist:
            print("fail")
            return Response(
                {"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
            )

    #
    #     @csrf_exempt
    def put(self, request):
        """
        {
            user_id:'',
            department: '',
            major: '',
            ProgramStartYear: '',
            credit: '',
            avatarFile: null,
        }
        """
        try:
            print(request.data)
            print(request.FILES)

            user_id = request.data.get("user_id")
            user_major = request.data.get("user_major")
            user_department = request.data.get("user_department")
            user_credit = request.data.get("user_credit")
            data = {
                "user": user_id,
                "user_major": user_major,
                "user_department": user_department,
                "user_credit": user_credit,
            }
            # data={
            #     'user':{
            #        'id':user_id,
            #        'username':username
            #     },
            #     'user_major':user_major,
            #     'user_department':user_department,
            #     'user_credit':user_credit
            # }
            print(data)
            if "user_avatar" in request.FILES:
                data["user_avatar"] = request.FILES["user_avatar"]

            print("user")
            print(user_id)

            profile = Profile.objects.get(user__id=user_id)
            serializer = ProfileSerializer(profile, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                data = {
                    "username": profile.user.username,
                    "user_department": profile.user_department,
                    "user_major": profile.user_major,
                    "user_credit": profile.user_credit,
                    "avatar_url": request.build_absolute_uri(profile.user_avatar.url)
                    if profile.user_avatar
                    else None,
                }
                print("valid")
                return Response(data=data, status=status.HTTP_200_OK)
            print("not valid")
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            print("except")
            return Response(
                {"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(
            {"Bad Request": "Invalid Login"}, status=status.HTTP_400_BAD_REQUEST
        )


class downScoreUser(APIView):
    """
    {
        useBook:{useBook的id},

    }
    cookie中正常设置user_id字段
    """

    serializer_class = DownScoreUserRelationSerializer

    def post(self, request):
        usebook_id = request.data.get("useBook")
        # user_id=request.data.get('user_id')
        user_id = request.COOKIES.get("user_id")
        upScore_data = {"useBook": usebook_id, "user": user_id}

        serializer = self.serializer_class(data=upScore_data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(
                {"Already exists": "{} already scored this one.".format(user_id)},
                status=status.HTTP_409_CONFLICT,
            )
        user_id = serializer.data.get("user")
        usebook_id = serializer.data.get("useBook")
        up = UpScoreUserRelation.objects.filter(useBook_id=usebook_id, user_id=user_id)
        if up.exists():
            return Response(
                {"Bad Request": "Cannot up and down at the same time."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = get_object_or_404(User, id=user_id)
        usebook = get_object_or_404(Usebook, id=usebook_id)

        scoreUser = DownScoreUserRelation.objects.create(user=user, useBook=usebook)
        scoreUser.save()
        return Response(
            DownScoreUserRelationSerializer(scoreUser).data, status=status.HTTP_200_OK
        )

    def delete(self, request):
        usebook_id = request.data.get("useBook")
        # user_id=request.data.get('user_id')
        print(usebook_id)
        user_id = request.COOKIES.get("user_id")
        if not usebook_id:
            return Response(
                {"Bad Request": "usebook ID not provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        scoreUser = DownScoreUserRelation.objects.filter(
            useBook__id=usebook_id, user__id=user_id
        ).first()
        if not scoreUser:
            return Response(
                {"Bad Request": "Invalid usebook relation."},
                status=status.HTTP_404_NOT_FOUND,
            )

        scoreUser.delete()
        return Response(
            {"Success": "Usebook relation deleted."}, status=status.HTTP_200_OK
        )


class validation(APIView):
    """
    {
        email:
    }
    """

    # @transaction.atomic
    def post(self, request):
        email = request.data.get("email")
        print(request.data)
        vali = cache.get(f"code:{email}")
        if vali:
            return Response({"msg": "验证码已发送"}, status=status.HTTP_409_CONFLICT)
        # if ValidationCode.objects.filter(email=request.data.get('email')).exists() :
        #     return Response({"msg":"验证码已发送"},status=status.HTTP_409_CONFLICT)
        serializer = ValidationCodeSerializer(data=request.data)
        if not serializer.is_valid():
            return
        # email=serializer.data.get('email')
        cache.set(f"code:{email}", "what", timeout=60 * 2)
        # code=ValidationCode(email=email)
        # try:
        #     send_mail(
        #         "This is for validation",
        #         "Here is the validation code {0}.".format(code.code),
        #         "3014033378@qq.com",
        #         [email],
        #         fail_silently=False,
        #     )
        # except Exception:
        #     return Response({'msg':'无效邮箱，请重新输入'},status=status.HTTP_200_OK)
        # code.save()
        return Response({"email": email}, status=status.HTTP_200_OK)

    def delete(self, request):
        email = request.data.get("email")
        vali = get_object_or_404(ValidationCode, email=email)
        # vali=ValidationCode.objects.filter(email=email).first()
        # if not vali:
        #     return Response({"Bad Request":"Invalid email."},status=status.HTTP_404_NOT_FOUND)
        vali.delete()
        return Response({"OK": "Deleted."}, status=status.HTTP_202_ACCEPTED)


class SearchView(APIView):
    serializer_class = SearchSerializer

    def get(self, request):
        query = request.query_params.get("query", "")
        print(f"Received query: {query}")

        title_filter = Q(book__title__icontains=query)
        course_filter = Q(course__course_name__icontains=query)
        department_filter = Q(course__department__icontains=query)
        teacher_filter = Q(teacher__teacher_name__icontains=query)
        isbn_filter = Q(book__isbn__icontains=query)

        search_results1 = Usebook.objects.filter(title_filter).select_related(
            "book", "teacher", "course"
        )
        search_results2 = Usebook.objects.filter(course_filter).select_related(
            "book", "teacher", "course"
        )
        search_results3 = Usebook.objects.filter(teacher_filter).select_related(
            "book", "teacher", "course"
        )
        search_results4 = Usebook.objects.filter(department_filter).select_related(
            "book", "teacher", "course"
        )
        search_results5 = Usebook.objects.filter(isbn_filter).select_related(
            "book", "teacher", "course"
        )

        combined_results = list(
            chain(
                search_results1,
                search_results2,
                search_results3,
                search_results4,
                search_results5,
            )
        )
        search_results = list(
            {result.id: result for result in combined_results}.values()
        )

        items_per_page = 6
        paginator = Paginator(search_results, items_per_page)
        page_number = request.query_params.get("page", 1)
        page_obj = paginator.get_page(page_number)

        serialized_results = self.serializer_class(page_obj.object_list, many=True).data
        # print(f"Serialized results: {serialized_results}")

        return Response(
            {
                "results": serialized_results,
                "count": paginator.count,
                "num_pages": paginator.num_pages,
                "current_page": page_number,
            },
            status=status.HTTP_200_OK,
        )


class loggout(APIView):
    def get(self, request):
        print(request.user.id)
        print(request.user.is_active)
        if not request.user.is_active or request.user is None:
            return Response(
                {"msg": "未登录，无需注销"}, status=status.HTTP_406_NOT_ACCEPTABLE
            )
        del request.session["user_id"]
        # del request.session['username']
        logout(request=request)
        res = JsonResponse({"success": "成功注销"}, status=status.HTTP_200_OK)
        res.delete_cookie("username")
        res.delete_cookie("user_id")
        return res


class is_loggedin(APIView):
    def get(self, request):
        # print(request.session['user_id'])
        print(request.user)
        try:
            print(request.session["is_login"])
            if request.session["is_login"]:
                profile = Profile.objects.get(user__id=request.user.id)
                data = {
                    "msg": "login seccessfully",
                    "avatar_url": request.build_absolute_uri(profile.user_avatar.url)
                    if profile.user_avatar
                    else None,
                }
                res = JsonResponse(data, status=status.HTTP_200_OK)
                res.set_cookie("username", request.user.get_username(), httponly=False)
                res.set_cookie("user_id", request.user.id, httponly=False)
                return res
        except Exception:
            pass
        res = JsonResponse(
            {"msg": "not logged", "avatar_url": None}, status=status.HTTP_200_OK
        )
        res.delete_cookie("username")
        res.delete_cookie("user_id")

        return res

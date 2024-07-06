from rest_framework import serializers
from .models import Room, Book, Teacher, Course, Usebook, User , Mark , Comment, Like

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Room
        fields = ('id', 'code', 'host', 'guest_can_pause',
                  'votes_to_skip','created_at')

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model=Book
        fields=('isbn','title','author','publisher','pubdate','cover','douban_url')

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields='__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields=('course_name','department')

class UsebookSerializer(serializers.ModelSerializer):
    course = serializers.SlugRelatedField(slug_field='course_name', queryset=Course.objects.all())
    course_department = serializers.SlugRelatedField(slug_field='department', queryset=Course.objects.all())
    teacher = serializers.SlugRelatedField(slug_field='teacher_name', queryset=Teacher.objects.all())
    book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())
    class Meta:
        model = Usebook
        fields=('book','teacher','course','course_department','school_year','semester')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'user_name', 'user_password','user_email','user_major','user_department','user_credit','user_indate')
        extra_kwargs = {
            'user_password': {'write_only': True},   # 用户密码只能写入，不会在序列化时返回
            'user_indate': {'read_only': True},      # 用户注册日期只读
        }

class MarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mark
        fields=('userid','bookisbn')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields=('com_id','info','book','user_id','com_date')

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields=('user','comment','like','dislike')

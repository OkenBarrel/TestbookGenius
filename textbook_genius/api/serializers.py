from rest_framework import serializers
from .models import Room, Book, Teacher, Course, Usebook, Profile , Mark ,\
                    Comment, Like, UpScoreUserRelation,DownScoreUserRelation
from django.contrib.auth.models import User

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
    course_name = serializers.CharField(write_only=True)
    department = serializers.CharField(write_only=True)
    course = CourseSerializer(read_only=True)

    teacher = serializers.SlugRelatedField(slug_field='teacher_name', queryset=Teacher.objects.all())
    book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())

    class Meta:
        model = Usebook
        fields = ('book', 'teacher', 'course', 'school_year', 'semester', 'course_name', 'department')

    def create(self, validated_data):
        course_name = validated_data.pop('course_name')
        department = validated_data.pop('department')
        course, created = Course.objects.get_or_create(course_name=course_name, department=department)
        validated_data['course'] = course
        return super().create(validated_data)

    def update(self, instance, validated_data):
        course_name = validated_data.pop('course_name')
        department = validated_data.pop('department')
        course, created = Course.objects.get_or_create(course_name=course_name, department=department)
        validated_data['course'] = course
        return super().update(instance, validated_data)
    # course = serializers.SlugRelatedField(slug_field='course_name', queryset=Course.objects.all())
    # course_department = serializers.SlugRelatedField(slug_field='department', queryset=Course.objects.all())
    # teacher = serializers.SlugRelatedField(slug_field='teacher_name', queryset=Teacher.objects.all())
    # book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())
    # class Meta:
    #     model = Usebook
    #     fields=('book','teacher','course','school_year','semester')

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('user_id','user_name', 'user_password','user_email','user_major','user_department','user_credit')
        # extra_kwargs = {
        #     'user_password': {'write_only': True},   # 用户密码只能写入,不会在序列化时返回
        #     'user_indate': {'read_only': True},      # 用户注册日期只读
        # }

class ProfileSerializer(serializers.ModelSerializer):
    # user = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all())
    user_id=serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model=Profile
        fields=('user_id','user','user_major','user_department','user_credit')

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

class UpScoreUserRelationSerializer(serializers.ModelSerializer):
    useBook=serializers.PrimaryKeyRelatedField(queryset=Usebook.objects.all())
    user=serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model=UpScoreUserRelation
        fields=('useBook','user')

class DownScoreUserRelationSerializer(serializers.ModelSerializer):
    useBook=serializers.PrimaryKeyRelatedField(queryset=Usebook.objects.all())
    user=serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model=DownScoreUserRelation
        fields=('useBook','user')
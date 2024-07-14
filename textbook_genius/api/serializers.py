from rest_framework import serializers
from .models import Room, Book, Teacher, Course, Usebook, Profile , Mark ,\
                    Comment, UpScoreUserRelation,DownScoreUserRelation,ValidationCode
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
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # 或者使用 IntegerField
    user_avatar = serializers.ImageField()
    # user = UserSerializer()
    # user_name = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all())
    user_id=serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model=Profile
        fields = ('user','user_id', 'user_major', 'user_department', 'user_credit','user_indate', 'user_avatar')
    def get_user_avatar(self, obj):
            request = self.context.get('request')
            if obj.user_avatar:
                return request.build_absolute_uri(obj.user_avatar.url)
            return None
    # def update(self, instance, validated_data):
    #     print('into')
    #     user_data = validated_data.pop('user')
    #     user = instance.user

    #     # 检查用户名是否改变
    #     print(user.username)
    #     new_username = user_data.get('username', user.username)
    #     print(user.username)
    #     print(new_username)
    #     if user.username != new_username:
    #         print(user.username)
    #         print(new_username)
    #         user.username = new_username
    #         try:
    #             user.save()
    #         except Exception as e:
    #             raise serializers.ValidationError({"user": str(e)})
    #     print(user.username)
    #     print(new_username)
    #     # 更新 Profile 模型
    #     instance.user_major = validated_data.get('user_major', instance.user_major)
    #     instance.user_department = validated_data.get('user_department', instance.user_department)
    #     instance.user_credit = validated_data.get('user_credit', instance.user_credit)
    #     instance.user_avatar = validated_data.get('user_avatar', instance.user_avatar)
    #     instance.save()
    #     return instance
    # def update(self, instance, validated_data):
    #     user_data = validated_data.pop('user')
    #     user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
        
    #     if user_serializer.is_valid():
    #         user_serializer.save()

    #     return super().update(instance, validated_data)


class MarkSerializer(serializers.ModelSerializer):
    userid = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    bookisbn = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())
    class Meta:
        model = Mark
        fields=('userid','bookisbn')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields=('info','usebook','user','com_date')

# class LikeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Like
#         fields=('user','comment','like','dislike')

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

class ValidationCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model=ValidationCode
        fields='__all__'

class SearchSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    teacher = TeacherSerializer()
    course = CourseSerializer()
    cover = serializers.SerializerMethodField()

    class Meta:
        model = Usebook
        fields = ('book', 'teacher', 'course', 'school_year', 'semester', 'cover')

    def get_cover(self, obj):
        return obj.book.cover if obj.book else None
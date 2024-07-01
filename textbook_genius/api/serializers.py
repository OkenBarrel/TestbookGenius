from rest_framework import serializers
from .models import Room, Book, Teacher, Course,User ,Mark , Comment, Like

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Room
        fields = ('id', 'code', 'host', 'guest_can_pause',
                  'votes_to_skip','created_at')

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model=Book
        fields={'isbn','title','author','publisher','pubdate','cover','douban_url'}

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields=('teacher_id','teacher_name','department')

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields=('course_id','course_name','department')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'user_name', 'user_password','user_email','user_major','user_department','user_credit','user_indate')

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

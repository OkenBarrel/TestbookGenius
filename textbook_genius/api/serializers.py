from rest_framework import serializers
from .models import Room, Book, Teacher, Course

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
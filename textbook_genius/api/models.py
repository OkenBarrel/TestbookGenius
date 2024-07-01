from django.db import models
import string
import random


def generate_unique_code():
    length=6

    while True:
        code = ''.join(random.chices(string.ascii_uppercase,k=length))
        if Room.objects.filter(code=code).count()==0:
            break

        return code
    

# Create your models here.
class Room(models.Model):
    code = models.CharField(max_length=8,default="", unique=True)
    host = models.CharField(max_length=50,unique=True)
    guest_can_pause = models.BooleanField(null=False,default=False)
    votes_to_skip=models.IntegerField(null=False,default=1)
    created_at = models.DateTimeField(auto_now_add=True)

class Book(models.Model):
    # props:isbn, title, cover, author, publisher, pubdate
    # doubanUrl, (doubanRating)...(info from external API
    isbn=models.CharField(max_length=13,null=False,unique=True)
    title=models.CharField(max_length=50,default="",unique=False)
    author=models.JSONField(max_length=50,default="")
    publisher=models.CharField(max_length=50,default="")
    pubdate=models.CharField(max_length=10)
    cover=models.CharField(max_length=100,default="")
    douban_url=models.CharField(max_length=50,default="")
    def time_tostring(self):
        return self.pubdate.strftime('%Y%m%d')
    
class Teacher(models.Model):
    # props: teacher_id, teacher_name, department
    teacher_id=models.CharField(max_length=50,null=False,unique=True)
    teacher_name=models.CharField(max_length=50,null=False,default="")
    department=models.CharField(max_length=50,null=False,default="")
    
class Course(models.Model):
    # props: course_id, course_name, department
    course_id=models.CharField(max_length=50,null=False,unique=True)
    course_name=models.CharField(max_length=50,null=False,default="")
    department=models.CharField(max_length=50,null=False,default="")

# relationship: teachers teach courses(many to many)
class Teach(models.Model):
    teacher=models.ForeignKey(Teacher,on_update=models.CASCADE,on_delete=models.CASCADE)
    course=models.ForeignKey(Course,on_update=models.CASCADE,on_delete=models.CASCADE)
    school_year=models.CharField(max_length=10,null=False,default="")
    semester=models.IntegerField(null=False,default=1)


class User(models.Model):
    user_id = models.CharField(max_length=50, null=False, unique=True)
    user_name = models.CharField(max_length=50, null=False, default="")
    user_password = models.CharField(max_length=50, null=False, default="")
    user_email = models.CharField(max_length=50, null=False, default="")
    user_major = models.CharField(max_length=50, null=False, default="")
    user_department = models.CharField(max_length=50, null=False, default="")
    user_credit = models.IntegerField(null=False,default=100)
    user_indate = models.DateField()

class Mark(models.Model):
    userid = models.ForeignKey(User,on_update=models.CASCADE,on_delete=models.CASCADE)
    bookisbn = models.ForeignKey(Book,on_update=models.CASCADE,on_delete=models.CASCADE)

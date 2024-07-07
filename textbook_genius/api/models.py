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
    '''
    props: isbn, title, cover, author, publisher, pubdate
    doubanUrl, (doubanRating)...(info from external API
    '''
    
    isbn=models.CharField(max_length=13,null=False,unique=True,primary_key=True)
    title=models.CharField(max_length=50,default="",unique=False)
    author=models.JSONField(max_length=50,default="")
    publisher=models.CharField(max_length=50,default="")
    pubdate=models.CharField(max_length=10)
    cover=models.CharField(max_length=100,default="")
    douban_url=models.CharField(max_length=50,default="")
    def __str__(self) -> str:
        return 'isbn: '+self.isbn+' title: '+self.title
    
class Teacher(models.Model):
#     # props: teacher_id, teacher_name, department
#     # teacher_id=models.CharField(max_length=50,null=False,unique=True,primary_key=True)
    teacher_name=models.CharField(max_length=50,null=False,default="")
#     # department=models.CharField(max_length=50,null=False,default="")
    def __str__(self) -> str:
        return self.teacher_name
    
class Course(models.Model):
    # props: course_id, course_name, department
    # course_id=models.CharField(max_length=50,null=False,unique=True,primary_key=True)
    course_name=models.CharField(max_length=50,null=False,default="")
    department=models.CharField(max_length=50,null=False,default="")
    def __str__(self) -> str:
        return self.course_name
    class Meta:
        unique_together=('course_name','department')

class Usebook(models.Model):
    book=models.ForeignKey(Book,on_delete=models.CASCADE)#on_update=models.CASCADE
    teacher=models.ForeignKey(Teacher,on_delete=models.CASCADE)#on_update=models.CASCADE
    course=models.ForeignKey(Course,on_delete=models.CASCADE)#on_update=models.CASCADE
    school_year=models.CharField(max_length=10,null=False,default="")
    semester=models.IntegerField(null=False,default=1)
    class Meta:
        unique_together=('course','teacher','course','school_year','semester')

    def __str__(self) -> str:
        return 'book: '+self.book.title+' teacher: '+self.teacher.teacher_name+' course: '+self.course.course_name


class User(models.Model):
    user_id = models.CharField(max_length=50, null=False, unique=True,primary_key=True)
    user_name = models.CharField(max_length=50, null=False, default="")
    user_password = models.CharField(max_length=50, null=False, default="")
    user_email = models.CharField(max_length=50, null=False, default="")
    user_major = models.CharField(max_length=50, null=False, default="")
    user_department = models.CharField(max_length=50, null=False, default="")
    user_credit = models.IntegerField(null=False,default=100)
    user_indate = models.DateField()
    def __str__(self) -> str:
        return self.user_name

class Mark(models.Model):
    markid=models.CharField(max_length=10,primary_key=True)
    userid = models.ForeignKey(User,on_delete=models.CASCADE)#on_update=models.CASCADE
    bookisbn = models.ForeignKey(Book,on_delete=models.CASCADE)#on_update=models.CASCADE

class Comment(models.Model):
    com_id = models.CharField(max_length=50,null=False,unique=True,primary_key=True)
    info = models.CharField(max_length=200,null=False,unique=True)   
    # relationship with book
    book = models.ForeignKey(Book,on_delete=models.CASCADE)#on_update=models.CASCADE
    # relationship with user
    user_id = models.ForeignKey(User,on_delete=models.CASCADE) #on_update=models.CASCADE
    # relationship with user : props
    com_date = models.DateTimeField(auto_now_add=True)

class Like(models.Model):
    # relationship with user and comment
    user = models.ForeignKey(User,on_delete=models.CASCADE)#on_update=models.CASCADE
    comment = models.ForeignKey(Comment,on_delete=models.CASCADE)#on_update=models.CASCADE
    # props
    like = models.IntegerField(null=False,default=0)
    dislike = models.IntegerField(null=False,default=0)

class ScoreUserRelation(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    useBook=models.ForeignKey(Usebook,on_delete=models.CASCADE,primary_key=True)
    # get_it=models.IntegerField(null=False,default=0)
    # dont_get_it=models.IntegerField(null=False,default=0)


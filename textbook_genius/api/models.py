from django.db import models
from django.contrib.auth.models import User
import string
import random
import datetime
import os

def generate_unique_code():
    length=6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase,k=length))
        if ValidationCode.objects.filter(code = code).count()==0:
            break

    return code
    
# def get_current_datetime():
    # return datetime.datetime.now()

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


class Profile(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,primary_key=True)
    # user_id = models.CharField(max_length=10, default=generate_unique_code, unique=True,primary_key=True)
    # nickname = models.CharField(max_length=50, null=False, default="")
    # user_password = models.CharField(max_length=50, null=False, default="")
    # user_email = models.CharField(max_length=50, null=False, default="")
    user_major = models.CharField(max_length=50, null=False, default="")
    user_department = models.CharField(max_length=50, null=False, default="")
    user_credit = models.IntegerField(null=False,default=100)
    user_indate = models.CharField(max_length=4, null=False, default="")
    user_avatar = models.ImageField(upload_to='Avatar/', null=False, blank=True, default='Avatar/DefaultAvatar.png')
    # print(user_id)
    def save(self, *args, **kwargs):
        # 如果对象已存在（即这是更新操作）
        if self.pk:
            # 获取当前对象
            old_instance = Profile.objects.get(pk=self.pk)
            old_image = old_instance.user_avatar

            # 如果旧图片和新图片不同，并且旧图片存在
            if old_image and old_image != self.user_avatar:
                # 删除旧图片
                if os.path.isfile(old_image.path):
                    os.remove(old_image.path)
        super(Profile, self).save(*args, **kwargs)
    def __str__(self) -> str:
        return "id: {0} username: {1}".format(self.user.id,self.user.get_username())

class Mark(models.Model):
    markid=models.CharField(max_length=10,primary_key=True)
    userid = models.ForeignKey(User,on_delete=models.CASCADE)#on_update=models.CASCADE
    bookisbn = models.ForeignKey(Book,on_delete=models.CASCADE)#on_update=models.CASCADE

class Comment(models.Model):
    com_id = models.CharField(max_length=50,null=False,unique=True,primary_key=True)
    info = models.CharField(max_length=200,null=False,unique=True)   
    # relationship with usebook
    usebook = models.ForeignKey(Usebook,on_delete=models.CASCADE)#on_update=models.CASCADE
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

class UpScoreUserRelation(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    useBook=models.ForeignKey(Usebook,on_delete=models.CASCADE)
    class Meta:
        unique_together=('user','useBook')
    def __str__(self) -> str:
        return str(self.user.id)+" on "+self.useBook.__str__()

class DownScoreUserRelation(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    useBook=models.ForeignKey(Usebook,on_delete=models.CASCADE)
    class Meta:
        unique_together=('user','useBook')
    def __str__(self) -> str:
        return str(self.user.id)+" on "+self.useBook.__str__()

class ValidationCode(models.Model):
    code=models.CharField(max_length=8,default=generate_unique_code, unique=True,primary_key=True)
    email=models.CharField(max_length=100)
    # class Meta:
    def __str__(self) -> str:
        return "email:{} code:{}".format(self.email,self.code)
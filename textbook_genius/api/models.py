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

class Course(models.Model):
    # props: course_id, teacher, isbn, shared_files
    pass

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
    
    def __str__(self) -> str:
        return "isbn:{0} title:{1}".format(self.isbn,self.title)
    
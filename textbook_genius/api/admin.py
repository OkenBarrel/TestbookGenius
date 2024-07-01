from django.contrib import admin

# Register your models here.
from .models import Book,Teacher,Course,User,Mark

admin.site.register(Book)
admin.site.register(Teacher)
admin.site.register(Course)
admin.site.register(User)
admin.site.register(Mark)

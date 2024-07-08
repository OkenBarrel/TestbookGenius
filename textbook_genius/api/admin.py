from django.contrib import admin
from django.contrib.sessions.models import Session
# from django.contrib.auth.admin import UserAdmin

# Register your models here.
from .models import Book,Teacher,Course,Mark,Usebook


class UsebookAdmin(admin.ModelAdmin):
    list_display = ('id', 'book', 'teacher', 'course','school_year','semester')
    readonly_fields = ('id',)


admin.site.register(Book)
admin.site.register(Teacher)
admin.site.register(Course)
# admin.site.register(User)
admin.site.register(Mark)
admin.site.register(Usebook,UsebookAdmin)
admin.site.register(Session)
# admin.site.register(User, UserAdmin)



from django.urls import path
from .views import RoomView,get_doubanBook,get_book,createBook,updateBook,scoreUser,loggin,ProfileViewer
from .views import getUseBook
from .views import register
urlpatterns = [
    # path('', views.getRoutes, name="routes"),
    # path('home',RoomView.as_view()),
    # path('get-room',get_book.as_view()),
    path('get-douban-book',get_doubanBook.as_view()),
    path('get-book',get_book.as_view()),
    path('create-book',createBook.as_view()),
    path('update-book',updateBook.as_view()),
    path('get-useBook',getUseBook.as_view()),
    path('register',register.as_view()),
    path('score-user',scoreUser.as_view()),
    path('login',loggin.as_view()),
    path('user/<str:user_id>/', ProfileViewer.as_view(), name='user_profile')

]
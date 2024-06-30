from django.urls import path
from .views import RoomView,get_doubanBook,createBook,get_book

urlpatterns = [
    # path('', views.getRoutes, name="routes"),
    # path('home',RoomView.as_view()),
    path('get-douban-book',get_doubanBook.as_view()),
    path('get-book',get_book.as_view()),
    path('create-book',createBook.as_view()),
    path('get-room',get_book.as_view())
]
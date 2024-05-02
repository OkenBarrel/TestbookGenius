from django.urls import path
from .views import RoomView,getBook

urlpatterns = [
    path('home',RoomView.as_view()),
    path('get-book',getBook.as_view())

]
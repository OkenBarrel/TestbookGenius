from django.urls import path
from .views import RoomView,get_doubanBook,get_book,createBook,updateBook,upScoreUser,loggin,\
                    downScoreUser,getUseBook,register,validation,SearchView

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
    path('up-score-user',upScoreUser.as_view()),
    path('login',loggin.as_view()),
    path('down-score-user',downScoreUser.as_view()),
    path('validation',validation.as_view()),
    path('search',SearchView.as_view(),name = 'search')
    
]
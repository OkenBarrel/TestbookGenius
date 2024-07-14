from django.urls import path
from .views import get_doubanBook,get_book,createBook,updateBook,upScoreUser,loggin,\
                    downScoreUser,getUseBook,register,validation,SearchView,loggout,ProfileViewer,\
                    proxy_image,getComment,createComment,markBook,getOneUseBook,is_loggedin

urlpatterns = [
    path('get-douban-book',get_doubanBook.as_view()),
    path('get-book',get_book.as_view()),
    path('create-book',createBook.as_view()),
    path('update-book',updateBook.as_view()),
    path('mark-book',markBook.as_view()),
    path('get-useBook',getUseBook.as_view()),
    path('register',register.as_view()),
    path('up-score-user',upScoreUser.as_view()),
    path('login',loggin.as_view()),
    path('down-score-user',downScoreUser.as_view()),
    path('validation',validation.as_view()),
    path('search',SearchView.as_view(),name = 'search'),
    path('get-comment',getComment.as_view()),
    path('create-comment',createComment.as_view()),
    path('search/results',SearchView.as_view()),
    path('logout',loggout.as_view()),
    path('user', ProfileViewer.as_view(), name='user_profile'),
    path('proxy-image', proxy_image.as_view(), name='proxy_image'),
    path('get-one-useBook',getOneUseBook.as_view()),
    path('is-loggedin',is_loggedin.as_view()),

]
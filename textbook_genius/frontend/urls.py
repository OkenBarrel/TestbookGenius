from django.urls import path
from .views import index
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    # path('', index),
    # path('join', index),
    path('create', TemplateView.as_view(template_name='index.html')),
    path('book/<str:isbn>', TemplateView.as_view(template_name='index.html')),
    path('book/<str:isbn>/update', TemplateView.as_view(template_name='index.html')),
    path('user-register',TemplateView.as_view(template_name='index.html')),
    path('user-login',TemplateView.as_view(template_name='index.html')),
    path('user/<str:userId>',TemplateView.as_view(template_name='index.html')),
    path('search/',TemplateView.as_view(template_name='index.html')),

]
from django.urls import path
from .views import index
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    # path('', index),
    # path('join', index),
    path('create', TemplateView.as_view(template_name='index.html'))
    # path('room/<str:roomCode>', index)
]
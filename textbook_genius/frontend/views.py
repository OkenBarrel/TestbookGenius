from django.shortcuts import render

# Create your views here.


def index(request, *args, **kwargs):
    return render(request, 'reactapp/public/index.html')
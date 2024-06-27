from rest_framework import serializers
from .models import Room, Book

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Room
        fields = ('id', 'code', 'host', 'guest_can_pause',
                  'votes_to_skip','created_at')

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model=Book
        dields={'isbn','title','author','publisher','pubdate','cover','douban_url'}
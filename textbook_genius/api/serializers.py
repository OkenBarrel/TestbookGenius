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
        fields=('isbn','title','author','publisher','pubdate','cover','douban_url')

    # def create(self, validated_data):
    #     authors = validated_data.pop('authors', [])
    #     # 在这里处理作者列表，可以根据需要进行逻辑处理，比如记录日志、验证数据等
    #     # 你可以根据具体需求自行扩展处理逻辑
    #     for author in authors:
        
    #     book = Book.objects.create(**validated_data)
    #     return book
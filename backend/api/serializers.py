from rest_framework import serializers
from .models import Movie, Show, Seat, Booking, Director, Actor  # include new models

# --- New serializers for Director and Actor ---
class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = ('id', 'name')

class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = ('id', 'name')


# --- Updated MovieSerializer with director and cast ---
class MovieSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    
    # Include director and cast in the serializer
    director = DirectorSerializer(read_only=True)
    cast = ActorSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = (
            'id', 'title', 'description', 'duration', 'duration_minutes', 'price', 
            'is_upcoming', 'genre', 'release_date', 'poster', 'director', 'cast'  # <-- add them here
        )
    
    def get_duration(self, obj):
        return obj.duration_minutes


# --- Other serializers remain unchanged ---
class ShowSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    movie_price = serializers.DecimalField(source='movie.price', read_only=True, max_digits=10, decimal_places=2)
    
    class Meta:
        model = Show
        fields = ('id', 'movie', 'movie_title', 'movie_price', 'show_date', 'show_time')


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True, read_only=True)
    user_username = serializers.CharField(source="user.username", read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'

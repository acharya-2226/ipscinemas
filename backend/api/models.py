from django.db import models
from django.conf import settings

# Create your models here.

class Director(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Actor(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField()
    price = models.PositiveBigIntegerField()
    is_upcoming = models.BooleanField(default=False)
    genre = models.CharField(max_length=50, blank=True, default="")
    release_date = models.DateField(blank=True, null=True)
    poster = models.ImageField(upload_to="posters/", blank=True, null=True)

    # New fields
    director = models.ForeignKey(Director, on_delete=models.SET_NULL, null=True, blank=True, related_name="movies")
    cast = models.ManyToManyField(Actor, blank=True, related_name="movies")

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        """Custom delete method to handle cascading relationships properly"""
        Show.objects.filter(movie=self).delete()
        super().delete(*args, **kwargs)
        
class Show(models.Model):
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="shows"
    )
    show_date = models.DateField()
    show_time = models.TimeField()

    class Meta:
        unique_together = ("movie", "show_date", "show_time")

    def __str__(self):
        return f"{self.movie.title} | {self.show_date} | {self.show_time}"
    
    def delete(self, *args, **kwargs):
        """Custom delete method to handle cascading relationships properly"""
        # Delete all bookings for this show first (this removes ManyToMany relationships)
        Booking.objects.filter(show=self).delete()
        # Then delete the show (seats will cascade delete automatically)
        super().delete(*args, **kwargs)


class Seat(models.Model):
    show = models.ForeignKey(
        Show,
        on_delete=models.CASCADE,
        related_name="seats"
    )
    seat_number = models.CharField(max_length=5)  # A1, A10, B3
    is_booked = models.BooleanField(default=False)

    class Meta:
        unique_together = ("show", "seat_number")

    def __str__(self):
        return f"{self.seat_number} - {'Booked' if self.is_booked else 'Free'}"
    
    # Predefine 100 seats for each show
    @staticmethod
    def create_seats_for_show(show):
        for row in range(1, 11):  # Rows A-J
            for num in range(1, 11):  # Seats 1-10
                seat_number = f"{chr(64 + row)}{num}"
                Seat.objects.create(show=show, seat_number=seat_number)

class Booking(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    show = models.ForeignKey(
        Show,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    seats = models.ManyToManyField(
        Seat,
        related_name="bookings"
    )
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} by {self.user}"

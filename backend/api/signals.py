from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Show, Seat

@receiver(post_save, sender=Show)
def create_seats_for_show(sender, instance, created, **kwargs):
    if not created:
        return

    rows = ["A", "B", "C", "D", "E"]
    seats_per_row = 10
    seats = []

    for row in rows:
        for number in range(1, seats_per_row + 1):
            seats.append(
                Seat(show=instance, seat_number=f"{row}{number}", is_booked=False)
            )

    Seat.objects.bulk_create(seats)

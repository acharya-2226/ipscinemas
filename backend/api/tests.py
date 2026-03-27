from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from User.models import User
from .models import Booking, Movie, Seat, Show


class BookingAndSeatSecurityTests(APITestCase):
	def setUp(self):
		self.movie = Movie.objects.create(
			title="Interstellar",
			description="Sci-fi",
			duration_minutes=169,
			price=250,
			is_upcoming=False,
		)
		self.show = Show.objects.create(
			movie=self.movie,
			show_date=timezone.localdate() + timedelta(days=1),
			show_time=timezone.now().time(),
		)

		self.customer = User.objects.create_user(
			username="customer1",
			password="pass1234",
			role=User.ROLE_USER,
		)
		self.owner = User.objects.create_user(
			username="owner1",
			password="pass1234",
			role=User.ROLE_OWNER,
		)

	def test_anonymous_cannot_update_seat(self):
		seat = Seat.objects.filter(show=self.show).first()
		response = self.client.patch(
			reverse("seat-detail", kwargs={"pk": seat.id}),
			{"is_booked": True},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_regular_user_cannot_update_seat(self):
		seat = Seat.objects.filter(show=self.show).first()
		self.client.force_authenticate(self.customer)
		response = self.client.patch(
			reverse("seat-detail", kwargs={"pk": seat.id}),
			{"is_booked": True},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_owner_can_update_seat(self):
		seat = Seat.objects.filter(show=self.show).first()
		self.client.force_authenticate(self.owner)
		response = self.client.patch(
			reverse("seat-detail", kwargs={"pk": seat.id}),
			{"is_booked": True},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		seat.refresh_from_db()
		self.assertTrue(seat.is_booked)

	def test_cannot_book_past_show(self):
		past_show = Show.objects.create(
			movie=self.movie,
			show_date=timezone.localdate() - timedelta(days=1),
			show_time=timezone.now().time(),
		)
		seat = Seat.objects.filter(show=past_show).first()

		self.client.force_authenticate(self.customer)
		response = self.client.post(
			reverse("booking-list"),
			{"show": past_show.id, "seats": [seat.id]},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn("past show", response.data.get("error", "").lower())

	def test_booking_books_seats_and_prevents_rebooking(self):
		seats = list(Seat.objects.filter(show=self.show).order_by("id")[:2])

		self.client.force_authenticate(self.customer)
		first = self.client.post(
			reverse("booking-list"),
			{"show": self.show.id, "seats": [seats[0].id, seats[1].id]},
			format="json",
		)
		self.assertEqual(first.status_code, status.HTTP_201_CREATED)

		seats[0].refresh_from_db()
		seats[1].refresh_from_db()
		self.assertTrue(seats[0].is_booked)
		self.assertTrue(seats[1].is_booked)
		self.assertEqual(Booking.objects.count(), 1)

		second = self.client.post(
			reverse("booking-list"),
			{"show": self.show.id, "seats": [seats[0].id]},
			format="json",
		)
		self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)

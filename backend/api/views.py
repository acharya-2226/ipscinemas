from django.db import transaction
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .models import Movie, Show, Seat, Booking
from .serializers import MovieSerializer, ShowSerializer, SeatSerializer, BookingSerializer

def is_admin_or_owner_user(user):
    return bool(
        getattr(user, "is_authenticated", False)
        and (
            getattr(user, "is_superuser", False)
            or getattr(user, "is_admin", False)
            or bool(getattr(user, "is_staff_role", lambda: False)())
            or bool(getattr(user, "is_owner", lambda: False)())
            or getattr(user, "role", "") in {"owner", "staff", "admin"}
        )
    )


class IsOwnerUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(getattr(request.user, "is_owner", lambda: False)())

class IsStaffOrOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(getattr(request.user, "is_staff_role", lambda: False)())

class IsBookingUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(getattr(request.user, "is_user_role", lambda: False)())
# Movies
class MovieListView(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        if not is_admin_or_owner_user(request.user):
            return Response(
                {"error": "Only admin/owner users can add movies"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

class MovieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        if not is_admin_or_owner_user(request.user):
            return Response(
                {"error": "Only admin/owner users can edit movies"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not is_admin_or_owner_user(request.user):
            return Response(
                {"error": "Only admin/owner users can delete movies"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

# Shows
class ShowListView(generics.ListCreateAPIView):
    serializer_class = ShowSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = Show.objects.all()
        movie_id = self.request.query_params.get("movie_id")
        show_date = self.request.query_params.get("show_date")  # get date param
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        if show_date:
            queryset = queryset.filter(show_date=show_date)  # assuming your field is show_date
        return queryset

    def create(self, request, *args, **kwargs):
        if not is_admin_or_owner_user(request.user):
            return Response(
                {"error": "Only admin/owner users can add shows"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

class ShowDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        if not is_admin_or_owner_user(request.user):
            return Response(
                {"error": "Only admin/owner users can edit shows"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not is_admin_or_owner_user(request.user):
            return Response(
                {"error": "Only admin/owner users can delete shows"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

# Seats
class SeatListView(generics.ListAPIView):
    serializer_class = SeatSerializer
    permission_classes = [permissions.AllowAny]  # anyone can read

    def get_queryset(self):
        show_id = self.kwargs['show_id']
        return Seat.objects.filter(show_id=show_id)

class SeatDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        if not is_admin_or_owner_user(request.user):
            return Response(
                {"error": "Only admin/owner users can edit seats"},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not is_admin_or_owner_user(request.user):
            return Response(
                {"error": "Only admin/owner users can delete seats"},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)
# Bookings


class BookingListView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if bool(getattr(user, "is_staff_role", lambda: False)()):
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        if not bool(getattr(request.user, "is_user_role", lambda: False)()):
            return Response({"error": "Only users can create bookings"}, status=status.HTTP_403_FORBIDDEN)

        show_id = request.data.get('show')
        seat_ids = request.data.get('seats') or request.data.get('seat_ids')

        if not show_id or not seat_ids:
            return Response({"error": "Show and seats are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            show = Show.objects.get(id=show_id)
        except Show.DoesNotExist:
            return Response({"error": "Show not found"}, status=status.HTTP_404_NOT_FOUND)

        if show.show_date < timezone.localdate():
            return Response({"error": "Cannot book a past show"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # Lock selected seat rows to prevent concurrent double booking.
            seats = Seat.objects.select_for_update().filter(id__in=seat_ids, show_id=show_id)
            if seats.count() != len(seat_ids):
                return Response({"error": "Invalid seat selection"}, status=status.HTTP_400_BAD_REQUEST)

            if seats.filter(is_booked=True).exists():
                return Response({"error": "Some seats are already booked"}, status=status.HTTP_400_BAD_REQUEST)

            booking = Booking.objects.create(user=request.user, show=show)
            booking.seats.set(seats)
            seats.update(is_booked=True)

        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

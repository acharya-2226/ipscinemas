from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import MovieListView, MovieDetailView, ShowListView, ShowDetailView, SeatListView, SeatDetailView, BookingListView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('movies/', MovieListView.as_view(), name='movie-list'),
    path('movies/<int:pk>/', MovieDetailView.as_view(), name='movie-detail'),
    path('shows/', ShowListView.as_view(), name='show-list'),
    path('shows/<int:pk>/', ShowDetailView.as_view(), name='show-detail'),
    path('seats/<int:show_id>/', SeatListView.as_view(), name='seat-list'),
    path('seats/detail/<int:pk>/', SeatDetailView.as_view(), name='seat-detail'),
    path('bookings/', BookingListView.as_view(), name='booking-list'),
]

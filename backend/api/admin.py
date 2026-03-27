from django.contrib import admin
from .models import Movie, Show, Seat, Booking, Director, Actor


# -------------------------
# Director Admin
# -------------------------
@admin.register(Director)
class DirectorAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
    ordering = ("name",)


# -------------------------
# Actor Admin
# -------------------------
@admin.register(Actor)
class ActorAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
    ordering = ("name",)


class SeatInline(admin.TabularInline):
    model = Seat
    extra = 0
    fields = ("seat_number", "is_booked")
    readonly_fields = ("seat_number", "is_booked")
    can_delete = False
    show_change_link = True


# -------------------------
# Movie Admin
# -------------------------
@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "director",
        "price",
        "genre",
        "is_upcoming",
        "release_date",
        "shows_count",
        "cast_count",
    )
    list_filter = ("genre", "is_upcoming", "release_date")
    search_fields = ("title", "description", "director__name", "cast__name")
    filter_horizontal = ("cast",)
    autocomplete_fields = ("director",)
    date_hierarchy = "release_date"
    list_per_page = 25

    def shows_count(self, obj):
        return obj.shows.count()

    shows_count.short_description = "Shows"

    def cast_count(self, obj):
        return obj.cast.count()

    cast_count.short_description = "Cast"


# -------------------------
# Show Admin
# -------------------------
@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "movie",
        "show_date",
        "show_time",
        "total_seats",
        "booked_seats",
    )
    list_filter = ("show_date",)
    search_fields = ("movie__title",)
    list_select_related = ("movie",)
    date_hierarchy = "show_date"
    inlines = [SeatInline]
    actions = ["create_missing_seats"]

    def total_seats(self, obj):
        return obj.seats.count()

    total_seats.short_description = "Total Seats"

    def booked_seats(self, obj):
        return obj.seats.filter(is_booked=True).count()

    booked_seats.short_description = "Booked Seats"

    @admin.action(description="Create missing default seats (A1-E10) for selected shows")
    def create_missing_seats(self, request, queryset):
        created = 0
        rows = ["A", "B", "C", "D", "E"]
        seats_per_row = 10
        for show in queryset:
            existing = set(show.seats.values_list("seat_number", flat=True))
            bulk = []
            for row in rows:
                for number in range(1, seats_per_row + 1):
                    seat_number = f"{row}{number}"
                    if seat_number not in existing:
                        bulk.append(Seat(show=show, seat_number=seat_number, is_booked=False))
            if bulk:
                Seat.objects.bulk_create(bulk)
                created += len(bulk)
        self.message_user(request, f"Created {created} missing seats.")


# -------------------------
# Booking Admin
# -------------------------
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "movie_name", "show", "seat_count", "booked_at")
    list_filter = ("booked_at",)
    search_fields = ("user__username", "show__movie__title")
    autocomplete_fields = ("user", "show", "seats")
    filter_horizontal = ("seats",)
    readonly_fields = ("booked_at",)
    date_hierarchy = "booked_at"

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related("user", "show", "show__movie")

    def seat_count(self, obj):
        return obj.seats.count()

    seat_count.short_description = "Seats"

    def movie_name(self, obj):
        return obj.show.movie.title

    movie_name.short_description = "Movie"


# -------------------------
# Seat Admin (Your Original Improved Version)
# -------------------------
@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ("seat_number", "movie_name", "show", "is_booked")
    list_filter = ("show", "is_booked")
    search_fields = ("seat_number", "show__movie__title")
    ordering = ("show", "seat_number")
    autocomplete_fields = ("show",)
    list_select_related = ("show", "show__movie")

    def movie_name(self, obj):
        return obj.show.movie.title

    movie_name.short_description = "Movie"
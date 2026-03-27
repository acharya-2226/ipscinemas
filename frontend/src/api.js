export const API_BASE = "http://localhost:8000/api";

function getAccess() {
  return localStorage.getItem("access");
}

function getRefresh() {
  return localStorage.getItem("refresh");
}

export function saveTokens(data) {
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
}

function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/login";
}

/* =========================
   GENERIC AUTH FETCH
========================= */

async function authFetch(url, options = {}) {
  const isFormDataBody = options.body instanceof FormData;
  const baseHeaders = isFormDataBody ? {} : { "Content-Type": "application/json" };

  let response = await fetch(url, {
    ...options,
    headers: {
      ...baseHeaders,
      Authorization: `Bearer ${getAccess()}`,
      ...options.headers,
    },
  });

  // If access token expired
  if (response.status === 401) {
    const refreshResponse = await fetch(`${API_BASE}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: getRefresh() }),
    });

    const refreshData = await refreshResponse.json();

    if (refreshData.access) {
      localStorage.setItem("access", refreshData.access);

      // Retry original request
      response = await fetch(url, {
        ...options,
        headers: {
          ...baseHeaders,
          Authorization: `Bearer ${refreshData.access}`,
          ...options.headers,
        },
      });
    } else {
      logout();
    }
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error || data?.detail || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

/* =========================
   AUTH
========================= */

export async function register({ username, email, password, password2 }) {
  const response = await fetch(`${API_BASE}/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, password2 }),
  });

  const data = await response.json();
  return data;
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (data.access) {
    saveTokens(data);
  }

  return data;
}

/* =========================
   MOVIES
========================= */

export function getMovies() {
  return fetch(`${API_BASE}/movies/`).then(res => res.json());
}

export function getShows(movieId) {
  const url = movieId ? `${API_BASE}/shows/?movie_id=${movieId}` : `${API_BASE}/shows/`;
  return fetch(url).then(res => res.json());
}

export function getSeats(showId) {
  return fetch(`${API_BASE}/seats/${showId}/`).then(res => res.json());
}

/* =========================
   BOOKING (Protected)
========================= */

// Updated to accept movie price
export function createBooking(showId, seatIds, moviePrice) {
  return authFetch(`${API_BASE}/bookings/`, {
    method: "POST",
    body: JSON.stringify({
      show: showId,
      seats: seatIds,
      total_price: seatIds.length * moviePrice, // dynamically calculated
    }),
  });
}

export function getBookings() {
  return authFetch(`${API_BASE}/bookings/`);
}

export function createMovie(movieData) {
  const isFormDataBody = movieData instanceof FormData;
  return authFetch(`${API_BASE}/movies/`, {
    method: "POST",
    body: isFormDataBody ? movieData : JSON.stringify(movieData),
  });
}

export function createShow(showData) {
  return authFetch(`${API_BASE}/shows/`, {
    method: "POST",
    body: JSON.stringify(showData),
  });
}

// Get logged-in user's profile
export function getProfile() {
  const access = localStorage.getItem("access");
  if (!access) {
    throw new Error("Not logged in");
  }

  return fetch(`${API_BASE}/users/profile/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
  }).then(res => {
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  });
}
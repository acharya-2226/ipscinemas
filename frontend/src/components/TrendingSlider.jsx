import "./TrendingSlider.css";

function TrendingSlider() {
  
  const dhurandharBookingUrl = "http://localhost:5173/shows/11";

  return (
    <div className="container-fluid p-0">
      <div
        id="movieCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#movieCarousel"
            data-bs-slide-to="0"
            className="active"
          ></button>
          <button
            type="button"
            data-bs-target="#movieCarousel"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#movieCarousel"
            data-bs-slide-to="2"
          ></button>
        </div>

        {/* Slides */}
        <div className="carousel-inner">
          {/* Slide 1 - Dhurandhar */}
          <div className="carousel-item active">
            <img
              src="../media/dhurandhar_wide.jpg"
              className="d-block w-100 slider-img slider-img-bottom"
              alt="Trending Movie"
            />
            <div className="carousel-caption custom-caption">
              <h2>🔥 Trending Now</h2>
              <p>Book the hottest movie of the week!</p>
              <button
                className="btn btn-danger"
                onClick={() => window.location.href = dhurandharBookingUrl}
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Slide 2 - Discount */}
          <div className="carousel-item">
            <img
              src="../media/discount.jpg"
              className="d-block w-100 slider-img"
              alt="Discount Offer"
            />
            <div className="carousel-caption custom-caption">
              <h2>🎉 30% OFF</h2>
              <p>Weekend Special Discount on All Shows</p>
              <button className="btn btn-warning">Grab Offer</button>
            </div>
          </div>

          {/* Slide 3 - Another Trending */}
          <div className="carousel-item">
            <img
              src="../media/ben 10.jpg"
              className="d-block w-100 slider-img"
              alt="Trending Movie"
            />
            <div className="carousel-caption custom-caption">
              <h2>⭐ Top Rated Movie</h2>
              <button className="btn btn-primary">View Details</button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#movieCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#movieCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
}

export default TrendingSlider;
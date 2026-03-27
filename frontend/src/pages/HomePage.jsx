
import Movies from "../components/Movies.jsx";
import NewReleases from "../components/Upcoming.jsx";
import TrendingSlider from "../components/TrendingSlider.jsx";

export default function HomePage() {
 

  return (
    <div className="page-container">

      <TrendingSlider />
      <Movies />
      <NewReleases />
    </div>
  );
}

import HeroSection from "@/components/heroSection";
import MovieSection from "@/components/movieSection";

function Home() {
	return (
		<main className="min-h-screen ">
			<section className="h-max">
				<HeroSection
					title={"Movie Finder"}
					subtitle={"Aggregate all your favorite movies in one place"}
					button1={{ name: "Search", url: "#moviesSearch" }}
					button2={{ name: "Your Watchlist", url: "watchlist" }}
				/>
			</section>
			<MovieSection />
		</main>
	);
}

export default Home;

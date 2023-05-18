import { Alert, Button, Spinner } from "../lib/flowbite";
import HeroSection from "@/components/heroSection";
import SearchSection from "@/components/searchSection";

export default function Home() {
	return (
		<main className="min-h-screen ">
			<section className="h-max">
				<HeroSection
					title={"Hello World"}
					subtitle={"A little website abot something"}
					button1={{ name: "Search", url: "#moviesSearch" }}
					button2={{ name: "Your Watchlist", url: "www.google.com" }}
				/>
			</section>
			<section id="moviesSearch" className="h-max">
				<SearchSection />
			</section>
		</main>
	);
}

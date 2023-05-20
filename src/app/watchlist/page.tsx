"use client";
import { useContext } from "react";
import { WatchlistContext } from "../context/AppContext.js";
import { IfMovie } from "@/lib/movies";
import MovieCard from "@/components/movieCard";
import BackButton from "@/components/backButton";

const Watchlist = () => {
	const { items } = useContext(WatchlistContext);

	const renderMovies: () => JSX.Element[] | JSX.Element = () => {
		console.log(items);
		try {
			console.log(items);

			if (items.length === 0) {
				return <div>No movies in your watchlist</div>;
			}
			return items.map((item: IfMovie) => {
				console.log(item);
				return <MovieCard key={item.imdbId} movie={item} country="us" />;
			});
		} catch (error) {
			console.error(error);
			return <div>Something went wrong</div>;
		}
	};
	return (
		<main className="format m-4">
			<div className="absolute top-2 left-2 text-text">
				<BackButton />
			</div>
			<section className="m-6 mt-10">
				<h1>Watchlist</h1>
				<div className="flex flex-row flex-wrap gap-2 justify-evenly ">{renderMovies()}</div>
			</section>
		</main>
	);
};

export default Watchlist;

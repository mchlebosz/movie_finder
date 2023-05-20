"use client";
import { Card, Button } from "../lib/flowbite";
import Link from "next/link";
import { IfMovie } from "@/lib/movies";

import { useContext, useState } from "react";
import { WatchlistContext } from "@/app/context/AppContext.js";
import { useEffect } from "react";
import { HiOutlineTrash, HiPlusCircle } from "react-icons/hi";

const limit = (string = "", limit = 0) => {
	let trimmedString = string.substring(0, limit);
	trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
	return trimmedString + "...";
};

const MovieCard: React.FC<{ movie: IfMovie; country: string }> = ({ movie, country }) => {
	const { items, addToWatchlist, removeFromWatchlist } = useContext(WatchlistContext);

	const [exists, setExists] = useState(false);

	useEffect(() => {
		const inWatchlist = items.find((item: IfMovie) => item.imdbId === movie?.imdbId);

		if (inWatchlist) {
			setExists(true);
		} else {
			setExists(false);
		}
	}, [items, movie?.imdbId]);

	const addWatchlist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.preventDefault();
		addToWatchlist(movie);
	};

	const removeWatchlist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.preventDefault();
		removeFromWatchlist(movie?.imdbId);
	};

	return (
		<div className="max-w-xs h-max">
			<Link href={{ pathname: "/movie", query: { id: movie.imdbId, country: country } }}>
				<Card imgAlt={movie.title + " poster"} imgSrc={movie.posterURLs[500]} className="h-full flex flex-col justify-between hover:cursor-pointer">
					<h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{movie.title}</h5>
					<p className="font-normal text-gray-700 dark:text-gray-400">{limit(movie.overview, 200)}</p>
					{exists ? (
						<Button onClick={removeWatchlist} color="failure" className="mt-4">
							Remove from Watchlist
							<HiOutlineTrash className="ml-2 h-5 w-5" />
						</Button>
					) : (
						<Button onClick={addWatchlist} className="mt-4">
							Add to Watchlist
							<HiPlusCircle className="ml-2 h-5 w-5" />
						</Button>
					)}
				</Card>
			</Link>
		</div>
	);
};

export default MovieCard;

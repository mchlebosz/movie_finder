"use client";
import React from "react";
import { Rating, Spinner, Button, Carousel, Badge } from "@/lib/flowbite";
import { HiPlusCircle, HiClock, HiOutlineCheck, HiOutlineTrash } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { WatchlistContext } from "@/app/context/AppContext.js";
import BackButton from "@/components/backButton";

import { getMockedMovieDetails, IfMovie, IfStreamingInfo, IfPlatform } from "@/lib/movies";
import { getFullName } from "@/lib/services";

const MoviePage = () => {
	const { items, addToWatchlist, removeFromWatchlist } = useContext(WatchlistContext);

	const debug = false;
	const searchParams = useSearchParams();
	const movieID = searchParams?.get("id");
	const movieCountry = searchParams?.get("country");

	const [movie, setMovie] = React.useState<IfMovie | undefined>(undefined);

	const [exists, setExists] = useState(false);

	useEffect(() => {
		const inWatchlist = items.find((item: IfMovie) => item.imdbId === movie?.imdbId);

		if (inWatchlist) {
			setExists(true);
		} else {
			setExists(false);
		}
	}, [items, movie?.imdbId]);

	useEffect(() => {
		const fetchMovie = async () => {
			if (debug) {
				setMovie(getMockedMovieDetails());
				return;
			}
			const options = {
				method: "GET",
				url: "https://streaming-availability.p.rapidapi.com/v2/get/basic",
				params: {
					country: movieCountry?.toLowerCase() || "us",
					imdb_id: movieID,
					output_language: "en",
				},
				headers: {
					"X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY,
					"X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
				},
			};
			try {
				const response = await axios.request(options);
				console.log(response.data?.result);
				setMovie(response.data?.result);
			} catch (error) {
				console.error(error);
			}
		};
		fetchMovie();
	}, [debug, movieCountry, movieID]);

	const addWatchlist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.preventDefault();

		console.log(movie?.imdbId);

		console.log("Add to watchlist");

		addToWatchlist(movie);
	};

	const removeWatchlist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.preventDefault();
		removeFromWatchlist(movie?.imdbId);
	};

	const watchlistButtonRender = () => {
		if (exists) {
			return (
				<Button className="text-center " size="md" color="failure" onClick={removeWatchlist}>
					Remove from Watchlist
					<HiOutlineTrash className="ml-2 h-5 w-5" />
				</Button>
			);
		} else {
			return (
				<Button className="text-center" size="md" onClick={addWatchlist}>
					Add to Watchlist
					<HiPlusCircle className="ml-2 h-5 w-5" />
				</Button>
			);
		}
	};

	const movieDetails = () => {
		if (!movie) {
			return (
				<div className="flex justify-center items-center h-screen w-full">
					<Spinner size="lg" />
				</div>
			);
		} else {
			return (
				<div>
					<div className="floatingButton fixed right-4 bottom-4">{watchlistButtonRender()}</div>

					<article className="format mx-4 sm:mx-auto mb-24">
						<h1 className="my-8 text-left">{movie.title}</h1>
						<div className="flex justify-between">
							<Badge color="gray" icon={HiClock}>
								{movie.runtime} min
							</Badge>
							<Rating>
								<Rating.Star />
								<p className="ml-2 my-1 text-sm font-bold text-gray-900 dark:text-white">{(movie.imdbRating / 10).toFixed(1)}</p>
								<span className="mx-1.5 my-1 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
								<p className="text-sm  my-1 font-medium text-gray-900  dark:text-white">{movie.imdbVoteCount} reviews</p>
							</Rating>
						</div>

						<div className="imageRoll flex flex-row justify-center flex-nowrap overflow-auto my-4">
							<div className="box flex h-80 w-full items-center justify-center">
								<Carousel slideInterval={5000} className="object-contain  bg-primary-light  rounded-md">
									<Image src={movie?.posterURLs?.[500]} alt={movie.title + " poster"} width={500} height={500} className="object-contain h-80 m-0  rounded-md" />

									<Image src={movie?.backdropURLs?.[780]} alt={movie.title + " backdrop"} width={500} height={500} className="object-contain h-80 m-0 rounded-md" />
								</Carousel>
							</div>
						</div>
						<div className="genres flex gap-3 mb-4">
							{movie?.genres?.map((genre, index) => (
								<Badge key={index} color="gray">
									{genre.name}
								</Badge>
							))}
						</div>
						<h3>Description</h3>
						<p>{movie?.overview}</p>
						<h3>Available Streaming</h3>
						<div className="flex flex-row flex-wrap gap-4">{serviceList()}</div>
					</article>
				</div>
			);
		}
	};

	const serviceList = () => {
		console.log(movieCountry);
		//fing streaming services in given country
		//return list of services
		console.log(movie);

		let services: IfStreamingInfo | undefined;
		if (movie && movie?.streamingInfo) {
			if (movieCountry) {
				services = movie?.streamingInfo?.[movieCountry];
			} else {
				services = movie?.streamingInfo?.["us"];
			}
		}

		console.log(services);
		if (services) {
			let serviceList: React.ReactNode[] = [];
			for (const [key, value] of Object.entries(services)) {
				serviceList.push(
					<div key={key} className="flex flex-col">
						<Link href={value[0].link}>
							<Button color="gray">{getFullName(key)}</Button>
						</Link>
					</div>
				);
			}
			return serviceList;
		} else {
			return <p>Not available in your country</p>;
		}
	};

	return (
		<section>
			<div className="absolute top-2 left-2">
				<BackButton />
			</div>
			<div>{movieDetails()}</div>;
		</section>
	);
};

export default MoviePage;

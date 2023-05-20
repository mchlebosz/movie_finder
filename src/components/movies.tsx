import MovieCard from "./movieCard";
import { Pagination, Button, Spinner } from "../lib/flowbite";
import axios from "axios";
import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import { getMockMovies } from "@/lib/movies";

interface Filters {
	services: string;
	genre?: string;
	keyword?: string;
	title?: string;
	country: string;
	output_language?: string;
	show_type?: string;
	original_language?: string;
}

interface Result {
	hasMore: boolean;
	nextCursor?: string;
	result: Array<any>;
}

const Movies: React.FC<{ filters: Filters }> = ({ filters }) => {
	const debug = false;
	const [movies, setMovies] = useState<Result | undefined>(undefined);

	useEffect(() => {
		const fetchMovies = async () => {
			if (debug) {
				setMovies(getMockMovies());
				return;
			}
			const options = {
				method: "GET",
				url: "https://streaming-availability.p.rapidapi.com/v2/search/basic",

				params: {
					country: filters.country || "af",
					services: filters.services || "netflix",
					output_language: filters.output_language || "en",
					show_type: filters.show_type || "all",
					genre: filters.genre || null,
					show_original_language: filters.original_language || null,
					keyword: filters.keyword || null,
				},
				headers: {
					"X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY,
					"X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
				},
			};
			try {
				try {
					const response = await axios.request(options);
					setMovies(response.data);
				} catch (error) {
					console.error(error);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchMovies();
	}, [debug, filters]);

	const onPageChange = (page: number) => {
		console.log(page);
	};

	const renderMovies = () => {
		if (!movies) {
			return <Spinner />;
		} else {
			let items = new Array<JSX.Element>();
			movies.result.forEach((value, index) => {
				items.push(<MovieCard key={index} movie={value} country={filters.country} />);
			});
			return items;
		}
	};

	return (
		<div>
			<div className="movies mx-2 flex flex-row justify-center gap-2 items-start flex-wrap">{renderMovies()}</div>

			<div className="pagination flex flex-row justify-center">
				<Pagination currentPage={1} totalPages={100} onPageChange={onPageChange} className="py-4" />
			</div>
		</div>
	);
};

export default Movies;

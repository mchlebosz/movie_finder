import MovieCard from "./movieCard";
import { Pagination, Button, Spinner, Alert } from "../lib/flowbite";
import axios from "axios";
import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import { getMockMovies } from "@/lib/movies";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { HiExclamation } from "react-icons/hi";

interface Filters {
	services: string;
	genre?: string | null;
	keyword?: string | null;
	title?: string | null;
	country: string;
	output_language?: string | null;
	show_type?: string | null;
	original_language?: string | null;
	cursor?: string | null;
}

interface Result {
	hasMore: boolean;
	nextCursor?: string;
	result: Array<any>;
}

const Movies: React.FC<{ filters: Filters; nextPage: (nextCursor: string) => void; previousPage: VoidFunction }> = ({ filters, nextPage, previousPage }) => {
	const debug = true;
	const [movies, setMovies] = useState<Result | undefined>(undefined);

	const [alert, setAlert] = React.useState({ show: false, message: "", type: "" });

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

	const onPageChange = (direction: number) => {
		console.log(direction);
		if (direction == 2) {
			// next
			// check if there is a next page
			// by checking hasMore value
			if (movies?.hasMore) {
				nextPage(movies?.nextCursor || "");
			} else {
				console.log("no more pages");
				showAlert("No more pages", "warning");
			}
		}
		if (direction == 1) {
			// prev
			// check if there is a prev page
			// by checking cursor value
			if (filters.cursor) {
				previousPage();
			} else {
				showAlert("No more pages", "warning");
			}
		}
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

	const showAlert = (message: string, type: "failure" | "success" | "warning") => {
		const newAlert = { show: true, message: message, type: type };
		setAlert(newAlert);
		setTimeout(() => {
			setAlert({ ...newAlert, show: false });
		}, 3000);
	};

	return (
		<div>
			<div className="movies mx-2 flex flex-row justify-center gap-2 items-start flex-wrap">{renderMovies()}</div>

			<div className="pagination flex flex-row justify-center">
				<Pagination currentPage={1} layout="navigation" onPageChange={onPageChange} showIcons={true} totalPages={2} />
			</div>
			<div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 ">
				<Alert
					className={`transition-all  ${alert.show ? "translate-y-0" : "translate-y-32"}`}
					color={alert.type}
					icon={alert.type === "failure" ? HiXCircle : alert.type === "success" ? HiCheckCircle : HiExclamation}
				>
					<span>{alert.message}</span>
				</Alert>
			</div>
		</div>
	);
};

export default Movies;

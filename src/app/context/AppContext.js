"use client";
import { createContext, useReducer, useEffect } from "react";

export const WatchlistContext = createContext({
	items: [],
	addToWatchlist: (movie) => {},
	removeFromWatchlist: (imdbId) => {},
});
export const WatchlistProvider = ({ children }) => {
	const [state, dispatch] = useReducer(watchlistReducer, {
		items: [],
	});

	const addToWatchlist = (product) => {
		const updatedWatchlist = [...state.items, product];

		dispatch({
			type: "ADD",
			payload: {
				items: updatedWatchlist,
			},
		});

		console.log(state.items);
	};

	const removeFromWatchlist = (imdbId) => {
		const updatedWatchlist = state.items.filter((currentMovie) => currentMovie.imdbId != imdbId);

		dispatch({
			type: "REMOVE",
			payload: {
				items: updatedWatchlist,
			},
		});

		console.log(state.items);
	};

	useEffect(() => {
		const storedState = localStorage.getItem("state");
		if (storedState) {
			try {
				const parsedState = JSON.parse(storedState);
				if (parsedState && typeof parsedState === "object") {
					console.log("storedState", parsedState);
					dispatch({
						type: "init_stored",
						value: parsedState,
					});
				}
			} catch (error) {
				console.error(error);
			}
		}
	}, []);
	useEffect(() => {
		localStorage.setItem("state", JSON.stringify(state));
	}, [state]);

	const value = {
		items: state.items,
		addToWatchlist,
		removeFromWatchlist,
	};

	return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};

const watchlistReducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "init_stored": {
			return action.value;
		}
		case "ADD":
			return {
				...state,
				items: payload.items,
			};

		case "REMOVE":
			return {
				...state,
				items: payload.items,
			};

		default:
			throw new Error("No case for that type");
	}
};

export const FilterContext = createContext({
	filter: {
		services: "netflix",
		country: "us",
		genre: null,
		keyword: null,
		title: null,
		output_language: null,
		show_type: null,
		original_language: null,
		cursor: null,
	},

	setFilter: (newFilter) => {},
});

export const FilterProvider = ({ children }) => {
	const [state, dispatch] = useReducer(filterReducer, {
		filter: {
			services: "netflix",
			country: "us",
			genre: null,
			keyword: null,
			title: null,
			output_language: null,
			show_type: null,
			original_language: null,
			cursor: null,
		},
	});

	const setFilter = (filter) => {
		dispatch({
			type: "SET",
			payload: {
				filter: filter,
			},
		});
	};

	useEffect(() => {
		const storedState = localStorage.getItem("filter");
		if (storedState) {
			try {
				const parsedState = JSON.parse(storedState);
				if (parsedState && typeof parsedState === "object") {
					console.log("storedState", parsedState);
					dispatch({
						type: "init_stored",
						value: parsedState,
					});
				}
			} catch (error) {
				console.error(error);
			}
		}
	}, []);
	useEffect(() => {
		localStorage.setItem("filter", JSON.stringify(state));
	}, [state]);

	const value = {
		filter: state.filter,
		setFilter,
	};

	return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

const filterReducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "init_stored": {
			return action.value;
		}
		case "SET":
			return {
				...state,
				filter: payload.filter,
			};

		default:
			throw new Error("No case for that type");
	}
};

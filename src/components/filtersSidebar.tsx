"use client";
import React from "react";
import { HiExclamation, HiInformationCircle, HiOutlineX } from "react-icons/hi";
import { HiCheckCircle, HiOutlineMagnifyingGlass, HiXCircle } from "react-icons/hi2";
import { Sidebar, Select, Spinner, Label, RangeSlider, Button, Checkbox, TextInput, Alert } from "../lib/flowbite";
import axios from "axios";
import { useEffect, useContext } from "react";
import { Dispatch, SetStateAction } from "react";
import { getMockedServices, getFullName } from "@/lib/services";
import getGenres from "@/lib/genres";
import { FilterContext } from "@/app/context/AppContext";

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

const FiltersSidebar: React.FC<{ visible: Boolean; toggle: VoidFunction }> = ({ visible, toggle }) => {
	const debug = false;
	const { filter, setFilter } = useContext(FilterContext);

	const [currentFilters, setCurrentFilters] = React.useState<Filters>(filter);
	const [availableServices, setAvailableServices] = React.useState({});
	const [availableGenres, setAvailableGenres] = React.useState({});
	const [availableCountry, setAvailableCountry] = React.useState([]);

	const [alert, setAlert] = React.useState({ show: false, message: "", type: "" });

	useEffect(() => {
		setCurrentFilters(filter);
	}, [filter]);

	useEffect(() => {
		const fetchServices = async () => {
			if (debug) {
				setAvailableServices(getMockedServices());
				return;
			}
			const options = {
				method: "GET",
				url: "https://streaming-availability.p.rapidapi.com/v2/services",
				headers: {
					"X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY,
					"X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
				},
			};

			try {
				const response = await axios.request(options);
				setAvailableServices(response.data.result);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchGenres = async () => {
			if (debug) {
				setAvailableGenres(getGenres());
				return;
			}
			const options = {
				method: "GET",
				url: "https://streaming-availability.p.rapidapi.com/v2/genres",
				headers: {
					"X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY,
					"X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
				},
			};
			//console.log(options);
			try {
				const response = await axios.request(options);
				setAvailableGenres(response.data.result);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchCountry = async () => {
			//Find ISO 3166-1 alpha-2 country codes
			const url = "https://restcountries.com/v3.1/all";
			try {
				const response = await axios.get(url);
				let countries = response.data;
				countries.sort((a: any, b: any) => (a.name.common > b.name.common ? 1 : -1));
				setAvailableCountry(countries);
			} catch (error) {
				console.error(error);
			}
		};

		fetchServices();
		fetchGenres();
		fetchCountry();

		return () => {};
	}, [currentFilters, debug, filter]);

	const countryOptions = (): React.ReactNode => {
		if (JSON.stringify(availableCountry) === "{}") return <option>Loading ...</option>;
		return availableCountry.map((country: any) => {
			return (
				<option key={country.cca2} value={country.cca2}>
					{country.name.common}
				</option>
			);
		});
	};

	const serviceOptions = (): React.ReactNode => {
		if (JSON.stringify(availableServices) === "{}") return <Spinner />;
		let services = [];
		for (const [key, value] of Object.entries(availableServices)) {
			services.push({ id: key, name: value });
		}
		return services.map((service: any) => {
			const isSelected = currentFilters.services.includes(service.id);
			const selectedServiceContrySupport = service.name.countries;
			const countries = Object.keys(selectedServiceContrySupport);
			const selectedCountry = currentFilters.country.toLowerCase();
			const isCountrySupported = countries.includes(selectedCountry);
			if (!isCountrySupported) return;
			return (
				<div key={service.id} className="m-2">
					<input type="checkbox" id={service.id} value={service.id} onChange={handleServiceChange} className="hidden" />
					<Label
						htmlFor={service.id}
						className={`${
							isSelected ? "text-text bg-secondary-default hover:bg-secondary-dark" : "text-white bg-primary-default hover:bg-primary-light"
						} focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 cursor-pointer`}
					>
						{getFullName(service.id)}
					</Label>
				</div>
			);
		});
	};

	const genreOptions = (): React.ReactNode => {
		if (JSON.stringify(availableGenres) === "{}") return <option>Loading ...</option>;
		//console.log(availableGenres);
		let genres = [];
		for (const [key, value] of Object.entries(availableGenres)) {
			genres.push({ id: key, name: value });
		}
		//console.log(genres);
		return genres.map((genre: any) => {
			return (
				<option key={genre.id} value={genre.id}>
					{genre.name}
				</option>
			);
		});
	};

	const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		//console.log(event.target.value);
		//set to current filters
		setCurrentFilters((prevState) => ({ ...prevState, country: event.target.value.toLowerCase() }));
	};

	const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		//console.log(event.target.value);
		//check if detected name is in the list of services in filters
		//if it is, remove it
		//if it isn't, add it
		//format: {service: "service1, service2" }
		const services = currentFilters.services.split(",");
		if (services.includes(event.target.value)) {
			const index = services.indexOf(event.target.value);
			if (index > -1) {
				services.splice(index, 1);
			}
		} else {
			services.push(event.target.value);
		}
		//console.log(services);
		setCurrentFilters((prevState) => ({ ...prevState, services: services.join(",") }));
	};

	const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		console.log(event.target.value);
		setCurrentFilters((prevState) => ({ ...prevState, genre: event.target.value }));
	};

	const handleShowTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		console.log(event.target.value);
		setCurrentFilters((prevState) => ({ ...prevState, showType: event.target.value }));
	};

	const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log(event.target.value);
		setCurrentFilters((prevState) => ({ ...prevState, keyword: event.target.value }));
	};

	const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		//if currentFilters.services is < 1 or > 4 show error
		const services = currentFilters.services.split(",").filter((service) => service !== "");

		//console.log(services);
		if (services.length < 1 || services.length > 4) {
			//console.log("please select between 1 and 4 services");
			showAlert("Please select between 1 and 4 services", "failure");
			return;
		}
		//reset page to 1
		setCurrentFilters((prevState) => ({ ...prevState, cursor: null }));
		showAlert("Filters Applied", "success");
		console.log(currentFilters);
		setFilter(currentFilters);
		console.log(filter);
	};

	const showAlert = (message: string, type: "failure" | "success" | "warning") => {
		const newAlert = { show: true, message: message, type: type };
		setAlert(newAlert);
		setTimeout(() => {
			setAlert({ ...newAlert, show: false });
		}, 3000);
	};

	return (
		<div className="search-section fixed top-0 left-0 w-full h-full z-10" style={{ display: visible ? "block" : "none" }}>
			<div className="search-section__search absolute top-0 left-0 right-0 bottom-0 bg-black/50 z-20">
				<div className="w-fit h-full">
					<Sidebar aria-label="Default sidebar example" className="relative w-5/6 sm:4/5 md:w-3/5 lg:1/2 xl: 1/4">
						<button className="absolute top-0 right-0 p-4 text-2xl text-black" onClick={toggle}>
							<HiOutlineX />
						</button>
						<div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 ">
							<Alert
								className={`transition-all  ${alert.show ? "translate-y-0" : "translate-y-32"}`}
								color={alert.type}
								icon={alert.type === "failure" ? HiXCircle : alert.type === "success" ? HiCheckCircle : HiExclamation}
							>
								<span>{alert.message}</span>
							</Alert>
						</div>
						<Sidebar.Items className="pt-8">
							<Sidebar.ItemGroup>
								<Sidebar.Item>
									<Label htmlFor="serviceCountry">Country</Label>
									<Select id="serviceCountry" required={true} onChange={handleCountryChange} value={currentFilters.country.toUpperCase()}>
										{countryOptions()}
									</Select>
								</Sidebar.Item>
								<Sidebar.Item>
									<Label htmlFor="services">Services</Label>
									<div id="Services" className="flex flex-row gap-1 flex-wrap">
										{serviceOptions()}
									</div>
								</Sidebar.Item>
								<Sidebar.Item>
									<Label htmlFor="genres">Genres</Label>
									<Select id="genres" required={true} onChange={handleGenreChange}>
										{genreOptions()}
									</Select>
								</Sidebar.Item>
								<Sidebar.Item>
									<Label htmlFor="showType">Show Type</Label>
									<Select id="showType" required={true} onChange={handleShowTypeChange}>
										<option value="movie">Movie</option>
										<option value="show">Show</option>
										<option value="all">All</option>
									</Select>
								</Sidebar.Item>
								<Sidebar.Item>
									<Label htmlFor="keyword">Keyword</Label>
									<TextInput id="keyword" type="text" icon={HiOutlineMagnifyingGlass} placeholder="Search..." required={false} onChange={handleKeywordChange} />
								</Sidebar.Item>
								<Sidebar.Item>
									<Button type="submit" onClick={handleSubmit}>
										Apply
									</Button>
								</Sidebar.Item>
							</Sidebar.ItemGroup>
						</Sidebar.Items>
					</Sidebar>
				</div>
			</div>
		</div>
	);
};

export default FiltersSidebar;

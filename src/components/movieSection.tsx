"use client";

import Filters from "@/components/filtersSidebar";
import Movies from "@/components/movies";
import React from "react";
import axios from "axios";
import { Alert, Button, Spinner, Dropdown, ToggleSwitch } from "../lib/flowbite";
import { HiOutlineFilter, HiSortAscending, HiSortDescending } from "react-icons/hi";
import { IoRadioButtonOffOutline, IoRadioButtonOnOutline } from "react-icons/io5";
import { useEffect } from "react";
import { DropdownItem } from "flowbite-react/lib/esm/components/Dropdown/DropdownItem";

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
const MovieSection: React.FC = () => {
	const [openFilters, setOpenFilters] = React.useState(false);
	const [sort, setSort] = React.useState("year");
	const [ascendingOrder, setAscendingOrder] = React.useState(true);
	const [filters, setFilters] = React.useState<Filters>({
		services: "netflix",
		country: "us",
	});

	const toggleFilters = () => {
		setOpenFilters(!openFilters);
	};

	//Yes I know this is a bad way to do it, but flowbite allow only () => void functions
	const setSortYear = () => {
		setSort("year");
	};

	const setSortName = () => {
		setSort("name");
	};

	const setSortCategory = () => {
		setSort("category");
	};

	const toggleOrder = () => {
		setAscendingOrder(!ascendingOrder);
	};

	return (
		<section id="moviesSearch" className="h-max">
			<div className="flex gap-4 items-center justify-center m-4">
				<Button onClick={toggleFilters}>
					Filters <HiOutlineFilter className="ml-2" />
				</Button>
				<Dropdown label="Sort" dismissOnClick={false}>
					<DropdownItem onClick={toggleOrder}>
						{ascendingOrder ? <HiSortAscending className="mr-2" size="1.5em" /> : <HiSortDescending className="mr-2" size="1.5em" />}
						{ascendingOrder ? "Ascending" : "Descending"}
					</DropdownItem>
					<Dropdown.Divider />
					<Dropdown.Item onClick={setSortYear} icon={sort == "year" ? IoRadioButtonOnOutline : IoRadioButtonOffOutline}>
						Year
					</Dropdown.Item>
					<Dropdown.Item onClick={setSortName} icon={sort == "name" ? IoRadioButtonOnOutline : IoRadioButtonOffOutline}>
						Name
					</Dropdown.Item>
					<Dropdown.Item onClick={setSortCategory} icon={sort == "category" ? IoRadioButtonOnOutline : IoRadioButtonOffOutline}>
						Category
					</Dropdown.Item>
				</Dropdown>
			</div>
			<Filters toggle={toggleFilters} visible={openFilters} setFilters={setFilters} filters={filters} />
			<Movies filters={filters} />
		</section>
	);
};

export default MovieSection;

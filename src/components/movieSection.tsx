"use client";

import Filters from "@/components/filtersSidebar";
import Movies from "@/components/movies";
import React from "react";
import axios from "axios";
import { Alert, Button, Spinner, Dropdown, ToggleSwitch } from "../lib/flowbite";
import { HiOutlineFilter, HiSortAscending, HiSortDescending } from "react-icons/hi";
import { IoRadioButtonOffOutline, IoRadioButtonOnOutline } from "react-icons/io5";
import { useEffect, useContext } from "react";
import { DropdownItem } from "flowbite-react/lib/esm/components/Dropdown/DropdownItem";

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
const MovieSection: React.FC = () => {
	const [openFilters, setOpenFilters] = React.useState(false);
	const [sort, setSort] = React.useState("year");
	const [ascendingOrder, setAscendingOrder] = React.useState(true);
	const [previousCursor, setPreviousCursor] = React.useState<string | null>(null);

	const { filter, setFilter } = useContext(FilterContext);

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

	const handlePrevious = () => {
		// if (page > 1) {
		// 	setPage(page - 1);
		// }
		const newFilter = { ...filter, cursor: previousCursor };
		setPreviousCursor(filter.cursor);
		setFilter(newFilter);
	};

	const handleNext = (nextCursor: string) => {
		// if (page < movies?.pages) {
		// 	setPage(page + 1);
		// }

		//Do not forget to escape the cursor value before putting it into the query as it might contain characters such as ?, &
		//nextCursor = encodeURIComponent(nextCursor);

		const newFilter = { ...filter, cursor: nextCursor };
		setPreviousCursor(filter.cursor);
		setFilter(newFilter);
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
			<Filters toggle={toggleFilters} visible={openFilters} />
			<Movies filters={filter} previousPage={handlePrevious} nextPage={handleNext} />
		</section>
	);
};

export default MovieSection;

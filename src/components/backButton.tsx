"use client";
import Link from "next/link";
import { HiOutlineArrowCircleLeft } from "react-icons/hi";
const BackButton = () => {
	return (
		<div className="absolute">
			<Link href="/">
				<HiOutlineArrowCircleLeft className="h-8 w-8 hover:cursor-pointer" />
			</Link>
		</div>
	);
};

export default BackButton;

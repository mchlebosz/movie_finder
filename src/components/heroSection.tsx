"use client";
import { Button } from "@/lib/flowbite";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useRouter } from "next/navigation";
const HeroSection: React.FC<{ title: string; subtitle: string; button1: { name: string; url: string }; button2: { name: string; url: string } }> = ({ title, subtitle, button1, button2 }) => {
	const router = useRouter();
	return (
		<div className="relative">
			<div className="absolute bg-center bg-cover bg-no-repeat bg-[url('/background.jpg')] bg-gray-600  grayscale bg-blend-multiply min-h-screen min-w-full"></div>
			<div className="absolute bg-gradient-to-r from-primary-default to-background bg-transparent bg-blend-normal min-h-screen  min-w-full opacity-40"></div>
			<section className="relative z-10 min-h-screen flex flex-col justify-center align-middle bg-transparent">
				<div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-36">
					<h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-background md:text-5xl lg:text-6xl">{title}</h1>
					<p className="mb-8 text-lg font-normal text-background lg:text-xl sm:px-16 lg:px-48">{subtitle}</p>
					<div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
						<Button className="text-center" size="lg" onClick={() => router.push(button1.url)}>
							<div className="flex justify-center w-full">
								{button1.name}
								<HiOutlineMagnifyingGlass className="ml-2 h-5 w-5" />
							</div>
						</Button>
						<Button outline={true} size="lg" onClick={() => router.push(button2.url)}>
							{button2.name}
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HeroSection;

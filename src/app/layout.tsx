import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

import { CustomFlowbiteTheme, Flowbite } from "@/lib/flowbite";
import { WatchlistProvider } from "./context/AppContext.js";
import { FilterProvider } from "./context/AppContext.js";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Movie Finder",
	description: "All Your Favorite Movies in One Place",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const theme: CustomFlowbiteTheme = {
		button: {
			base: "bg-primary-default hover:bg-primary-light text-background",
		},
	};
	return (
		<html lang="en">
			<WatchlistProvider>
				<FilterProvider>
					<Flowbite theme={{ theme }}>
						<body className={inter.className}>
							{children}
							<Script src="flowbite.min.js"></Script>
						</body>
					</Flowbite>
				</FilterProvider>
			</WatchlistProvider>
		</html>
	);
}

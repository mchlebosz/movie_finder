import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("Hello");
	// const url = new URL("https://streaming-availability.p.rapidapi.com/v2/get/basic");
	// url.searchParams.append("country", "us");
	// url.searchParams.append("imdb_id", "tt1877830");
	// url.searchParams.append("output_language", "en");

	// const options = {
	// 	method: "GET",
	// 	headers: {
	// 		"X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY || "",
	// 		"X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
	// 	},
	// 	cache: "no-store" as const,
	// };

	// console.log("Options:", options); // Log the options object
	try {
		//const response = await fetch(url.toString(), options);
		const response = await fetch("https://catfact.ninja/fact");
		const data = await response.json();
		res.status(200).json(data);
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ statusCode: 500, message: error.message });
	}
}

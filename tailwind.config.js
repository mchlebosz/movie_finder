/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
		"./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				transparent: "transparent",
				current: "currentColor",
				text: "#061e15",
				background: "#eafbf5",
				primary: {
					default: "#061e15",
					light: "#0d3a2b",
					dark: "#061e15",
				},
				secondary: {
					default: "#dde7f8",
					light: "#eafbf5",
					dark: "#d0e0f0",
				},
				tertiary: {
					default: "dde7f8",
					light: "#eafbf5",
					dark: "#d0e0f0",
				},
				accent: {
					default: "#000000",
				},
			},
			fontSize: {
				"7xl": "5rem",
				"8xl": "6rem",
				"9xl": "7rem",
				"10xl": "8rem",
			},
		},
		fontFamily: {
			sans: ["Inter", "sans-serif"],
			serif: ["Merriweather", "serif"],
		},
	},
	plugins: [require("flowbite/plugin"), require("flowbite-typography")],
};

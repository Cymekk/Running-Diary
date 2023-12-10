/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'header-img': "url('../assets/running-small.jpg')",
			},
		},
		fontFamily: {
			Roboto: ['Roboto, sans-serif'],
		},
		container: {
			center: true,
		},
	},
	plugins: [],
}

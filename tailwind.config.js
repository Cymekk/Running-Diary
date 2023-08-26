/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'button-primary': '#fab92d',
				'dark-rgba': 'rgba(0,0,0, 0.45)',
			},
			backgroundImage: {
				'header-img': "url('../assets/running-small.jpg')",
			},
		},
		fontFamily: {
			Roboto: ['Roboto, sans-serif'],
		},
		container: {
			padding: '2rem',
			center: true,
		},
		screens: {
			sm: '640px',
			md: '768px',
		},
	},
	plugins: [],
}

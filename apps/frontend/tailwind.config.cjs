/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			keyframes: {
				'pick': {
					'0%': { transform: 'perspective(600px) rotateY(0deg)' },
					'50%': { transform: 'perspective(600px) rotateY(90deg)' },
					'100%': { transform: 'perspective(600px) rotateY(180deg)' },
				},
				flip: {
					'0%': { opacity: '1' },
					'50%': { opacity: '1' },
					'100%': { opacity: '0' },
				}
			},
			animation: {
				'pick': 'pick .5s forwards',
				'flip': 'pick .5s forwards',
			},
		},
	},
	plugins: [],
}

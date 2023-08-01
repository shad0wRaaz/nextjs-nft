module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'hennypenny': ['Henny Penny', 'cursive'],
        'oregano': ['Oregano', 'cursive'],
      }
    },
    backgroundSize: {
      'auto': 'auto',
      'cover': 'cover',
      'contain': 'contain',
      '200': '200%',
    }
  },
  plugins: [],
}

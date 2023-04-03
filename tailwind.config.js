/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        gpt: "url('https://img.freepik.com/free-vector/abstract-blue-circle-black-background-technology_1142-12714.jpg?w=2000&t=st=1680551223~exp=1680551823~hmac=0c9b905c631b40bf68606df33cc2082bd81629c9a1f7a126eaecc43107b6d6dd')",
      },
    },
  },
  plugins: [],
};

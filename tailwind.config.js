module.exports = {
    // purge: [],
    mode: "jit",
    purge: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./features/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        height: {
          'max-content': '100%',
        },
        display: ["group-hover"],
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  };
  
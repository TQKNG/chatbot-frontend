import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily:{
        'sans': ['JetBrains Mono','Inter', 'sans-serif'],
      },
      colors: {
        primary:'#092a4d',
        secondary: '#0098C1',
        aquaTurquoise: '#66dcdd',
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;

import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
    colors: {
      'amarr': {
        'primary': '#191714',
        'secondary': '#BBA183',
      }
    },
  },
  plugins: [],
} satisfies Config;

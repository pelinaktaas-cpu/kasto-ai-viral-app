import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // app klasörünü taraması için talimat
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config

module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    typography: (theme) => ({}),
    extend: {
      colors: {
          'p-bg': 'var(--background)',
          's-bg': 'var(--background-secondary)',
          'p-btn': 'var(--accent-primary)',
          'p-btn-hover': 'var(--accent-hover)',
          'p-text': 'var(--text-primary)',
          's-text': 'var(--text-secondary)',
      }
    }
  }
}

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    typography: (theme) => ({}),
    extend: {
      colors: {
        'p-bg': 'var(--background)',
        's-bg': 'var(--background-secondary)',
        't-bg': 'var(--background-pop)',
        'p-btn': 'var(--accent-primary)',
        'p-btn-hover': 'var(--accent-hover)',
        's-btn': 'var(--accent-secondary)',
        'p-text': 'var(--text-primary)',
        's-text': 'var(--text-secondary)',
        'p-border': 'var(--border-primary)'
      },
      boxShadow: {
        'top': '0px -2px 20px 1px rgba(0, 0, 0, 0.2)'
      }
    }
  }
}

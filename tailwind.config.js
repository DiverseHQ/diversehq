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
        'p-bg': 'var(--background)', // background for the whole app
        's-bg': 'var(--background-secondary)', // background for important elements like post comments to make them stand out
        's-h-bg': 'var(--background-secondary-highlight)', // secondary highligth color
        'p-h-bg': 'var(--background-primary-highlight)', // primary highlight color for most most importatn elements
        't-bg': 'var(--background-pop)', // backdrop for popups
        'p-btn': 'var(--accent-primary)', // primary button color
        'p-btn-hover': 'var(--accent-hover)', // primary button hover color
        's-btn': 'var(--accent-secondary)', // secondary button color
        'p-text': 'var(--text-primary)', // primary text color
        's-text': 'var(--text-secondary)', // secondary text color
        'p-border': 'var(--border-primary)' // primary border color
      },
      boxShadow: {
        top: '0px -2px 20px 1px rgba(0, 0, 0, 0.2)'
      }
    }
  }
}

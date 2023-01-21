// eslint-disable-next-line no-undef
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    // eslint-disable-next-line no-unused-vars
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
        'p-btn-text': 'var(--btn-primary-text)', // primary button text color
        's-btn': 'var(--accent-secondary)', // secondary button color
        'p-text': 'var(--text-primary)', // primary text color
        's-text': 'var(--text-secondary)', // secondary text color
        'ap-text': 'var(--text-anti-primary)', // anti primary text color (revert of primary color)
        'lens-text': 'var(--text-lens)', // lens text color
        'p-border': 'var(--border-primary)' // primary border color
      },
      boxShadow: {
        top: '0px -2px 5px 1px rgba(0, 0, 0, 0.1)',
        nav: '0px 4px 4px rgba(0, 0, 0, 0.25)'
      }
    }
  }
}

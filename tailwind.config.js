const defaultTheme = require('tailwindcss/defaultTheme')

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
        's-bg-hover': 'var(--background-secondary-hover)', // background for important elements like post comments to make them stand out when hovered
        's-h-bg': 'var(--background-secondary-highlight)', // secondary highligth color
        'p-h-bg': 'var(--background-primary-highlight)', // primary highlight color for most most importatn elements
        't-bg': 'var(--background-pop)', // backdrop for popups
        'p-btn': 'var(--accent-primary)', // primary button color
        'p-btn-disabled': 'var(--accent-primary-disabled)', // use when primary button is disabled
        'p-btn-hover': 'var(--accent-hover)', // primary button hover color
        'p-btn-text': 'var(--btn-primary-text)', // primary button text color
        's-btn': 'var(--accent-secondary)', // secondary button color
        'p-text': 'var(--text-primary)', // primary text color
        's-text': 'var(--text-secondary)', // secondary text color
        'ap-text': 'var(--text-anti-primary)', // anti primary text color (revert of primary color)
        'lens-text': 'var(--text-lens)', // lens text color
        'p-border': 'var(--border-primary)', // primary border color
        's-border': 'var(--border-secondary)', // secondary border color
        'p-hover': 'var(--hover-primary)', // primary hover color
        'p-hover-text': 'var(--hover-primary-text)', // primary hover text color
        's-hover': 'var(--accent-hover-secondary)', // secondary hover color
        'm-btn-bg': 'var(--main-btn-bg)', // main button background
        'm-btn-text': 'var(--main-btn-text)', // main button text
        'm-btn-hover-bg': 'var(--main-btn-hover-bg)', // main button hover background
        'm-btn-hover-text': 'var(--main-btn-hover-text)', // main button hover text
        'select-btn-bg': 'var(--select-btn-bg)', // select button background,
        'select-btn-text': 'var(--select-btn-text)', // select button text,
        'select-btn-hover-bg': 'var(--select-btn-hover-bg)', // select button background when hovered,
        'select-active-btn-bg': 'var(--select-active-btn-bg)', // select button background when active,
        'select-active-btn-text': 'var(--select-active-btn-text)' // select button text when active,
      },
      boxShadow: {
        top: '0px -2px 1px 1px rgba(0, 0, 0, 0.1)',
        nav: '0px 4px 4px rgba(0, 0, 0, 0.25)'
      }
    },
    fontFamily: {
      nunito: ['Nunito Sans', 'sans-serif', ...defaultTheme.fontFamily.sans]
    }
  }
}

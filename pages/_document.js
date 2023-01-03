import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content="DiverseHQ" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="DiverseHQ" />
          <meta
            name="description"
            content="Join Communities, Share your Creativity and get Rewarded."
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />

          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />

          <link rel="shortcut icon" href="/favicon.ico" />

          <meta
            name="twitter:card"
            content="Join Communities, Share your Creativity and get Rewarded."
          />
          <meta name="twitter:url" content="https://app.diversehq.xyz" />
          <meta name="twitter:title" content="DiverseHQ" />
          <meta
            name="twitter:description"
            content="Join Communities, Share your Creativity and get Rewarded."
          />
          <meta
            name="twitter:image"
            content="https://app.diversehq.xyz/android-chrome-192x192.png"
          />
          <meta name="twitter:creator" content="@useDiverseHQ" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="DiverseHQ" />
          <meta
            property="og:description"
            content="Join Communities, Share your Creativity and get Rewarded."
          />
          <meta property="og:site_name" content="DiverseHQ" />
          <meta property="og:url" content="https://app.diversehq.xyz" />
          <meta
            property="og:image"
            content="https://app.diversehq.xyz/apple-touch-icon.png"
          />

          {/* sacred tags */}
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
          <meta name="theme-color" content="#fff" />
        </Head>
        {/* <Head>
          <meta name="application-name" content="DiverseHQ" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="DiverseHQ" />
          <meta
            name="description"
            content="Join Communities, Share your Creativity and get Rewarded."
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />

          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />

          <link rel="manifest" href="/manifest.json" />

          <link rel="shortcut icon" href="/favicon.ico" />

          <meta
            name="twitter:card"
            content="Join Communities, Share your Creativity and get Rewarded."
          />
          <meta name="twitter:url" content="https://app.diversehq.xyz" />
          <meta name="twitter:title" content="DiverseHQ" />
          <meta
            name="twitter:description"
            content="Join Communities, Share your Creativity and get Rewarded."
          />
          <meta
            name="twitter:image"
            content="https://app.diversehq.xyz/android-chrome-192x192.png"
          />
          <meta name="twitter:creator" content="@useDiverseHQ" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="DiverseHQ" />
          <meta
            property="og:description"
            content="Join Communities, Share your Creativity and get Rewarded."
          />
          <meta property="og:site_name" content="DiverseHQ" />
          <meta property="og:url" content="https://app.diversehq.xyz" />
          <meta
            property="og:image"
            content="https://app.diversehq.xyz/apple-touch-icon.png"
          />
        </Head> */}
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

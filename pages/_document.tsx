import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/2.png" />
        <link rel="shortcut icon" type="image/png" href="/2.png" />
        <link rel="apple-touch-icon" href="/2.png" />
        <meta name="theme-color" content="#66371B" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

import { Html, Head, Main, NextScript } from 'next/document';

/* eslint-disable @next/next/google-font-display */

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Permanent+Marker"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=3" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=3" />
        <link rel="apple-touch-icon" href="/icon.svg?v=3" />
        <link rel="shortcut icon" href="/icon.svg?v=3" />
        <meta name="theme-color" content="#fb923c" />
      </Head>
      <body className="font-sans leading-normal tracking-normal bg-gray-100 dark:bg-stone-900 dark:text-slate-200">
        <div>
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  );
}

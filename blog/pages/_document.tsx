import { Html, Head, Main, NextScript } from 'next/document'

/* eslint-disable @next/next/google-font-display */

export default function Document() {
  return (
    <Html>
      <Head>
        <link href='https://fonts.googleapis.com/css2?family=Permanent+Marker' rel='stylesheet' />
      </Head>
      <body className='font-sans leading-normal tracking-normal bg-gray-100 dark:bg-slate-600 dark:text-slate-200'>
        <div>
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  )
}

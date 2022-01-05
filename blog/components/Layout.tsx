import { ReactChildren, ReactChild } from 'react'
import Head from 'next/head'
import Header from './Header'

interface LayoutProps {
  pageTitle: string;
  children: ReactChild | ReactChildren;
}

export default function Layout({ children, pageTitle } : LayoutProps) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker" rel="stylesheet" />
      </Head>
      <Header />
      <section className="layout">
        <div className="container content">
          {children}
        </div>
      </section>
    </>
  )
}

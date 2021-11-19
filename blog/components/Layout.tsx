import Head from 'next/head'
import Header from '@components/Header'

interface LayoutProps {
  children: any;
  pageTitle: string;
}

export default function Layout({ children, pageTitle } : LayoutProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
      </Head>
      <Header />
      <section className="layout">
        <div className="container content">{children}</div>
      </section>
    </>
  )
}
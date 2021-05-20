import Head from 'next/head'
import Header from '@components/Header'

export default function Layout({ children, pageTitle, ...props }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
      </Head>

      <Header />
      <section className="layout">
        <div className="content">{children}</div>
      </section>
      <footer>Built by pete!</footer>
    </>
  )
}
import Layout from '@components/Layout'
import { NextSeo } from 'next-seo'

export default function About() {
  return (
    <>
      <NextSeo
        title='Pete Hampton - About me'
        description={`👋 I work with Java and TypeScript, and work with big and fast data.
                         This is my blog in which I talk about these subjects and other topics I find interesting.`} />
      <Layout pageTitle={`Pete Hampton | About`}>
        <>
          <h1 className='special'>
            Hey-o! I&apos;m Pete 👋{' '}
          </h1>

          <p>
            I&apos;m a Software Developer from Belfast, N. Ireland. My expertise is in Java, but you 
            will also find me programming C++, Go, and TypeScript. I specialise in software design and 
            distributed systems in the context of data intensive applications. I also enjoy the Linux and SysAdmin world.
            When not wrangling computers for a living, you will find me working to be a present father and husband,
            meditating, reading, and practicing yoga. I also collect guitar pedals and enjoy learning about
            Digital Signal Processing.
          </p>

          <p>
            If my work or content has helped you or your business consider paying it forward somehow.
          </p>
        </>
      </Layout>
    </>
  )
}

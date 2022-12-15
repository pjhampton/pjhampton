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
            Yo! I&apos;m Pete 👋{' '}
          </h1>

          <p>
            I&apos;m a Software Developer from Belfast, N. Ireland. My expertise is in Java and TypeScript, but you 
            will also find me programming C++, Rust, and Go.
            Although I have a few professional interests; I specialise in software design and distributed systems 
            in the context of data intensive applications.
            When not wrangling computers for a living, you will find me working to be a present father and husband,
            meditating, practicing yoga, and working on my garden. I also collect guitar pedals and enjoy learning about
            Digital Signal Processing (DSP).
          </p>

          <p>
          If my work or content has helped you or your business please pay it forward.
          </p>
        </>
      </Layout>
    </>
  )
}

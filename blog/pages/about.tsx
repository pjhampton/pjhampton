import Layout from '../components/Layout'

export interface AboutProps {
  title: string;
}

export default function About({ title } : AboutProps) {
  return (
    <Layout pageTitle={`${title} | About`}>
      <>
        <h1 className="special">
          I'm Pete 👋{' '}
          <span className="greetings">
            <span className="highlight">こんにちは</span> <span className="highlight-secondary">أهلا بك</span>
          </span>
        </h1>

        <div className="content">
          <p>
            I'm a Computer Scientist from Belfast, N. Ireland. Although my heart is in the JVM, you 
            will find me programming C++, Go and writing copious amounts of TypeScript. I have a masters 
            degree in Software Engineering and I read my PhD in Artifical Intelligence at Ulster University. 
            Although I have a few professional interests; I specialise in  software design and distributed systems 
            in the context of data intensive applications.
          </p>

          <p>
            When not wrangling computers for a living, you will find me working to be a present husband and father,
            meditating, practicing yoga, and working on my garden. I also collect guitar pedals and enjoy learning about
            Digital Signal Processing (DSP). If my work or content has helped you or your business please consider <i>paying it forward</i>.
          </p>
        </div>
      </>
    </Layout>
  )
}

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  return {
    props: {
      title: configData.default.title,
    },
  }
}

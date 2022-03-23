import Layout from '../components/Layout'

export interface AboutProps {
  title: string;
}

export default function About({ title } : AboutProps) {
  return (
    <Layout pageTitle={`${title} | About`}>
      <>
        <h1 className="special">
          I'm Pete 👋
          <span className="greetings">
            <span className="highlight">こんにちは</span> <span className="highlight-secondary">أهلا بك</span>
          </span>
        </h1>

        <div className="content">
          <p>
            I'm a computer scientist from Belfast, N. Ireland. Although my heart is in the JVM, you 
            will find me programming C++, Go and writing copious amounts of TypeScript. I have a masters 
            degree in Software Engineering and I read my PhD in Artifical Intelligence at Ulster University. 
            Although I have many professional interests; I specialise in  software design, multi-paradigm 
            programming and distributed systems in the context of data intensive applications. I care a lot
            about shipping reliable software to production and DevSecOps practices. This site is 
            a collection of essays on these topics and more.
          </p>

          <p>
            When not wrangling computers you will find me trying to be a present husband and doggy dad,
            meditating, practicing yoga, and working on my garden. If my work or content has helped you or 
            your business please consider buying me a coffee sometime or more importantly - <i>pay it forward</i>.
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

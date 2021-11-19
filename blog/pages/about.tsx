import Layout from '../components/Layout'

export interface AboutProps {
  title: string;
}

export default function About({ title } : AboutProps) {
  return (
    <>
      <Layout pageTitle={`${title} | About`}>
        <>
          <h1 className="title">I'm Pete 👋</h1>

          <div className="content">
            <p>
              I'm a computer scientist from Belfast, N. Ireland. Although my heart is in the JVM, you 
              will find me wrangling C++, Go and writing copious amounts of JavaScript. I have a masters 
              degree in Software Engineering and I read my PhD in Artifical Intelligence at Ulster University. 
              Although I have many professional interests; I specialise in  software architecture, functional 
              programming and distributed systems in the context of data intensive applications.
            </p>

            <p>
              When not wrangling computers you will find me trying to be a present husband and doggy dad,
              meditating, practicing yoga, and working on my garden. If my work has helped you or 
              your business please consider buying me a coffee sometime or more importantly - <i>pay it forward</i>.
            </p>
          </div>
        </>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  return {
    props: {
      title: configData.default.title,
      description: configData.default.description,
    },
  }
}

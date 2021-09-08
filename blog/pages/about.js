import Layout from '../components/Layout'

const About = ({ title, description, ...props }) => {
  return (
    <>
      <Layout pageTitle={`${title} | About`} description={description}>
        <h1 className="title">I'm Pete 👋</h1>

        <div className="content">
          <p>
            I'm a computer scientist from Belfast, Northern Ireland. Although my heart is in
            Java and the JVM, you will find me wrangling C++, Go and writing copious amounts of 
            JavaScript. I have a masters in Software Engineering and I read my PhD in Artifical 
            Intelligence at AIARG, Ulster University. I am interested in cloud architectures, 
            software security, and distributed systems in the context of data intensive applications.
          </p>

          <p>
            When not working with computers you will find me trying to be a present husband and doggy dad,
            meditating, practicing yoga, reading, and working on my garden. If my work has helped 
            you or your business please consider buying me a coffee sometime or more importantly - <i>pay it forward</i>.
          </p>
        </div>
      </Layout>
    </>
  )
}

export default About

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

  return {
    props: {
      title: configData.default.title,
      description: configData.default.description,
    },
  }
}

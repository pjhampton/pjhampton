import Layout from '../components/Layout'

const About = ({ title, description, ...props }) => {
  return (
    <>
      <Layout pageTitle={`${title} | About`} description={description}>
        <h1 className="title">I'm Pete 👋</h1>

        <div className="content">
          <p>
            I am a computer scientist from Belfast, N. Ireland. Although my heart is in the
            JVM you will find me wrangling Go, C++, Python and writing copious amounts of JavaScript. 
            I read my PhD in Artifical Intelligence at AIARG, Ulster University under the
            supervision of Hui Wang, Zhiwei Lin, and William Blackburn. I'm particulary interested
            in search problems, stream processing, and distributed systems in the context of data intensive applications.
          </p>

          <p>
            When not wrestling with computers, you will find me trying to be a present husband and doggy dad,
            meditating, practicing yoga, reading, and working on my garden. I'm <strong>not</strong> currently available for 
            private work or co-founding new projects but feel free to connect with me. If my work has helped 
            you or your company please consider buying me a coffee sometime or more importantly - <i>pay it forward</i>.
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
import Layout from "../components/Layout"

export interface TalksProps {
  title: string;
}

export default function Talks({ title } : TalksProps) {

  return (
    <Layout pageTitle={`${title} | Talks`}>
      <>
        <h1>Talks</h1>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>2021-Nov-06 (<strong>ElasticON 21</strong>) - Data Streams & Pipelines: <i>Observing with the Elastic Stack</i>. <a href="/talks/pjhampton-elasticon-oct2021.pdf" target="_blank">[Slides]</a></li>
        </ul>
      </>
    </Layout>
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

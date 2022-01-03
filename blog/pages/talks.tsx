import Layout from "../components/Layout"

export interface TalksProps {
  title: string;
}

export default function Talks({ title } : TalksProps) {

  return (
    <Layout pageTitle={`${title} | Talks`}>
      <>
        <h1 className="special heading font-future">2021</h1>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>6 Nov 2021 (<strong className="highlight">ElasticON 21</strong>) - <span className="silver">Data Streams & Pipelines: <i>Observing with the Elastic Stack</i></span>. <a href="/talks/pjhampton-elasticon-oct2021.pdf" target="_blank">[Slides]</a></li>
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
    },
  }
}

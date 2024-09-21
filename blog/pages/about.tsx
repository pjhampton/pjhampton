import Layout from '@components/Layout'
import { NextSeo } from 'next-seo'
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function About() {
  const { theme } = useTheme()
  const emojis = ['👋', '🦄', '⚡️', '🥸', '🍕'];
  const [emojiIndex, setEmojiIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setEmojiIndex((prevIndex) => (prevIndex + 1) % emojis.length);
    }, 900);
    
    return () => clearInterval(intervalId);
  }, []);

  const emoji = emojis[emojiIndex];

  return (
    <>
      <NextSeo
        title='Pete Hampton - About me'
        description={`👋 I work with Java and TypeScript, and work with big and fast data.
                         This is my blog in which I talk about these subjects and other topics I find interesting.`} />
      <Layout pageTitle={`Pete Hampton | About`} showShare={false}>
        <>
          <h1 className={`special ${theme === 'dark' ? 'cornsilk' : '' }`}>
            Hey-o! <span className='hidden md:inline-block'>I&apos;m Pete</span> {emoji}
          </h1>

          <p>
            My expertise is in Java, but you 
            will also find me programming C++, Go, and TypeScript. I specialise in software design and 
            distributed systems in the context of data-intensive applications. I also enjoy the Linux and SysAdmin world.
            When not wrangling computers for a living, you will find me working to be a present father and husband,
            meditating, reading, and practicing yoga. I collect guitar pedals and enjoy learning about
            Digital Signal Processing.
          </p>

          <p>
            If my work or content has helped you or your business consider paying it forward.
          </p>
        </>
      </Layout>
    </>
  )
}

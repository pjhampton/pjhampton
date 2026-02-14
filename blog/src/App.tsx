import Router from 'preact-router';
import { useState } from 'preact/hooks';
import { ThemeProvider } from './utils/theme';
import Layout from './components/Layout';
import Index from './pages/Index';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';

export function App() {
  const [showShare, setShowShare] = useState(window.location.pathname.startsWith('/post/'));

  const handleRouteChange = (e: { url: string }) => {
    setShowShare(e.url.startsWith('/post/'));
    window.scrollTo(0, 0);
  };

  return (
    <ThemeProvider>
      <Layout pageTitle="Pete Hampton" showShare={showShare}>
        <Router onChange={handleRouteChange}>
          <Index path="/" />
          <BlogPost path="/post/:postname" />
          <NotFound default />
        </Router>
      </Layout>
    </ThemeProvider>
  );
}

import Router from 'preact-router';
import { ThemeProvider } from './utils/theme';
import Index from './pages/Index';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <Index path="/" />
        <BlogPost path="/post/:postname" />
        <NotFound default />
      </Router>
    </ThemeProvider>
  );
}

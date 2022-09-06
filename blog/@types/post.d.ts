
export interface Post {
  frontMatter: FrontMatter;
  markdownBody: string;
  slug: string;
}

export interface PostGroup {
  [year: string]: Post[]
}

export interface PostProps {
  siteTitle: string;
  frontMatter: FrontMatter;
  markdownBody: string;
}

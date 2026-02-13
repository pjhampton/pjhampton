export interface FrontMatter {
  title: string;
  author: string;
  date: string;
  excerpt?: string;
  description?: string;
  show_post_footer?: boolean;
  author_link?: string;
}

export interface Post {
  frontMatter: FrontMatter;
  markdownBody: string;
  slug: string;
}

export interface PostGroup {
  [year: string]: Post[];
}

export interface PostProps {
  siteTitle: string;
  frontMatter: FrontMatter;
  markdownBody: string;
  previousPost?: Post;
  nextPost?: Post;
}

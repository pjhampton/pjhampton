
export interface FrontMatter {
  title: string;
  author: string;
  date: string;
}

export interface Post {
  slug: string;
  frontMatter: FrontMatter;
}
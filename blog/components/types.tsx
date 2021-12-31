
export interface FrontMatter {
  title: string;
  author: string;
  date: string;
}

export interface Post {
  frontMatter: FrontMatter;
  markdownBody: string;
  slug: string;
}

export interface PostGroup {
  [year: string]: Post[]
}

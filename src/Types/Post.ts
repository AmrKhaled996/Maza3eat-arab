import type { Author } from "./Author";
import type { Image } from "./Image";
import type { Tag } from "./Tag";

export interface Post {
  id: string;
  title: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  tags: Tag[];
  image: Image;
  author: Author;
}

export interface PostsResponse {
  posts: Post[];
  hasMore: boolean;
  nextCursor: string | null;
}



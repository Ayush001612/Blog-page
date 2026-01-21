export interface BlogPost {
    id: string
    title: string
    content: string
    excerpt: string
    authorId: string
    authorName: string
    category: string
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Comment {
    id: string
    postId: string
    content: string
    authorId: string
    authorName: string
    createdAt: Date
  }
  

import { db } from "./firebase"
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  where,
  Timestamp,
  limit,
} from "firebase/firestore"
import type { BlogPost, Comment } from "./types"

export async function getPosts(): Promise<BlogPost[]> {
    try{
        const q = query(collection(db,"posts"), orderBy("createdAt", "desc"), limit(6))
        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                content: data.content,
                excerpt: data.excerpt,
                authorId: data.authorId,
                authorName: data.authorName,
                category: data.category,
                imageUrl: data.imageUrl,
                createdAt: data.createdAt?.toDate() || new Date(data.createdAt),
                updatedAt: data.updatedAt?.toDate() || new Date(data.updatedAt),
            } as BlogPost
        })
    }
    catch(error){
        console.error("Error fetching posts:", error)
        return []
    }
}

export async function getPost(id: string): Promise<BlogPost | null> {
    try{
        const docRef = doc(db,"posts", id)
        const docSnap = await getDoc(docRef)
        if(!docSnap.exists()) return null

        const data = docSnap.data();
        return {
            id: docSnap.id,
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            authorId: data.authorId,
            authorName: data.authorName,
            category: data.category,
            imageUrl: data.imageUrl,
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
          } as BlogPost
        }
        catch (error) {
          console.error("Error fetching post:", error)
          return null
        }
}

export async function createPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
    try{
        const now = Timestamp.now();
        const docRef = await addDoc(collection(db,"posts"),{
            ...post,
            createdAt: now,
            updatedAt: now,
        })
        return{
            ...post,
            id: docRef.id,
            createdAt: now.toDate(),
            updatedAt: now.toDate(),
    }
    
}
catch (error) {
    console.error("Error creating post:", error)
    throw error
  }

}

export async function deletePost(id: string): Promise<void>{
    try{
        await deleteDoc(doc(db, "posts", id))

        const q = query(collection(db, "comments"), where ("postId", "==" ,id))
        const snapshot = await getDocs(q)
        await Promise.all(
            snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref))
          )
        }
    catch (error) {
        console.error("Error deleting post:", error)
        throw error
      }
}

export async function getComments(postId: string): Promise<Comment[]> {
    try{
        const q = query(collection(db, "comments"), where("postId", "==", postId), orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) =>{
            const data = doc.data()
            return{
                id: doc.id,
        postId: data.postId,
        content: data.content,
        authorId: data.authorId,
        authorName: data.authorName,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      } as Comment
            
        })
    }
    catch (error) {
        console.error("Error fetching comments:", error)
        return []
      }
}

export async function createComment(
    comment: Omit<Comment, "id" | "createdAt">
):Promise<Comment>{
    try{
        const now = Timestamp.now()
        const docRef = await addDoc(collection(db, "comments"), {
            ...comment,
            createdAt: now,
          })
          return {
            ...comment,
            id: docRef.id,
            createdAt: now.toDate(),
          }

    }
    catch (error) {
        console.error("Error creating comment:", error)
        throw error
      }
}

export async function deleteComment(commentId: string): Promise<void>{
    try {
        await deleteDoc(doc(db, "comments", commentId))
      } catch (error) {
        console.error("Error deleting comment:", error)
        throw error
      }
}
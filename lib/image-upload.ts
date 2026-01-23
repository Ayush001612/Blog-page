import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImage(file: File, userId: string): Promise<string> {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    // Sanitize filename to remove special characters
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${userId}/${timestamp}_${sanitizedFileName}`;
    const storageRef = ref(storage, `blog-images/${filename}`);

    console.log("Starting image upload:", filename);
    
    // Upload the file with error handling
    const uploadResult = await uploadBytes(storageRef, file);
    console.log("Image upload completed:", uploadResult.metadata.fullPath);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Image URL obtained:", downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to upload image: ${errorMessage}`);
  }
}

import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImage(file: File, userId: string): Promise<string> {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${userId}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, `blog-images/${filename}`);

    // Upload the file
    await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

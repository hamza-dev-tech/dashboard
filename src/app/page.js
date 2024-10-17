"use client"; // Client-side component

import { useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import styles from "./page.module.css"; // Custom styles
import { db } from "../../firebase";

export default function Home() {
  const router = useRouter();
  const [filePath, setFilePath] = useState(""); // Store the full file path
  const [loading, setLoading] = useState(true); // Track loading state
  const [showChangeFile, setShowChangeFile] = useState(false); // Show/hide file input for changes

  useEffect(() => {
    // Fetch saved file path from Firebase
    const fetchFilePath = async () => {
      try {
        const docRef = doc(db, "settings", "filePath");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFilePath(docSnap.data().path); // Set the saved file path from Firebase
        } else {
          console.log("No file path found in Firebase.");
        }
      } catch (error) {
        console.error("Error fetching file path:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilePath();
  }, []);
  const handleFilePathSubmit = async (e) => {
    e.preventDefault();
    if (filePath) {
      // Remove surrounding quotes if they exist and replace backward slashes with forward slashes
      const cleanedFilePath = filePath.replace(/['"]+/g, '').replace(/\\/g, '/'); 
  
      try {
        // Save the cleaned file path to Firebase
        await setDoc(doc(db, "settings", "filePath"), {
          path: cleanedFilePath, // Save the cleaned file path
        });
        console.log("File path saved successfully");
        setFilePath(cleanedFilePath); // Update the state to reflect the cleaned path
        setShowChangeFile(false); // Hide file input after saving
      } catch (error) {
        console.error("Error saving file path:", error);
      }
    }
  };
  
  

  // Allow user to update the file path
  const handleFileChange = () => {
    setShowChangeFile(true); // Show the input to allow file path change
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Conveyor Belt Dashboard</h1>
        <p className={styles.description}>
          Manage conveyor belt data using an Excel file.
        </p>

        {!loading && (
          <div className={styles.fileInfo}>
            <p>Current File Path: {filePath || "No file selected"}</p>
            <button className={styles.changeFileButton} onClick={handleFileChange}>
              Change File Path
            </button>
          </div>
        )}

        {showChangeFile && (
          <form onSubmit={handleFilePathSubmit}>
            <input
              type="text"
              placeholder="Enter full file path"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.saveButton}>
              Save File Path
            </button>
          </form>
        )}

        <div className={styles.conveyorSelection}>
          <div className={styles.card} onClick={() => router.push("/conveyor1")}>
            <h2>Conveyor 1</h2>
            <p>View details for Conveyor 1.</p>
          </div>
          <div className={styles.card} onClick={() => router.push("/conveyor2")}>
            <h2>Conveyor 2</h2>
            <p>View details for Conveyor 2.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

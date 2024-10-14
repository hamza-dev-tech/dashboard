"use client"; // This directive makes the component a Client Component

import Image from "next/image";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import styles from "./page.module.css"; // Ensure this file contains your custom styles

export default function Home() {
  const router = useRouter();

  const handleConveyorSelection = (conveyor) => {
    router.push(`/conveyor${conveyor}`); // Navigate to the selected conveyor page
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        
        <h1 className={styles.title}>Conveyor Belt Dashboard</h1>
        <p className={styles.description}>
          Select a conveyor to view its progress and details.
        </p>

        <div className={styles.conveyorSelection}>
          <div className={styles.card} onClick={() => handleConveyorSelection("1")}>
            <h2>Conveyor 1</h2>
            <p>View details for Conveyor 1.</p>
          </div>
          <div className={styles.card} onClick={() => handleConveyorSelection("2")}>
            <h2>Conveyor 2</h2>
            <p>View details for Conveyor 2.</p>
          </div>
        </div>

     
      </main>
  
    </div>
  );
}

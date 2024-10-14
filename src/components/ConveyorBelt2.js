"use client";
import React, { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Import external CSS
import styles from './ConveyorBelt.module.css';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ConveyorBelt2 = () => {
  const [data, setData] = useState([]);
  const [completedRoutes, setCompletedRoutes] = useState(new Set()); // Track completed routes and lanes
  const chartsRef = useRef(null); // Reference for capturing charts

  const fetchData = async () => {
    console.log("fetchData called");
    const sheetId = '10CVja5pCDPsfzmabNWoXm3tLdxunIMPunPZf0XM6FqA';
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/13-24!A:F?key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      if (!json.values) {
        console.error("No 'values' property found in the Google Sheets API response.");
        return;
      }

      const belt1Data = json.values.slice(1); // Skip header row
      setData(belt1Data);
    } catch (error) {
      console.error("Error fetching data from Google Sheets:", error);
    }
  };

  // Function to announce completion using speech synthesis
  const announceCompletion = (route, lane) => {
    const message = `Route ${route}, Lane ${lane} completed!`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.volume = 1; // Loud volume
    window.speechSynthesis.speak(utterance);
  };

  // Group data by route
  const groupDataByRoute = (data) => {
    return data.reduce((acc, row) => {
      const route = row[0]; // Route from the first column
      if (!acc[route]) {
        acc[route] = []; // Initialize array for this route
      }
      acc[route].push(row); // Push the row data into the corresponding route array
      return acc;
    }, {});
  };

  // Call fetchData when the component renders and set interval for every 5 seconds
  useEffect(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 5000); // Refresh data every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  // Check for newly completed routes and lanes and announce them
  useEffect(() => {
    const newlyCompleted = new Set();

    data.forEach((row) => {
      const route = row[0];
      const lane = row[2];
      const totalCases = parseFloat(row[3]); // Total cases from column D
      const remaining = parseFloat(row[4]); // Remaining from column E

      // Calculate completed percentage
      const completedPercentage = totalCases > 0 ? (1 - remaining / totalCases) * 100 : 0;

      if (completedPercentage === 100) {
        const routeLaneKey = `${route}-${lane}`; // Create unique key for route and lane
        if (!completedRoutes.has(routeLaneKey)) {
          newlyCompleted.add(routeLaneKey);
          announceCompletion(route, lane); // Announce new completions
        }
      }
    });

    // Update the set of completed routes and lanes
    setCompletedRoutes((prev) => new Set([...prev, ...newlyCompleted]));
  }, [data]);

  const groupedData = groupDataByRoute(data); // Grouped data by route

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.title}>Lanes 13-24</h2>
      {data.length === 0 && <p className={styles.noData}>No data to display.</p>}
      {Object.entries(groupedData).map(([route, rows]) => (
        <div key={route} className={styles.routeGroup}>
          <h3 className={styles.routeTitle}>Route {route}</h3>
          <div className={styles.progressGrid} ref={chartsRef}>
            {rows.map((row, index) => {
              const totalCases = parseFloat(row[3]); // Total cases from column D
              const remaining = parseFloat(row[4]); // Remaining from column E

              // Calculate completed percentage
              const completedPercentage = totalCases > 0 ? (1 - remaining / totalCases) * 100 : 0;

              const storeNumber = row[1].trim(); // Store number from the 'store' column

              // Skip rendering if completed percentage is 100%
              if (completedPercentage === 100) return null;

              return (
                <div key={index} className={styles.progressItem}>
                  <CircularProgressbar
                    value={completedPercentage}
                   text={`${storeNumber.slice(-4)}`}  // Display store number inside the circle
                    styles={buildStyles({
                      pathColor: completedPercentage >= 80
                        ? '#4CAF50' // Green
                        : completedPercentage <= 50
                        ? '#F44336' // Red
                        : '#FFC107', // Yellow
                      textColor: '#34495e',
                      trailColor: '#e0e0e0',
                    })}
                  />
                  <p className={styles.routeText}>Lane {row[2]}</p> {/* Display Lane Number */}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConveyorBelt2;

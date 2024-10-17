import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "conveyor-data.firebaseapp.com",
  projectId: "conveyor-data",
  storageBucket: "conveyor-data.appspot.com",
  messagingSenderId: "26417860272",
  appId: "1:26417860272:web:6a036669a0b3c127673575"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function GET(req) {
  try {
    // Fetch the file path from Firebase
    const docRef = doc(db, "settings", "filePath");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: 'File path not found in Firebase' }), { status: 404 });
    }

    const excelFilePath = docSnap.data().path; // Get the file path from Firebase
    console.log('Checking file path:', excelFilePath);

    if (!fs.existsSync(excelFilePath)) {
      console.log('File does not exist:', excelFilePath);
      return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
    }

    // Use ExcelJS to parse the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelFilePath);
    console.log('Workbook read successfully!');

    // Access the two sheets by name
    const sheet1 = workbook.getWorksheet('1-12');
    const sheet2 = workbook.getWorksheet('13-24');

    const dataSheet1 = [];
    const dataSheet2 = [];

    // Extract data from '1-12'
    sheet1.eachRow((row, rowNumber) => {
      const rowData = row.values.filter(cell => cell !== undefined && cell !== null);  // Remove empty items
      dataSheet1.push(rowData);
    });

    // Extract data from '13-24'
    sheet2.eachRow((row, rowNumber) => {
      const rowData = row.values.filter(cell => cell !== undefined && cell !== null);  // Remove empty items
      dataSheet2.push(rowData);
    });

    // Return both sheets' data in the response
    return new Response(JSON.stringify({
      '1-12': dataSheet1,
      '13-24': dataSheet2
    }), { status: 200 });

  } catch (error) {
    console.error('Error reading Excel file or fetching file path from Firebase:', error.stack);
    return new Response(JSON.stringify({ error: 'Error processing request', details: error.stack }), { status: 500 });
  }
}

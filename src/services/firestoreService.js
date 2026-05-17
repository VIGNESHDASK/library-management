import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import app from "../firebase/config";

const db = getFirestore(app);

/**
 * Export all localStorage data to Firestore
 * Uses smart merge strategy to prevent data loss
 */
export const exportDataToFirestore = async (userId) => {
  try {
    console.log("Starting export for user:", userId);

    if (!userId) {
      throw new Error("User ID is required for export");
    }

    // Collect all localStorage data
    const allData = {};
    let recordCount = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Skip system keys (darkMode, etc.)
      if (key === "darkMode") continue;

      const value = localStorage.getItem(key);
      allData[key] = value;
      recordCount++;
    }

    console.log(`Collected ${recordCount} records from localStorage`);

    // Get existing data from Firestore to merge
    const userDocRef = doc(db, "users", userId);
    console.log("Fetching existing data from Firestore...");
    const existingDoc = await getDoc(userDocRef);

    let mergedData = { ...allData };

    if (existingDoc.exists()) {
      console.log("Existing data found, merging...");
      const existingData = existingDoc.data();

      // Smart merge: For each key, keep the data with more content
      Object.keys(existingData).forEach((key) => {
        if (key === "lastUpdated" || key === "lastExportedBy") return;

        if (!allData[key]) {
          // Key exists in Firestore but not in local - keep Firestore version
          mergedData[key] = existingData[key];
        } else {
          // Both exist - compare and keep the one with more data
          const localData = tryParseJSON(allData[key]);
          const remoteData = tryParseJSON(existingData[key]);

          if (Array.isArray(localData) && Array.isArray(remoteData)) {
            // Merge arrays by unique items
            mergedData[key] = JSON.stringify(
              mergeArrays(localData, remoteData),
            );
          } else if (
            localData &&
            remoteData &&
            typeof localData === "object" &&
            typeof remoteData === "object"
          ) {
            // Merge objects
            mergedData[key] = JSON.stringify({ ...remoteData, ...localData });
          }
          // Otherwise keep the local version (already in mergedData)
        }
      });
    } else {
      console.log("No existing data found, creating new document");
    }

    // Add metadata
    mergedData.lastUpdated = serverTimestamp();
    mergedData.lastExportedBy = userId;

    console.log("Saving to Firestore...");
    // Save to Firestore
    await setDoc(userDocRef, mergedData, { merge: true });

    console.log("Export completed successfully");
    return {
      success: true,
      recordCount: Object.keys(mergedData).filter(
        (k) => k !== "lastUpdated" && k !== "lastExportedBy",
      ).length,
      message: `Successfully exported ${recordCount} records to cloud`,
    };
  } catch (error) {
    console.error("Export error:", error);
    return {
      success: false,
      error: error.message,
      message: `Failed to export: ${error.message}`,
    };
  }
};

/**
 * Import data from Firestore to localStorage
 * Uses smart merge strategy to prevent data loss
 */
export const importDataFromFirestore = async (userId) => {
  try {
    console.log("Starting import for user:", userId);

    if (!userId) {
      throw new Error("User ID is required for import");
    }

    // Get data from Firestore
    const userDocRef = doc(db, "users", userId);
    console.log("Fetching data from Firestore...");
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      console.log("No data found in Firestore");
      return {
        success: false,
        recordCount: 0,
        message: "No data found in cloud. Export data first.",
      };
    }

    const firestoreData = docSnap.data();
    console.log("Firestore data found, merging with local data...");

    let recordCount = 0;
    let updatedCount = 0;
    let newCount = 0;

    // Get current localStorage data for smart merge
    const localData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== "darkMode") {
        localData[key] = localStorage.getItem(key);
      }
    }

    // Merge and save to localStorage
    Object.keys(firestoreData).forEach((key) => {
      // Skip metadata fields
      if (key === "lastUpdated" || key === "lastExportedBy") return;

      const firestoreValue = firestoreData[key];
      const localValue = localData[key];

      if (!localValue) {
        // New data from Firestore
        localStorage.setItem(key, firestoreValue);
        newCount++;
        recordCount++;
      } else {
        // Both exist - smart merge
        const localParsed = tryParseJSON(localValue);
        const remoteParsed = tryParseJSON(firestoreValue);

        if (Array.isArray(localParsed) && Array.isArray(remoteParsed)) {
          // Merge arrays
          const merged = mergeArrays(localParsed, remoteParsed);
          localStorage.setItem(key, JSON.stringify(merged));
          updatedCount++;
          recordCount++;
        } else if (
          localParsed &&
          remoteParsed &&
          typeof localParsed === "object" &&
          typeof remoteParsed === "object"
        ) {
          // Merge objects
          const merged = { ...localParsed, ...remoteParsed };
          localStorage.setItem(key, JSON.stringify(merged));
          updatedCount++;
          recordCount++;
        } else {
          // For non-JSON data, prefer Firestore version if it has more content
          if (firestoreValue.length >= localValue.length) {
            localStorage.setItem(key, firestoreValue);
            updatedCount++;
          }
          recordCount++;
        }
      }
    });

    let message = `Successfully imported ${recordCount} records from cloud`;
    if (newCount > 0) message += ` (${newCount} new)`;
    if (updatedCount > 0) message += ` (${updatedCount} updated)`;

    console.log("Import completed:", message);
    return {
      success: true,
      recordCount,
      newCount,
      updatedCount,
      message,
    };
  } catch (error) {
    console.error("Import error:", error);
    return {
      success: false,
      error: error.message,
      message: `Failed to import: ${error.message}`,
    };
  }
};

/**
 * Helper function to safely parse JSON
 */
function tryParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Helper function to merge arrays without duplicates
 * For arrays of objects, uses deep comparison
 */
function mergeArrays(arr1, arr2) {
  const merged = [...arr1];

  arr2.forEach((item) => {
    // Check if item exists in arr1
    const exists = merged.some((existingItem) => {
      if (typeof item === "object" && item !== null) {
        return JSON.stringify(existingItem) === JSON.stringify(item);
      }
      return existingItem === item;
    });

    if (!exists) {
      merged.push(item);
    }
  });

  return merged;
}

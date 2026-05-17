
import React from "react";

const ImportLocalStorage = () => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    const reader = new FileReader();   // Create a FileReader instance

    // When file is read
    reader.onload = (e) => {
      try {
        // Parse the JSON data
        const jsonData = JSON.parse(e.target.result);

        // Save each key-value pair to localStorage
        for (const key in jsonData) {
          if (jsonData.hasOwnProperty(key)) {
            localStorage.setItem(key, jsonData[key]);
          }
        }

        alert("Data successfully imported to localStorage!");
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Invalid JSON file. Please check the format.");
      }
    };

    // Handle file read errors
    reader.onerror = () => {
      console.error("File reading error");
      alert("Failed to read the file. Please try again.");
    };

    // Read the file as text
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
      <h2>Import JSON to LocalStorage</h2>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ margin: "10px 0" }}
      />
    </div>
  );
};

export default ImportLocalStorage;

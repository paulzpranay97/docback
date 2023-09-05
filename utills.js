const fs = require('fs');

const dataFilePath = 'db_doc.json'; // Path to your JSON data file

// Read data from JSON file 
function readData() {
    const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(jsonData);
  }
  
  // Write data to JSON file
  function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  }
   // Helper function to recursively update attributes/sub-attributes
   function updateAttribute(object, path, value) {
      const segments = path.split('.');
      for (let i = 0; i < segments.length - 1; i++) {
        object = object[segments[i]];
      }
      object[segments[segments.length - 1]] = value;
    }
  

module.exports = { readData, writeData,updateAttribute};

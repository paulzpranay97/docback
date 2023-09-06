const express = require('express');
const fs = require('fs');
const DatabaseRouter = express.Router();
const dataFilePath = 'database.json'; // Path to your JSON data file


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
  

DatabaseRouter.get('/templates', (req, res) => {
    const data = readData();
    res.json(data.templates);
  });



  DatabaseRouter.get('/search', (req, res) => {
    const { query } = req.query; // Get the search query from the query parameters
    const data = readData();
  
    // Helper function to check if a string contains the query
    const stringContainsQuery = (str, query) => str.toLowerCase().includes(query.toLowerCase());
  
    // Filter chapters to find those with matching titles
    const matchingChapters = data.templates[0].chapters.filter(chapter =>
      stringContainsQuery(chapter.title1, query)
    );
  
    res.json({ chapters: matchingChapters });
  });
  


  module.exports = DatabaseRouter;
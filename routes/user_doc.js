const express = require('express');
const fs = require('fs');
const UserGuideRouter = express.Router();
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

  
  // Get all chapters
  UserGuideRouter.get('/chapters', (req, res) => {
    const data = readData();
    res.json(data.templates[0].chapters);
  });
  
  UserGuideRouter.post('/chapters', (req, res) => {
    const newChapter = req.body;
    const data = readData();
  
    // Find the last chapter and get its "no1" value
    const lastChapter = data.templates[0].chapters[data.templates[0].chapters.length - 1];
    const lastChapterNo = lastChapter ? parseInt(lastChapter.no1) : 0;
  
    // Increment the "no1" value and assign it to the new chapter
    newChapter.no1 = (lastChapterNo + 1).toString();
  
    data.templates[0].chapters.push(newChapter);
    writeData(data);
    res.json(newChapter);
  });
  // Update a chapter by ID
  UserGuideRouter.put('/chapters/:id', (req, res) => {
    const chapterId = req.params.id;
    const updatedChapter = req.body;
    const data = readData();
    const chapterToUpdate = data.templates[0].chapters.find(chapter => chapter.no1 === chapterId);
    if (chapterToUpdate) {
      Object.assign(chapterToUpdate, updatedChapter);
      writeData(data);
      res.json(chapterToUpdate);
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  });
  
  // Delete a chapter by ID
  UserGuideRouter.delete('/chapters/:id', (req, res) => {
    const chapterId = req.params.id;
    const data = readData();
    const chapterIndex = data.templates[0].chapters.findIndex(chapter => chapter.no1 === chapterId);
    if (chapterIndex !== -1) {
      data.templates[0].chapters.splice(chapterIndex, 1);
      writeData(data);
      res.json({ message: 'Chapter deleted' });
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  });


  
// Create a new template
UserGuideRouter.post('/templates', (req, res) => {
    const newData = req.body;
    const data = readData();
  
    // Calculate the next available id
    const highestId = Math.max(...data.templates.map(template => template.id));
    const newId = highestId + 1;
  
    // Assign the new id to the new template
    newData.id = newId;
  
    // Add the new template to the data and write to file
    data.templates.push(newData);
    writeData(data);
  
    res.json(newData);
  });

// Get all templates
UserGuideRouter.get('/templates', (req, res) => {
  const data = readData();
  res.json(data.templates);
});

// Delete a template by ID
UserGuideRouter.delete('/templates/:id', (req, res) => {
    const templateId = parseInt(req.params.id);
    const data = readData();
  
    // Find the index of the template to delete
    const templateIndex = data.templates.findIndex(template => template.id === templateId);
  
    if (templateIndex !== -1) {
      // Remove the template from the array
      data.templates.splice(templateIndex, 1);
      writeData(data);
      res.json({ message: 'Template deleted successfully' });
    } else {
      res.status(404).json({ error: 'Template not found' });
    }
  });
  
  // Update a template by ID
  UserGuideRouter.put('/templates/:id', (req, res) => {
    const templateId = parseInt(req.params.id);
    const updatedTemplate = req.body;
    const data = readData();
  
    // Find the index of the template to update
    const templateIndex = data.templates.findIndex(template => template.id === templateId);
  
    if (templateIndex !== -1) {
      // Update the template's data
      data.templates[templateIndex] = { ...data.templates[templateIndex], ...updatedTemplate };
      writeData(data);
      res.json(data.templates[templateIndex]);
    } else {
      res.status(404).json({ error: 'Template not found' });
    }
  });




  UserGuideRouter.post('/add', (req, res) => {
    const newData = req.body;
    const data = readData();
  
    const { type } = newData;
  
    if (type === 'template') {
      // Add a new template with auto-incremented ID
      const newId = data.templates.length + 1;
      newData.id = newId;
      newData.no1 = newId;
      data.templates.push(newData);
    } else if (type === 'chapter') {
      const templateIndex = newData.templateIndex;
      if (templateIndex !== undefined && templateIndex >= 0 && templateIndex < data.templates.length) {
        // Add a new chapter to a specific template with auto-incremented no1
        const newNo1 = data.templates[templateIndex].chapters.length + 1;
        newData.no1 = newNo1;
        data.templates[templateIndex].chapters.push(newData);
      }
    } else if (type === 'section') {
      const templateIndex = newData.templateIndex;
      const chapterIndex = newData.chapterIndex;
      if (templateIndex !== undefined && chapterIndex !== undefined &&
          templateIndex >= 0 && templateIndex < data.templates.length &&
          chapterIndex >= 0 && chapterIndex < data.templates[templateIndex].chapters.length) {
        // Add a new section to a specific chapter with auto-incremented no2
        const newNo2 = data.templates[templateIndex].chapters[chapterIndex].sections.length + 1;
        newData.no2 = newNo2;
        data.templates[templateIndex].chapters[chapterIndex].sections.push(newData);
      }
    } else if (type === 'sub_section') {
      const templateIndex = newData.templateIndex;
      const chapterIndex = newData.chapterIndex;
      const sectionIndex = newData.sectionIndex;
      if (templateIndex !== undefined && chapterIndex !== undefined && sectionIndex !== undefined &&
          templateIndex >= 0 && templateIndex < data.templates.length &&
          chapterIndex >= 0 && chapterIndex < data.templates[templateIndex].chapters.length &&
          sectionIndex >= 0 && sectionIndex < data.templates[templateIndex].chapters[chapterIndex].sections.length) {
        // Add a new sub-section to a specific section with auto-incremented no3
        const newNo3 = data.templates[templateIndex].chapters[chapterIndex].sections[sectionIndex].sub_section.length + 1;
        newData.no3 = newNo3;
        data.templates[templateIndex].chapters[chapterIndex].sections[sectionIndex].sub_section.push(newData);
      }
    }
  
    writeData(data);
    res.json(data.templates);
  });


//   [
//     {
//       "op": "replace",
//       "path": "/templates/0/title",
//       "value":"pranay"
//     }
//   ]
  

UserGuideRouter.patch('/update', (req, res) => {
    const patchOperations = req.body;
  
    const data = readData();
  
    // Apply patch operations to data
    const newData = jsonpatch.apply_patch(data, patchOperations);
  
    // Write updated data back to the file
    writeData(newData);
  
    res.json(newData.templates);
  });
  

module.exports = UserGuideRouter;

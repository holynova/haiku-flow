import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
const outputFile = path.join(dataDir, 'merged_haiku_data.json');

// Helper to read JSON file
const readJson = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

// Main merge function
const mergeData = () => {
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json') && file !== 'merged_haiku_data.json');
  let allHaikus = [];
  let globalId = 1;

  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const data = readJson(filePath);
    
    if (!data) return;

    console.log(`Processing ${file}...`);

    // Format 1: "俳句大师风格模仿集" (Array of authors)
    if (data['俳句大师风格模仿集']) {
      data['俳句大师风格模仿集'].forEach(authorGroup => {
        const author = authorGroup['大师'];
        if (authorGroup['俳句集']) {
          authorGroup['俳句集'].forEach(haiku => {
            allHaikus.push({
              id: globalId++,
              author: author,
              theme: '未分类', // Default theme
              content: haiku.content
            });
          });
        }
      });
    }
    // Format 2: "haiku_collection" with "theme" (e.g., 小林一茶 modern style)
    else if (data.haiku_collection && data.haiku_collection[0] && data.haiku_collection[0].theme) {
       const author = data.author || 'Unknown';
       data.haiku_collection.forEach(haiku => {
         allHaikus.push({
           id: globalId++,
           author: author,
           theme: haiku.theme,
           content: haiku.content
         });
       });
    }
    // Format 3: "haiku_collection" with "season" (e.g., 小林一茶 traditional style)
    else if (data.haiku_collection && data.haiku_collection[0] && data.haiku_collection[0].season) {
      const author = data.author || 'Unknown';
      data.haiku_collection.forEach(haiku => {
        allHaikus.push({
          id: globalId++,
          author: author,
          theme: haiku.season, // Map season to theme
          content: haiku.content
        });
      });
    }
    else {
      console.warn(`Unknown format in ${file}`);
    }
  });

  // Write output
  fs.writeFileSync(outputFile, JSON.stringify(allHaikus, null, 2), 'utf8');
  console.log(`Successfully merged ${allHaikus.length} haikus into ${outputFile}`);
};

mergeData();

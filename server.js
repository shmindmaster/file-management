import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import cors from 'cors';
import textract from 'textract';
import walk from 'walk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper function to normalize paths
function normalizePath(filePath) {
  return path.normalize(filePath).replace(/\\/g, '/');
}

// Helper function to extract text from a file
function extractText(filePath) {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(filePath, (error, text) => {
      if (error) {
        reject(error);
      } else {
        resolve(text);
      }
    });
  });
}

app.post('/api/search', async (req, res) => {
  const { baseDirectories, keywordConfigs } = req.body;
  const results = [];
  let filesProcessed = 0;
  let totalFiles = 0;

  for (const directory of baseDirectories) {
    const walker = walk.walk(directory.path, { followLinks: false });

    walker.on('file', async (root, stats, next) => {
      totalFiles++;
      const filePath = path.join(root, stats.name);
      try {
        const content = await extractText(filePath);
        const matchedConfigs = keywordConfigs.filter(config => 
          config.keywords.every(keyword => 
            content.toLowerCase().includes(keyword.toLowerCase())
          )
        );
        if (matchedConfigs.length > 0) {
          results.push({
            name: stats.name,
            path: normalizePath(filePath),
            keywords: matchedConfigs.flatMap(config => config.keywords)
          });
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
      filesProcessed++;
      res.write(JSON.stringify({ filesProcessed, totalFiles }) + '\n');
      next();
    });

    walker.on('end', () => {
      if (directory === baseDirectories[baseDirectories.length - 1]) {
        res.write(JSON.stringify({ results, totalFiles, filesProcessed }));
        res.end();
      }
    });
  }
});

app.post('/api/file-action', async (req, res) => {
  const { file, action, destination } = req.body;
  const sourcePath = path.resolve(file.path);
  const destPath = path.resolve(destination, file.name);

  try {
    if (action === 'move') {
      await fs.rename(sourcePath, destPath);
    } else if (action === 'copy') {
      await fs.copyFile(sourcePath, destPath);
    }
    res.json({ success: true, message: `File ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
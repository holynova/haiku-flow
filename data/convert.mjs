import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const path = require('path')
// const fs = require('fs')
// import sourceList from './merged_haiku_data.json'

const source =   {
    "id": 340,
    "author": "小林一茶（现代自由律风格）",
    "theme": "无常",
    "content": "潮水退去\n沙滩上写着\n无"
  }

  const target =  {
    id: '2',
    japanese: '閑さや\n岩にしみ入る\n蝉の声',
    romaji: 'Shizukasa ya / iwa ni shimiiru / semi no koe',
    english: 'The silence...\nSoaking into the rocks,\nThe cry of cicadas.',
    author: 'Matsuo Bashō',
    authorJp: '松尾芭蕉',
    tags: ['summer', 'mountain']
  }

  function convertOneItem(source) {
    return {
      id: source.id,
      japanese: source.content,
      romaji: source.content,
      english: source.content,
      author: source.author,
      authorJp: source.author,
      tags: [source.theme],
    }
  }

  function convertAll(sourtList) {
    if(Array.isArray(sourtList)) {
      return sourtList.map(convertOneItem);
    }
    return []
  } 


function convertAndSave(jsonPath, outputPath='/output') {

  const sourceList = JSON.parse(fs.readFileSync(path.join(__dirname, jsonPath)))
  const targetList = convertAll(sourceList)

  fs.writeFileSync(path.join(__dirname, outputPath), JSON.stringify(targetList, null, 2))
}

convertAndSave('./merged_haiku_data.json', './output.json')
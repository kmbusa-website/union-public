const fs = require('fs');
const path = require('path');

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    if (values.length < headers.length) continue;
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });
    rows.push(row);
  }
  
  return rows;
}

function cleanValue(v) {
  if (!v || v === '0') return '';
  return v.trim();
}

function convertMathsRow(row) {
  return {
    studentName: row.Name,
    indexNumber: row.Index,
    examYear: 2026,
    examSessionName: 'Pilot Exam',
    stream: 'PHYSICAL_SCIENCE',
    schoolName: cleanValue(row.School),
    nicNumber: cleanValue(row['NIC Number']),
    districtRank: row['District Rank'],
    subjectResults: [
      { subjectName: 'Combined Maths', subjectCode: 'MAT', grade: row['Combined Maths'] || 'F' },
      { subjectName: 'Physics', subjectCode: 'PHY', grade: row.Physics || 'F' },
      { subjectName: 'Chemistry', subjectCode: 'CHE', grade: row.Chemistry || 'F' },
    ]
  };
}

function convertBioRow(row) {
  return {
    studentName: row.Name,
    indexNumber: row.Index,
    examYear: 2026,
    examSessionName: 'Pilot Exam',
    stream: 'BIO_SCIENCE',
    schoolName: cleanValue(row.School),
    nicNumber: cleanValue(row['NIC Number']),
    districtRank: row['District Rank'],
    subjectResults: [
      { subjectName: 'Biology', subjectCode: 'BIO', grade: row.Biology || 'F' },
      { subjectName: 'Physics', subjectCode: 'PHY', grade: row.Physics || 'F' },
      { subjectName: 'Chemistry', subjectCode: 'CHE', grade: row.Chemistry || 'F' },
    ]
  };
}

function main() {
  const mathsCsvPath = path.join(process.cwd(), 'data/source/2026 pilot exam results_maths.csv');
  const bioCsvPath = path.join(process.cwd(), 'data/source/2026 pilot exam results_bio.csv');
  const outputPath = path.join(process.cwd(), 'public/data/al-results.json');
  
  const mathsRows = parseCsv(mathsCsvPath);
  const bioRows = parseCsv(bioCsvPath);
  
  const mathsResults = mathsRows.map(convertMathsRow);
  const bioResults = bioRows.map(convertBioRow);
  
  const allResults = [...mathsResults, ...bioResults];
  
  fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2));
  console.log(`Converted ${allResults.length} results to ${outputPath}`);
}

main();

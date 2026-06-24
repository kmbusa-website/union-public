import fs from 'fs';
import path from 'path';

interface CsvRow {
  Index: string;
  Name: string;
  'NIC Number': string;
  School: string;
  'Combined Maths': string;
  Biology: string;
  Physics: string;
  Chemistry: string;
  'District Rank': string;
}

interface SubjectResult {
  subjectName: string;
  subjectCode: string;
  grade: string;
}

interface AlResult {
  studentName: string;
  indexNumber: string;
  examYear: number;
  examSessionName: string;
  stream: string;
  schoolName: string;
  nicNumber: string;
  districtRank: string;
  subjectResults: SubjectResult[];
}

function parseCsv(filePath: string): CsvRow[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const rows: CsvRow[] = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    if (values.length < headers.length) continue;
    
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });
    rows.push(row as CsvRow);
  }
  
  return rows;
}

function convertMathsRow(row: CsvRow): AlResult {
  const subjectResults: SubjectResult[] = [];
  
  if (row['Combined Maths'] && row['Combined Maths'] !== 'F') {
    subjectResults.push({
      subjectName: 'Combined Maths',
      subjectCode: 'MAT',
      grade: row['Combined Maths']
    });
  }
  
  if (row.Physics && row.Physics !== 'F') {
    subjectResults.push({
      subjectName: 'Physics',
      subjectCode: 'PHY',
      grade: row.Physics
    });
  }
  
  if (row.Chemistry && row.Chemistry !== 'F') {
    subjectResults.push({
      subjectName: 'Chemistry',
      subjectCode: 'CHE',
      grade: row.Chemistry
    });
  }
  
  return {
    studentName: row.Name,
    indexNumber: row.Index,
    examYear: 2026,
    examSessionName: 'Pilot Exam',
    stream: 'PHYSICAL_SCIENCE',
    schoolName: row.School,
    nicNumber: row['NIC Number'],
    districtRank: row['District Rank'],
    subjectResults
  };
}

function convertBioRow(row: CsvRow): AlResult {
  const subjectResults: SubjectResult[] = [];
  
  if (row.Biology && row.Biology !== 'F') {
    subjectResults.push({
      subjectName: 'Biology',
      subjectCode: 'BIO',
      grade: row.Biology
    });
  }
  
  if (row.Physics && row.Physics !== 'F') {
    subjectResults.push({
      subjectName: 'Physics',
      subjectCode: 'PHY',
      grade: row.Physics
    });
  }
  
  if (row.Chemistry && row.Chemistry !== 'F') {
    subjectResults.push({
      subjectName: 'Chemistry',
      subjectCode: 'CHE',
      grade: row.Chemistry
    });
  }
  
  return {
    studentName: row.Name,
    indexNumber: row.Index,
    examYear: 2026,
    examSessionName: 'Pilot Exam',
    stream: 'BIO_SCIENCE',
    schoolName: row.School,
    nicNumber: row['NIC Number'],
    districtRank: row['District Rank'],
    subjectResults
  };
}

function main() {
  const mathsCsvPath = path.join(process.cwd(), 'data/source/2026 pilot exam results_maths.csv');
  const bioCsvPath = path.join(process.cwd(), 'data/source/2026 pilot exam results_bio.csv');
  const outputPath = path.join(process.cwd(), 'data/al-results.json');
  
  const mathsRows = parseCsv(mathsCsvPath);
  const bioRows = parseCsv(bioCsvPath);
  
  const mathsResults = mathsRows.map(convertMathsRow);
  const bioResults = bioRows.map(convertBioRow);
  
  const allResults = [...mathsResults, ...bioResults];
  
  fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2));
  console.log(`Converted ${allResults.length} results to ${outputPath}`);
}

main();

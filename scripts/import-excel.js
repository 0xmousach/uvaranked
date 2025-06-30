const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importExcelData(filePath, tableName) {
  try {
    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${data.length} rows in ${filePath}`);
    
    // Insert data into Supabase
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();
    
    if (error) {
      console.error('Error inserting data:', error);
      return;
    }
    
    console.log(`Successfully inserted ${insertedData.length} rows into ${tableName}`);
    
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// Usage example
const filePath = process.argv[2];
const tableName = process.argv[3];

if (!filePath || !tableName) {
  console.log('Usage: node import-excel.js <excel-file-path> <table-name>');
  console.log('Example: node import-excel.js ./data/students.xlsx linkedin_profiles');
  process.exit(1);
}

importExcelData(filePath, tableName); 
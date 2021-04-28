import Papa from 'papaparse';

export function deserializeCSV(data){
  return Papa.parse(data,{
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
}
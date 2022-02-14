const fs = require('fs')
const xlsx = require('xlsx')

// let buffer = fs.readFileSync("./example.json");

let data = require('./example.json')

data.push(
    {
        "name": "Akash",
        "lastname": "Choudhury",
        "age": 40,
        "address": {
            "city": "Rayagada",
            "state": "odisha"
        }
    }
)

function excelWriter(filePath, jsonData, sheetName) {
    //Add new workbook
    let newWB = xlsx.utils.book_new();

    //This will take JSON and will convert into Excel Format
    let newWS = xlsx.utils.json_to_sheet(jsonData);

    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

function excelRead(filePath, sheetName) {
    //Excel file to read
    let wb = xlsx.readFile(filePath);

    //Excel sheet to read
    let excelData = wb.Sheets[sheetName];

    //Conversion from sheet and json
    let ans = xlsx.utils.sheet_to_json(excelData);
    console.log(ans)
}

console.log(data);

let stringData = JSON.stringify(data);

fs.writeFileSync('./example.json', stringData);






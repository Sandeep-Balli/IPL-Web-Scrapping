// const url = "https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";

const request = require('request');
const cheerio = require('cheerio');

const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

function processScoreCard(url) {
    request(url, cb);
}


function cb(error, response, html) {
    if(error) {
        console.log(error);
    } else {
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html) {
    let $ = cheerio.load(html);

    let matchDesc = $('.match-header-container .description').text();

    console.log(matchDesc);

    console.log('-------------------------------------');

    let descArr = matchDesc.split(',');

    let venue = descArr[1].trim();
    let matchDate = descArr[2].trim();

    let result = $('.match-header .status-text').text();

    console.log('-------------------------------------');

    console.log(venue);
    console.log(matchDate);
    console.log('Winning Team -> ' + result.slice(0, 11));

    console.log('-------------------------------------');

    let innings = $('.card.content-block.match-scorecard-table>.Collapsible')

    let htmlString = ''

    for(let i = 0; i < innings.length; i++) {
        htmlString += $(innings[i]).html()

        let teamName = $(innings[i]).find('h5').text();
        teamName = teamName.split('INNINGS')[0].trim();
        
        let opponentIndex = i == 0 ? 1 : 0;
        
        let opponentName = $(innings[opponentIndex]).find('h5').text();
        opponentName = opponentName.split('INNINGS')[0].trim();

        let curInnning = $(innings[i]);

        let allRows = curInnning.find('.table.batsman tbody tr');

        for(let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find('td')
            let isWorthy = $(allCols[0]).hasClass('batsman-cell')

            if(isWorthy == true) {

                // runs, balls, player name, fours, sixes and strike rate

                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let strikeRate = $(allCols[7]).text().trim();

                console.log(`${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${strikeRate}`);

                processPlayer(teamName, matchDate, playerName, runs, balls, fours, sixes, strikeRate, opponentName, venue, result)

            }
            
        }

        console.log('-------------------------------------');

        // console.log(venue, teamName, opponentName, result, matchDate);

        // console.log(`${venue} | ${teamName} | ${opponentName} | ${result} | ${matchDate}`);
    }
    
}


function processPlayer(teamName, matchDate, playerName, runs, balls, fours, sixes, strikeRate, opponentName, venue, result) {
    let teamPath = path.join(__dirname, 'IPL', teamName)
    dirCreator(teamPath)

    let filePath = path.join(teamPath, playerName + '.xlsx');
    let content = excelRead(filePath, playerName);

    let playerObj = {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        strikeRate,
        opponentName,
        venue,
        result,
        matchDate
    }

    content.push(playerObj)
    excelWriter(filePath, content, playerName)
}

function dirCreator(filePath) {
    if(fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath)
    }
}


function excelWriter(filePath, jsonData, sheetName) {
    //Add new workbook
    let newWB = xlsx.utils.book_new();

    //This will take JSON and will convert into Excel Format
    let newWS = xlsx.utils.json_to_sheet(jsonData);

    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

function excelRead(filePath, sheetName) {

    if(fs.existsSync(filePath) == false) {
        return []
    }

    //Excel file to read
    let wb = xlsx.readFile(filePath);

    //Excel sheet to read
    let excelData = wb.Sheets[sheetName];

    //Conversion from sheet and json
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans
}

module.exports = {
    ps : processScoreCard
}
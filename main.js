const fs = require('fs');
const path = require('path')

const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const request = require('request');
const cheerio = require('cheerio')

//Creating a folder with name IPL
let iplPath = path.join(__dirname, "IPL")

dirCreator(iplPath)

function dirCreator(filePath) {
    if(fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath)
    }
}

const allMatchObj = require('./allMatch');

request(url, cb);

function cb(error, response, html) {
    if(error) {
        console.log(error);
    } else {
        extractLink(html);
    }
}

function extractLink(html) {
    let $ = cheerio.load(html);

    let anchorElement = $('a[data-hover="View All Results"]');

    let link = anchorElement.attr('href');

    let fullLink = 'https://www.espncricinfo.com/'+ link;
    console.log(fullLink);

    allMatchObj.getAllMatch(fullLink);
}



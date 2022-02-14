const request = require('request');
const cheerio = require('cheerio');

const scoreCardObj = require('./scorecard');

function getAllMatchLink(url) {
    request(url, function(error, response, html) {
        if(error) {
            console.log(error);
        } else {
            extractAllMatchLink(html);
        }
    })
}

function extractAllMatchLink(html) {
    let $ = cheerio.load(html);

    let scoreCardElementArray = $('a[data-hover="Scorecard"]')
    for(let i = 0; i < scoreCardElementArray.length; i++) {
        let scoreCardlink = $(scoreCardElementArray[i]).attr('href');

        let fullLink = 'https://www.espncricinfo.com/' + scoreCardlink;
        console.log(fullLink);

        scoreCardObj.ps(fullLink);
    }
}

module.exports = {
    getAllMatch : getAllMatchLink
}
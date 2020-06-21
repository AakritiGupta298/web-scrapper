let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let eachMatchHandler = require("./match"); 
request("https://www.espncricinfo.com/series/_/id/8039/season/2015/icc-cricket-world-cup",dataReceiver);
function dataReceiver(err, res, html){
    if(err == null && res.statusCode == 200){
        parseFile(html);
        //console.log(html);
    } else if (res.statuscode == 404){
        console.log("Page not found");
    } else {
        console.log(err);
        console.log(res);
    }
}

function parseFile(html){
    //let list = $("");
    //fs.writeFileSync("list.html",list);
    let $ = cheerio.load(html);
    let a = $("li.widget-items.cta-link a").attr("href");
    let fullLink = "https://www.espncricinfo.com" + a;
    //console.log(fullLink);
    request(fullLink,matchPageHandler);
}

function matchPageHandler(err, res, html){
    if(err == null && res.statusCode == 200){
        parseMatch(html);
    } else if (res.statuscode == 404){
        console.log("Page not found");
    } else {
        console.log(err);
        console.log(res);
    }
}

function parseMatch(html){
    let $ = cheerio.load(html);
    let allCards = $(".col-md-8.col-16");
    //fs.writeFileSync("allCards.html",allCards);
    for(let i=0; i<allCards.length; i++){
        let result = $(allCards[i]).find(".extra-small.mb-0.match-description.match-description-bottom").text();
        let details = $(allCards[i]).find(".small.mb-0.match-description").text();
        let allAnchors = $(allCards[i]).find(".match-cta-container a");
        let scoreCardLink = $(allAnchors[0]).attr("href");
        //console.log("##########");
        //console.log(result);
        //console.log(details);
        eachMatchHandler("https://www.espncricinfo.com" + scoreCardLink);
        //console.log("##########");
    }
}
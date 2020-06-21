let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
const { create } = require("domain");

function eachMatchHandler(url){
    request(url,dataReceiver);
}

function dataReceiver(err, res, html){
    if(err == null && res.statusCode == 200){
        parseHtml(html);
        //console.log(html);
    } else if (res.statuscode == 404){
        console.log("Page not found");
    } else {
        console.log(err);
        console.log(res);
    }
}

function parseHtml(html){
    let $ = cheerio.load(html);
    let bothInnings = $(".match-scorecard-page div .card.content-block.match-scorecard-table");
    for(let inn = 0; inn<bothInnings.length ; inn++){
        let rows = $(bothInnings[inn]).find("table.table.batsman tbody tr");
        let teamName = $(bothInnings[inn]).find("h5").text();

        teamName = teamName.split("Innings")[0].trim();
        // filter rows that don't contain batsmen cell
        for(let i=0; i<rows.length; i++){
            let colsInEveryRow = $(rows[i]).find("td");
            //has class to check if an element contains the class or not
            let isPlayer = $(colsInEveryRow[0]).hasClass("batsman-cell");
            if(isPlayer==true){
                let pName = $(colsInEveryRow[0]).text().trim();
                let runs = $(colsInEveryRow[2]).text();
                let balls = $(colsInEveryRow[3]).text();
                console.log(`${pName} of ${teamName} scored ${runs} in ${balls}.`);
                handlePlayer(pName, teamName, runs, balls);
            }
        }

        console.log("``````````````````````````````````````");
    }
    console.log("########################");
}
//export to use in another file

module.exports = eachMatchHandler;

function handlePlayer(pName, teamName, runs, balls){
    let dirPath = path.join(__dirname,teamName);
    let dirIsPresent = fs.existsSync(dirPath);
    if(dirIsPresent == false){
        fs.mkdirSync(dirPath);
    }
    let filePath = path.join(__dirname, teamName, pName+".json");
    let fileIsPresent = fs.existsSync(filePath);
    if(fileIsPresent == false){
        fs.openSync(filePath,'w');
        let entries = [];
        let newObj = {};
        newObj.Runs = runs;
        newObj.Balls = balls;
        entries.push(newObj);
        let stringObj = JSON.stringify(entries);
        fs.writeFileSync(filePath,stringObj);
    } else {
        let content = fs.readFileSync(filePath,"utf-8");
        let entries = JSON.parse(content);
        let newObj = {};
        newObj.Runs = runs;
        newObj.Balls = balls;
        entries.push(newObj);
        let stringObj = JSON.stringify(entries);
        fs.writeFileSync(filePath,stringObj);
    }
}
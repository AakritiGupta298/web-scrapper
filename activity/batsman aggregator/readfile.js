let fs = require("fs");
let cheerio = require("cheerio");

let html = fs.readFileSync("../facts/index.html","utf-8");
console.log(html);

let $ = cheerio.load(html);
// convention to use $ as name of variable
// to select h1 element from the page
let p = $("h1");

// to get text
let h1kadata = p.text();
console.log(h1kadata);

//return array of elements
let a = $("a");

//print content of all anchors
console.log(a.text());

//select element inside other element
let ulKaP = $("ul p");
console.log(ulKaP.text());

//select a class
let classEle = $(".first-para");
console.log(classEle.text());

//select all the elements with para class
let allEle = $(".para");
console.log(allEle.text());

//select a element with both classes in it
let combEle = $(".para.first-para");
console.log(combEle.text());

//select element n the basis of id
let name = $("#unique");
console.log(name.text());
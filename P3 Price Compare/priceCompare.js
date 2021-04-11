let puppeteer = require("puppeteer");
let fs = require("fs");
let links = ["https://www.amazon.in", "https://www.flipkart.com", "https://paytmmall.com/"];
let pName = process.argv[2];

console.log("Before");
(async function () {
    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        
        let amazon = await getListingFromAmazon(links[0], browserInstance,pName);
        let flipkart = await getListingFromFlipkart(links[1], browserInstance,pName);
        let paytm = await getListingFromPaytm(links[2], browserInstance,pName);
        console.table(amazon);
        console.table(flipkart);
        console.table(paytm);
    } catch (err) {
        console.log(err);
    }
})();

//  product Name,url of amazon home page
// output-> top 5 matching product -> price Name print 
async function getListingFromAmazon(link, browserInstance, pName) {
    
    let newTab = await browserInstance.newPage();
    await newTab.goto(link,{waitUntil : "networkidle2"});
    
    await clickAndWait("input[aria-label='Search']",newTab);
    await newTab.type("input[aria-label='Search']",pName);
    await newTab.click("#nav-search-submit-button");
    await newTab.waitForNavigation();
    await newTab.waitForSelector(".a-link-normal.a-text-normal");
    return await newTab.evaluate(getArr);
    function getArr(){

        let products = document.querySelectorAll(".a-link-normal.a-text-normal");
        let arr = [];
        for(i=0; i<20; i++){
            let name = products[i].innerText;
            let price = products[++i].innerText;
            price = price.split("\n");
            price = price[0];
            
            arr.push({
                "Name": name,
                "Price": price
            })
        }
        return arr;
    }
    

    
}

async function getListingFromFlipkart(link, browserInstance, pName) {
    
    let newTab = await browserInstance.newPage();
    await newTab.goto(link,{waitUntil : "networkidle2"});
    
    await clickAndWait("input[title='Search for products, brands and more']",newTab);
    await newTab.type("input[title='Search for products, brands and more']",pName);
    await newTab.click("button[type='submit']");
    await newTab.waitForNavigation();
    await newTab.waitForSelector(".col.col-7-12");
    return await newTab.evaluate(getArr);
    function getArr(){

        let products = document.querySelectorAll(".a-link-normal.a-text-normal");
        let arr = [];
        for(i=0; i<20; i++){
            let name = products[i].innerText;
            let price = products[++i].innerText;
            price = price.split("\n");
            price = price[0];
            
            arr.push({
                "Name": name,
                "Price": price
            })
        }
        return arr;
    }
    

    
}
async function clickAndWait(selector,newTab){
    
    return new Promise(function (resolve, reject){

        let waitPromise = newTab.waitForSelector(selector,{visible : true});
        waitPromise.then(function(){

        let clickPromise = newTab.click(selector);
        return clickPromise;

    }).then(function (){

        resolve();

    }).catch(function(){
        reject();
    })
})
}
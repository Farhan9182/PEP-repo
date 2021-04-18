let puppeteer = require("puppeteer");
var Tesseract = require('tesseract.js');
let external = require("./pass.js");
let passenger = require("./passengerList.js");
// let fs = require("fs");

// no of videos 
// views 
// watch time -> get 
// list of videos -> [name, duration]
// initial page data get 
// handle -> loader

(async function(){
    try {
        let nop = (Object.keys(passenger).length) - 1;
        let objLength = Object.keys(passenger).length;
        console.log(passenger[1].Name);
        console.log(passenger[2].Name);
        
        let mob = 9334814816;
        let userClass = 4;
        let userCategory = 0;
        let userdate = "22/04/2021";
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        let newPage = await browserInstance.newPage();
        await newPage.goto("https://www.irctc.co.in/nget/train-search", {waitUntil: 'load', timeout: 0});
        // evaluate
        await newPage.click("button[type='submit']");
        await newPage.waitForSelector("a[aria-label='Click here to Login in application']");
        await newPage.waitForTimeout(2000);
        await newPage.click("a[aria-label='Click here to Login in application']");
        await newPage.waitForSelector("input[id='userId']");
        await newPage.type("input[id='userId']",external.userId);
        await newPage.type('input[id="pwd"]',external.password);
        // solve captcha until solved
        do{
            await newPage.waitForSelector("img[border='0']");
            let url = await newPage.evaluate(()=>{
                let image = document.querySelectorAll("img[border='0']");
                var add = image[1].src;
                return add;
            })
                //Captcha solving function

            let value = await Tesseract.recognize(url,'eng',
                { 
                    logger: m => console.log(m) 
                }
                )
            let ans = value.data.text.split(":")[1];
            ans = ans.trim();    
            
            await newPage.type("input[id='nlpAnswer']",ans,{delay: 200});
            await newPage.click("span button[type='submit']");
            await newPage.waitForTimeout(5000);

            let exists = await newPage.$('div[class="ng-tns-c45-13 ui-dialog-content ui-widget-content"]');
            if(exists === null){
                break;
            }
        }while (true);
        

        //Login Done

        //Fill station details
        await newPage.waitForTimeout(5000);
        await newPage.type('input[aria-controls="pr_id_1_list"]',"PNBE\n",{delay:200});
        await newPage.type('input[aria-controls="pr_id_2_list"]',"HWH\n",{delay:200});
        await newPage.click('span[class="ng-tns-c66-11 ui-dropdown-label ui-inputtext ui-corner-all ng-star-inserted"]');
        await newPage.waitForTimeout(3000);
        await newPage.waitForSelector("li[role='option']");
        await newPage.evaluate((userClass)=>{
            let elem1 = document.querySelectorAll("li[role='option']");
            elem1[userClass].click();
        },userClass)

        await newPage.click('span[class="ng-tns-c66-12 ui-dropdown-label ui-inputtext ui-corner-all ng-star-inserted"]');
        await newPage.waitForTimeout(1000);
        await newPage.waitForSelector("li[role='option']");
        await newPage.evaluate((userCategory)=>{
            let elem2 = document.querySelectorAll("li[role='option']");
            elem2[userCategory].click();
        },userCategory)
        await newPage.click('input[class="ng-tns-c59-10 ui-inputtext ui-widget ui-state-default ui-corner-all ng-star-inserted"]');
        await newPage.keyboard.down("Control");
        await newPage.keyboard.press("A");
        await newPage.keyboard.up("Control");
        await newPage.type('input[class="ng-tns-c59-10 ui-inputtext ui-widget ui-state-default ui-corner-all ng-star-inserted"]',userdate,{delay:200});
        await newPage.click("button[type='submit']");
        await newPage.waitForNavigation({waitUntil: 'load', timeout: 0});

        await newPage.click('button[class="btnDefault ng-star-inserted"]');
        await newPage.waitForSelector('div[class="col-sm-5 col-xs-11 train-heading"]');
        let times = await newPage.evaluate(()=>{
            let elem = document.querySelectorAll('div[class="col-sm-5 col-xs-11 train-heading"]');
            return elem.length;
        })
        while(times > 0){
            await newPage.evaluate(()=>{
                let elem = document.querySelectorAll('div[class="col-xs-12 link"]');
                if(elem.length > 0){
                    elem[0].click();
                }
            })
            await newPage.waitForTimeout(2000);
            times--;
        }
        await newPage.waitForNavigation({waitUntil: 'load', timeout: 0});
        console.log("Reached Here");
        await newPage.waitForSelector('input[placeholder="Passenger Name"]');
        console.log(nop);
        console.log(objLength);
        while(nop > 0){
            await newPage.evaluate(()=>{
                let elem = document.querySelector('span[class="prenext"]');
                elem.click();
            })
            nop--;
        }
        await newPage.waitForSelector('input[placeholder="Passenger Name"]');
        for(let i =0; i< objLength; i++){
            await newPage.evaluate((passenger,i)=>{
                let elem = document.querySelectorAll('input[placeholder="Passenger Name"]');
                elem[i].setAttribute("value",passenger[i + 1].Name);
            },passenger,i)
        }
        
        for(let i =0; i< objLength; i++){
            await newPage.evaluate((passenger,i)=>{
                let elem = document.querySelectorAll('input[placeholder="Age"]');
                elem[i].setAttribute("value",passenger[i + 1].Age);
            },passenger,i)
        }

        for(let i =0; i< objLength; i++){
            await newPage.evaluate((passenger,i)=>{
                let elem = document.querySelectorAll('select[formcontrolname="passengerGender"]');
                elem[i].setAttribute("value",passenger[i + 1].Gender);
            },passenger,i)
        }

        // const name = await newPage.$$('input[placeholder="Passenger Name"]');
        // const age = await newPage.$$('input[placeholder="Age"]');
        // const gender = await newPage.$$('select[formcontrolname="passengerGender"]');
        // for(let i =0; i< objLength; i++){
        //     // console.log(passenger[1].Name);
        //     await newPage.evaluate((name,age,gender,i)=>{
        //         name[i].setAttribute("value",passenger[i + 1].Name);
        //         age[i].setAttribute("value",passenger[i + 1].Age);
        //         gender[i].setAttribute("value",passenger[i + 1].Gender);

        //     },name,age,gender,i)

        //     //     name[i],passenger[i + 1].Name);
        //     // await newPage.type(age[i],passenger[i + 1].Age);
        //     // await newPage.type(gender[i],passenger[i + 1].Gender+"\n");
        // }

        await newPage.type('input[id="mobileNumber"]',mob);
        await newPage.type('input[id="aaa1"]',"Hello world");

        await newPage.type('input[id="aaa4"]',"800007\n");
        await newPage.waitForTimeout(2000);
        await newPage.type('#address-postOffice',"Gulzarbagh\n");

        let btn = await newPage.$$('div[class="ui-radiobutton-box ui-widget ui-state-default"]');
        await btn[1].click();
        await btn[2].click();
        // input[placeholder="Passenger Name"]
        // input[placeholder="Age"]
        // select[formcontrolname="passengerGender"]
        // 
        await newPage.click("button[type='submit']");

        // for time: 'span[class="time"]'
        // for train number: div[class="col-sm-5 col-xs-11 train-heading"]



       /* 
        while(times > 0){

            titleArr = await newPage.evaluate(videoTitleArray);
            
            times--;
            if(times > -1 && times < 1){
                
            }
            await newPage.waitForTimeout(5000);
        }
        
        console.table(titleArr);
        */
       

    } catch (err) {
        console.log(err);
    }

})();


/*
function videoTitleArray(){
    let elem = document.querySelector('ytd-continuation-item-renderer[class="style-scope ytd-playlist-video-list-renderer"]');
            let title = [];
            let duration = [];
            if(elem != null)
            { 
                title = document.querySelectorAll("a[id='video-title']");
                title[title.length - 1].scrollIntoView();
                console.log(title.length);
            }     
            else{
                title = document.querySelectorAll("a[id='video-title']");
                duration = document.querySelectorAll('span.style-scope.ytd-thumbnail-overlay-time-status-renderer');
                console.log(duration.length);
                let values = [];
                for(let i=0; i<title.length; i++){
                    let time = duration[i].innerText.trim("\n");
                    values.push({
                        "Title": title[i].innerText,
                        "Duration": time
                    } );
                }
                return values;
            }
            
}
*/
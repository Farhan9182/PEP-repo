let puppeteer = require("puppeteer");
var Tesseract = require('tesseract.js');

// let fs = require("fs");

// no of videos 
// views 
// watch time -> get 
// list of videos -> [name, duration]
// initial page data get 
// handle -> loader

(async function(){
    try {
        let userClass = 4;
        let userCategory = 4;
        let userdate = "22/04/2021";
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        let newPage = await browserInstance.newPage();
        await newPage.goto("https://www.irctc.co.in/nget/train-search");
        // evaluate
        await newPage.click("button[type='submit']");
        await newPage.waitForSelector("a[aria-label='Click here to Login in application']");
        await newPage.waitForTimeout(2000);
        await newPage.click("a[aria-label='Click here to Login in application']");
        await newPage.waitForSelector("input[id='userId']");
        await newPage.type("input[id='userId']","Farhan9182");
        await newPage.type('input[id="pwd"]',"");
        await newPage.waitForSelector("img[border='0']");
        let url = await newPage.evaluate(()=>{
            let image = document.querySelectorAll("img[border='0']");
            var add = image[1].src;
            return add;
        })
        console.log(url);

        //Captcha solving function

        let value = await Tesseract.recognize(url,'eng',
            { 
                logger: m => console.log(m) 
            }
            )
        let ans = value.data.text.split(":")[1];
        ans = ans.trim();    
        console.log(ans);
        // await newPage.evaluate(()=>{
        //     let elem = document.querySelector("input[id='nlpAnswer']");
        //     elem.setAttribute("value","");
        // });
        
        await newPage.type("input[id='nlpAnswer']",ans,{delay: 200});
        await newPage.click("span button[type='submit']");

        //Login Done

        //Fill station details
        await newPage.waitForTimeout(3000);
        await newPage.type('input[aria-controls="pr_id_1_list"]',"PNBE\n",{delay:1000});
        await newPage.type('input[aria-controls="pr_id_2_list"]',"HWH\n",{delay:1000});
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
        await newPage.waitForTimeout(3000);


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
let puppeteer = require("puppeteer");
var Tesseract = require('tesseract.js');
let external = require("./pass.js");
let passenger = require("./passengerList.js");
let source = process.argv[2];
let destination = process.argv[3];
let userClass = process.argv[4];
let userCategory = process.argv[5];
let userdate = process.argv[6];
(async function(){
    try {
        let nop = (Object.keys(passenger).length) - 1;
        let objLength = Object.keys(passenger).length;
        
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
            await newPage.waitForTimeout(7000);

            let exists = await newPage.$('div[class="ng-tns-c45-13 ui-dialog-content ui-widget-content"]');
            if(exists === null){
                break;
            }
        }while (true);
        

        //Login Done

        //Fill station details
        
        await newPage.type('input[aria-controls="pr_id_1_list"]',source+"\n",{delay:200});
        await newPage.type('input[aria-controls="pr_id_2_list"]',destination+"\n",{delay:200});
        await newPage.click('span[class="ng-tns-c66-11 ui-dropdown-label ui-inputtext ui-corner-all ng-star-inserted"]');
        await newPage.waitForTimeout(1000);
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
        
        
        await newPage.waitForSelector('input[placeholder="Passenger Name"]',{waitUntil: 'load', timeout: 0});
        
        while(nop > 0){
            await newPage.evaluate(()=>{
                let elem = document.querySelector('span[class="prenext"]');
                elem.click();
            })
            nop--;
        }
        await newPage.waitForSelector('input[placeholder="Passenger Name"]');
        
        let name = await newPage.$$('input[placeholder="Passenger Name"]');
            
        for(let i=0; i<name.length; i++){
            await newPage.evaluate((dname,di)=>{
                dname.setAttribute("name-index",di);
            },name[i],i)
        }

        let age = await newPage.$$('input[placeholder="Age"]');
            
        for(let i=0; i<age.length; i++){
            await newPage.evaluate((dname,di)=>{
                dname.setAttribute("age-index",di);
            },age[i],i)
        }
        
        let gender = await newPage.$$('select[formcontrolname="passengerGender"]');
            
        for(let i=0; i<gender.length; i++){
            await newPage.evaluate((dname,di)=>{
                dname.setAttribute("gender-index",di);
            },gender[i],i)
        }

        for(let i =0; i< objLength; i++){
            // input[name-index="0"]
            await newPage.type("input[name-index='"+i+"']",passenger[i + 1].Name,{delay:100});
            await newPage.type("input[age-index='"+i+"']",passenger[i + 1].Age);
            await newPage.type("select[gender-index='"+i+"']",passenger[i + 1].Gender+"/n");
        }

        await newPage.type('input[id="mobileNumber"]',external.mob,{delay:200});
        await newPage.type('input[id="aaa1"]',"Hello world");

        await newPage.type('input[id="aaa4"]',"800007\n");
        await newPage.waitForTimeout(2000);
        await newPage.type('#address-postOffice',"Gulzarbagh\n");

        let btn = await newPage.$$('div[class="ui-radiobutton-box ui-widget ui-state-default"]');
        await btn[1].click();
        await btn[2].click();
        
        await newPage.click("button[type='submit']");

        do{
            await newPage.waitForSelector("img[border='0']",{waitUntil: 'load', timeout: 0});
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
            await newPage.click("button[type='submit']");
            await newPage.waitForTimeout(7000);

            let exists = await newPage.$('#nlpCaptchaOuterContainer');
            if(exists === null){
                break;
            }
        }while (true);
        // for time: 'span[class="time"]'
        // for train number: div[class="col-sm-5 col-xs-11 train-heading"
       await newPage.waitForSelector('div[class="bank-type col-xs-12 ng-star-inserted"]',{waitUntil: 'load', timeout: 0});
       await newPage.click('div[class="bank-type col-xs-12 ng-star-inserted"]');
       await newPage.waitForSelector('div[class="col-pad col-xs-12 bank-text"]',{waitUntil: 'load', timeout: 0});
       await newPage.click('div[class="col-pad col-xs-12 bank-text"]');
       await newPage.click('button[class="btn btn-primary hidden-xs ng-star-inserted"]');

       await newPage.waitForSelector('input[value="upi"]',{waitUntil: 'load', timeout: 0});
       await newPage.click('input[value="upi"]');

       await newPage.waitForSelector('input[id="upi"]',{waitUntil: 'load', timeout: 0});
       await newPage.type('input[id="upi"]',external.upi,{delay:200});

       await newPage.click('button[class="btn btn-primary w100 pos-r   "]');

    } catch (err) {
        console.log(err);
    }

})();
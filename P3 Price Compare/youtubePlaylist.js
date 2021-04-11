let puppeteer = require("puppeteer");
let fs = require("fs");

// no of videos 
// views 
// watch time -> get 
// list of videos -> [name, duration]
// initial page data get 
// handle -> loader

console.log("Before");

(async function () {
    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        let newPage = await browserInstance.newPage();
        await newPage.goto("https://www.youtube.com/playlist?list=PLQK2XiUY9C2gXua-_3AB_nI49hpPVq01y");
        // evaluate
        let arr = await newPage.evaluate(() => {
            let arr=document.querySelectorAll("#stats  .style-scope.ytd-playlist-sidebar-primary-info-renderer");
            let newarr=[];
            newarr.push(arr[0].innerText,arr[1].innerText);
            return newarr;
        })
        console.table(arr);
        let totalVideos = arr[0].split(" ")[0];
        console.log(totalVideos);
        let times= await newPage.evaluate(()=>{
           let title = document.querySelectorAll("a[id='video-title']");
           return title.length;
        })
        console.log(times);
        times = (totalVideos / times);
        console.log(times);
        let titleArr = [];
        while(times > 0){

            titleArr = await newPage.evaluate(videoTitleArray);
            
            times--;
            if(times > -1 && times < 1){
                
            }
            await newPage.waitForTimeout(5000);
        }
        
        console.table(titleArr);
        
       

    } catch (err) {
        console.log(err);
    }

})();

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
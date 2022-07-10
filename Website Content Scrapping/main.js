require('dotenv').config();


//import required modules
const path = require('path');
const fs = require('fs');
const puppetter = require('puppeteer');

let browser, page;



//function to go to the webpage

const goToPage = async () => {
    try{
        await page.goto(process.env.URL);
        console.log('Page loaded');

        const pageContent = await page.content();
        console.log('Page content loaded');

        fs.writeFileSync(path.join(__dirname, "config", "content.html"), pageContent);
        console.log('Page content saved');


    }catch(err){
        console.log(err);
        if(browser) {
            await browser.close();
        }
    }
}




//initialize the browser
const init = async () => {
    try {
        browser = await puppetter.launch({
            headless: false,
        })

        page = await browser.newPage();

    } catch (err) {
        console.log(err);
        if(browser) {
            await browser.close();
        }
    }
}




//Immediate Runnig Function (IIFE)

(async () => {

    //initialize the browser
    await init();

    //go to the webpage
    await goToPage();

})();
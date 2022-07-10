

//imported the required modules
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const dotenv = require("dotenv").config({ path: "./config/.env" });

let page, browser;

const baseUrl = 'https://www.instagram.com/';


//Get the cookies
const setCookies = async(currentCookies) =>{
    fs.writeFileSync(path.join(__dirname,"config", "cookies.json"), JSON.stringify(currentCookies));
}


//Logged in
const LoggedIn = async() =>{
    try {
        const [button] = await page.$x('//button[contains(.,"Log In")]');
        await page.waitForSelector("input");

        await page.type('input[name="username"]', process.env.INSTA_USERNAME);
        await page.type('input[name="password"]', process.env.INSTA_PASS);
        await button.click();

        await page.waitForNavigation();

        const currentCookies = await page.cookies();
        setCookies(currentCookies)

    }catch(err){
        console.log(err);
        if(browser){
            await browser.close();
        }
    }
}


//Load the cookies
const loadCookies = async() =>{
    try{
        const cookies = fs.readFileSync(path.join(__dirname, "config", "cookies.json"));
        const parsedCookies = await JSON.parse(cookies);
        if(parsedCookies.length > 0){
            await page.setCookie(...parsedCookies);
            await page.reload({
                waitUntil: ["networkidle0", "domcontentloaded"],
              });
        }else {
            await LoggedIn();
        }
    
    }catch(err){
        console.log(err);
        if(browser){
            await browser.close();
        }
    }
}




//Intialize the browser
exports.init = async () =>{
    try{
        browser = await puppeteer.launch({
            headless: 'chrome',
        })

        page = await browser.newPage();



    } catch(err) {
        console.log(err);

        if(browser){
            await browser.close();
        }
    }
}


//Login to the instagram account

exports.login = async() =>{
    try{
        await page.goto(baseUrl, { waitUntil: "networkidle2" });

        await loadCookies();

        await page.screenshot({path: 'screenshot.png'});
        await page.pdf({path: 'screenshot.pdf', format: 'A4'});
    }catch(err){
        console.log(err);
        if(browser){
            await browser.close();
        }
    }finally{
        setTimeout(()=>{
            if(browser){
                browser.close();
            }
        }, 12000)
    }
}

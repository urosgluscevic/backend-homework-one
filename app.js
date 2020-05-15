const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

(async () => {  //iife, async function ("await" needed everywhere)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://www.realitica.com/apartmani/Crna-Gora/");  //navigates to the page
    await page.click("input[value='']"); //deselects "sve" option
    await page.click("input[value='Apartment']") // selects "Apartments"
    await page.click("button[type='submit']") // submits the form
    await page.screenshot({path: "example.png"}); // takes a screenshot, for testing

    console.log("done");

    await browser.close() //closes the browser (it can't be accessed anymore)
})()
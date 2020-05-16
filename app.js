const puppeteer = require("puppeteer");

(async () => {  //iife, async function ("await" needed everywhere)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://www.realitica.com/apartmani/Crna-Gora/", {waitUntil: "networkidle2"});  //navigates to the page
    await page.click("input[value='']"); //deselects "sve" option
    await page.click("input[value='Apartment']") // selects "Apartments"

    await Promise.all([
        page.waitForNavigation(), //waits for the url to change
        page.click("button[type='submit']") // submits the form
    ])

    // await page.screenshot({path: "example.png"}); // takes a screenshot, for testing

    await Promise.all([
        page.waitForNavigation(), //waits for the url to change
        page.click("#left_column_holder > div:nth-child(11) > div:nth-child(3) > a:nth-child(9)") // submits the form
    ])

    await page.screenshot({path: "example.png"}); // takes a screenshot, for testing

    console.log(page.url()) //the url, might use it to scrape the page with cheerio because it is easier

    console.log("done");

    await browser.close() //closes the browser (it can't be accessed anymore)
})()
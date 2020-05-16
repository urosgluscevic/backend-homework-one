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
        page.click("#left_column_holder > div:nth-child(11) > div:nth-child(3) > a:nth-child(9)") // gets the data for an article
    ])

    const result = await page.evaluate(()=>{
        const data = document.querySelector("#listing_body").innerText; // we can parse this string using data.split(":")
        return data
    })

    // console.log(result)

    const split = result.split(":"); //beginns the parsing proccess

    const parsed = [];
    split.forEach((elem)=>{
        parsed.push(elem.slice(0, elem.indexOf("\n"))) //parses the result
    })

    console.log(parsed)

    await browser.close() //closes the browser (it can't be accessed anymore)
})()
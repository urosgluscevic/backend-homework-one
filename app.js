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

    // await page.screenshot({path: "example.png"}); // takes a screenshot, for testing

    const result = await page.evaluate(()=>{
        // const data = document.querySelectorAll("strong"); //this manages to get only the titles, not their respective values (the values are not placed inside separate elements, rather just inside the main div, so we cannot pull them out individually, see the below approach)
        // const dataArray = Array.from(data).map((elem)=> $(elem).text());
        // return dataArray

        const data = document.querySelector("#listing_body").innerText; // we can parse this string using data.split(":")
        return data
    })

    console.log(result)

    console.log("done");

    await browser.close() //closes the browser (it can't be accessed anymore)
})()
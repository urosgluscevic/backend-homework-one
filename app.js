const puppeteer = require("puppeteer");

(async () => {  //iife, async function ("await" needed everywhere)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://www.realitica.com/apartmani/Crna-Gora/");  //navigates to the page
    await page.click("input[value='']"); //deselects "sve" option
    await page.click("input[value='Apartment']") // selects "Apartments"

    await Promise.all([
        page.waitForNavigation(), //waits for the url to change
        await page.click("button[type='submit']") // submits the form
    ])

    await page.screenshot({path: "example.png"}); // takes a screenshot, for testing

    const result = await page.evaluate(() => { //page.evaluate() lets you run functions in the context of the browser (therefore allows you to do query selectors and interact with DOM a bit)
        let div = document.querySelector("#left_column_holder > div:nth-child(11) > div:nth-child(3)").innerText; //this is just the selector for the first article. we will probably have to use a loop to get all the elements because none of the elements have any classes or ids
        return div
    })

    console.log(result)

    console.log("done");

    await browser.close() //closes the browser (it can't be accessed anymore)
})()
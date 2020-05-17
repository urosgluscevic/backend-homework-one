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

    const strongValues = await page.evaluate(()=>{
        const data = document.querySelectorAll("strong"); //just the values (will be used to check if, for example, "zemljiste" exists)
        return Array.from(data).map((elem)=>{
            return elem.innerText;
        })
    })

    // console.log(strongValues)

    const split = result.split(":"); //beginns the parsing proccess

    const parsed = [];
    split.forEach((elem)=>{
        parsed.push(elem.slice(0, elem.indexOf("\n"))) //parses the result
    })

    // console.log(parsed)

    const neededValues = ["Vrsta", "Područje", "Lokacija", "Kupatila", "Cijena", "Stambena Površina", "Zemljište", "Parking Mjesta", "Od Mora"]; //list of the values we are searching for
    let stringToAppend = ""; //first we write the values here, then we append it to the csv file

    //DESCRIPTION OF THE FOLLOWING FUNCTION:
    //It's purpose is to parse the data from the site and store it in a string, in the exact order that Stevan asked
    //I used a forEach loop to check if the "oglas" contans the values we are looking for
    //if that is the case, I get the index of that element, but in the "strongValues" array
    //Now that I know that the element exists exists in the strongValues, it must also exist in the "parsed" array, but at an index that is one larger that the one in strongValues, because "parsed" also contains the title
    //NOTE: I have not implemented the search for "opis", "klima", "novogradnja", "telefon", "oglasio". These will be done manually

    neededValues.forEach((elem)=>{
        if(strongValues.includes(elem)){
            let index = strongValues.findIndex(
                item => item.indexOf(elem) > -1
            );
            
            stringToAppend += parsed[index + 1] + ","
        } else {
            stringToAppend += "nepoznato,"
        }
    })

    console.log(stringToAppend)

    await browser.close() //closes the browser (it can't be accessed anymore)
})()
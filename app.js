const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {  //iife, async function ("await" needed everywhere)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://www.realitica.com/apartmani/Crna-Gora/");  //navigates to the page
    await page.click("input[value='']"); //deselects "sve" option
    await page.click("input[value='Apartment']") // selects "Apartments"

    await Promise.all([
        page.waitForNavigation(), //waits for the url to change
        page.click("button[type='submit']") // submits the form
    ])

    const links = await page.evaluate(()=> {
        const data = document.querySelectorAll("#left_column_holder > div > div:nth-child(3) > a:nth-child(9)")
        return Array.from(data)
    })

    const oglasi = await page.evaluate(()=>{
        return document.querySelector("#left_column_holder > div:nth-child(1) > span > strong:nth-child(2)")
    })

    let numberOfLinks = Array.from(links).length;

    let addedCount = 0;

    // await page.screenshot({path: "example.png"}); // takes a screenshot, for testing

    for(let i = 0; i < numberOfLinks + 1; i++){

        if(11 + i === 21){
            i++;
        }

        await Promise.all([
            page.waitForNavigation(), //waits for the url to change
            page.click(`#left_column_holder > div:nth-child(${11 + i}) > div:nth-child(3) > a`) // gets the data for an article
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

        const split = result.split(":"); //beginns the parsing proccess

        const parsed = [];
        split.forEach((elem)=>{
            parsed.push(elem.slice(0, elem.indexOf("\n"))) //parses the result
        })

        let klimaBool = false;
        let novoBool = false;

        let klimaSearch = strongValues.findIndex(
            item => item.indexOf("Klima") > -1
        )

        if(klimaSearch > -1){
            strongValues.splice(klimaSearch, 1);
            klimaBool = true;
        }

        let novogradnjaSearch = strongValues.findIndex(
            item => item.indexOf("Novogradnja") > -1
        )

        if(novogradnjaSearch > -1){
            strongValues.splice(novogradnjaSearch, 1);
            novoBool = true;
        }

        let detaljiLinkSearch = strongValues.findIndex(
            item => item.indexOf("Više detalja na") > -1
        )

        // console.log(parsed)

        if(detaljiLinkSearch > -1){
            strongValues.splice(detaljiLinkSearch, 1);
            parsed.splice(detaljiLinkSearch + 1, 2)
        }

        if((parsed.length - strongValues.length) > 1){
            const opisIndex = strongValues.findIndex(
                item => item.indexOf("Opis") > -1
            )

            const differenceInLengths = parsed.length - strongValues.length;
            parsed.splice(opisIndex + 2, differenceInLengths - 1);
        }

        const neededValues = ["Vrsta", "Područje", "Lokacija", "Kupatila", "Cijena", "Stambena Površina", "Zemljište", "Parking Mjesta", "Od Mora", "Novogradnja", "Klima Uređaj", "Naslov", "Opis", "Oglasio", "Mobitel", "Oglas Broj", "Zadnja Promjena", "url"]; //list of the values we are searching for
        let stringToAppend = ""; //first we write the values here, then we append it to the csv file

        //DESCRIPTION OF THE FOLLOWING FUNCTION:
        //It's purpose is to parse the data from the site and store it in a string, in the exact order that Stevan asked
        //I used a forEach loop to check if the "oglas" contans the values we are looking for
        //if that is the case, I get the index of that element, but in the "strongValues" array
        //Now that I know that the element exists exists in the strongValues, it must also exist in the "parsed" array, but at an index that is one larger that the one in strongValues, because "parsed" also contains the title

        let offset = 1; // because of the title, the indexes in the "parsed" array and "strongValues" array are shifted by 1

        neededValues.forEach((elem)=>{
            if(elem === "Klima Uređaj"){
                if(klimaBool){
                    stringToAppend += true + ",";
                } else {
                    stringToAppend += false + ",";
                }
            } else if(elem === "Novogradnja"){
                if(novoBool){
                    stringToAppend += true + ",";
                } else {
                    stringToAppend += false + ",";
                }
            }else if (elem === "Naslov"){
                stringToAppend += parsed[0] + ",";
            } else if(strongValues.includes(elem)){
                let index = strongValues.findIndex(
                    item => item.indexOf(elem) > -1
                );
                
                stringToAppend += parsed[index + offset] + ","
            } else if(elem === "url"){
                stringToAppend += page.url();
            } else {
                stringToAppend += "nepoznato,"
            }
        })

        fs.appendFile("accomodations.csv", stringToAppend + "\n", function(error){
            if(error){
                console.log("not successfull");
            }
        })

        addedCount++;

        // console.log(stringToAppend)
        await page.goBack();

        if(i === 21){
            if(parseInt(oglasi) - addedCount < 20){
                const oglasiLeft = await page.evaluate(() => {
                    return document.querySelector("#left_column_holder > div:nth-child(1) > span > strong:nth-child(2)"); 
                })

                numberOfLinks = oglasiLeft.length
            }

            i = 0;
            await Promise.all([
                page.waitForNavigation(), //waits for the url to change
                page.click(`#left_column_holder > table > tbody > tr > td > table > tbody > tr > td:nth-child(7)`) //goes to the next page
            ])
        }
    }

    await browser.close() //closes the browser (it can't be accessed anymore)
})()
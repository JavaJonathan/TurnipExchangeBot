const puppeteer = require('puppeteer')
const fetch = require('node-fetch');
const readline = require('readline')

getIslands()

async function getIslands()
{
    try
    {
        fetch('https://api.turnip.exchange/islands/', 
        {
            method: 'POST'
        })
        .then(res => res.json())
        .then(data =>  
        {
            grabBestIslands(data.islands)
        })
    } catch(err) { console.log(err) }
}

function grabBestIslands(islands)
{
    var bestIslands = []

    islands.forEach(island => {
        if(island.turnipPrice >= 400 && island.category === "turnips" && island.patreonOnly === 0)
        {
            if(island.queued.startsWith("0")) bestIslands.push(island)
        }
    });

    grabBestTurnipPrice(bestIslands)
}

async function grabBestTurnipPrice(bestIslands)
{
    var bestIsland = bestIslands[0]
    bestIslands.forEach(island => 
    {
        if(island.turnipPrice > bestIsland.turnipPrice) bestIsland = island
    }) 

    joinLobby(bestIsland)
}


async function joinLobby(bestIsland)
{
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()

    await page.goto(`https://turnip.exchange/island/${bestIsland.turnipCode.toString()}`, { waitUntil: 'networkidle2'})
    await page.waitFor(1000)
    await page.click('div[class="bg-info text-info-foreground flex flex-col justify-center items-start p-2 rounded my-4 w-11/12"]')
    await page.waitFor(1000)
    await page.click('button[class="bg-primary hover:bg-primary-600 text-background p-2 rounded-lg "]')
    await page.waitFor(3000)
    await page.type('input[class="border-b-2 border-secondary-200 focus:border-secondary-300 outline-none flex-1"]', 'rachel', {delay:25})
    await page.waitFor(1000)
    const joinButton = await page.$$('[class="bg-primary hover:bg-primary-600 text-background p-2 rounded-lg"]')
    await joinButton[1].click()
}
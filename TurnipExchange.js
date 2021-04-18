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
        if(island.turnipPrice >= 100 && island.category === "turnips" && island.patreonOnly === 0)
        {
            if(parseInt(island.queued.charAt(0)) < 5) bestIslands.push(island)
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
    const browser = await puppeteer.launch({headless: false, defaultViewport: null, args:['--start-maximized']})
    const page = await browser.newPage()

    await page.goto(`https://turnip.exchange/island/${bestIsland.turnipCode.toString()}`, { waitUntil: 'networkidle2'})
    await page.waitFor(1000)
    await page.click('div[class="flex flex-col items-start justify-center w-11/12 p-2 my-4 rounded bg-info text-info-foreground"]')
    await page.waitFor(1000)
    await page.click('button[class="p-2 rounded-lg bg-primary hover:bg-primary-600 text-background "]')
    await page.waitFor(3000)
    await page.type('input[class="flex-1 border-b-2 outline-none border-secondary-200 focus:border-secondary-300"]', 'rachel', {delay:50})
    await page.waitFor(2000)
    const joinButton = await page.$$('[class="p-2 rounded-lg bg-primary hover:bg-primary-600 text-background"]')
    await page.waitFor(2000)
    await joinButton[1].click()
}
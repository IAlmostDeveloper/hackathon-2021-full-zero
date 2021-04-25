const puppeteer = require("puppeteer");
// we're using async/await - so we need an async function, that we can run
const run = async(path, url) => {
    // open the browser and prepare a page
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // set the size of the viewport, so our screenshot will have the desired size
    await page.setViewport({
        width: 1920,
        height: 1080
    })

    await page.goto(url)
    await page.screenshot({
        path: path,
        fullPage: true
    })

    // close the browser 
    await browser.close();
};

function getDateString() {
    var d = new Date()
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    let ho = new Intl.DateTimeFormat('en', { hour: 'numeric' }).format(d);
    let mi = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
    let se = new Intl.DateTimeFormat('en', { second: '2-digit' }).format(d);

    return `${da}-${mo}-${ye}-${ho}-${mi}-${se}`
}


async function main(url, interval, screenshotsCount) {
    if (!screenshotsCount) screenshotsCount = 5
    if (!interval) interval = 5 * 1000
    if (!url) {
        console.log("Пожалуйста, укажите url сайта, который хотите мониторить")
        return
    }

    var previousScreenshotName = 'screenshots/' + getDateString() + '.png'
    await run(previousScreenshotName, url);
    for (let i = 0; i < screenshotsCount - 1; i++) {
        setTimeout(async() => {
            var diffScreenshotName = "screenshots/diff" + getDateString() + ".png"
                // var defaultName = 'screenshots/default.png'
                // await run(defaultName, url);
            var currentScreenshotName = 'screenshots/' + getDateString() + '.png'
            await run(currentScreenshotName, url);

            const { imgDiff } = require("img-diff-js");

            await imgDiff({
                actualFilename: previousScreenshotName,
                expectedFilename: currentScreenshotName,
                diffFilename: diffScreenshotName,
            }).then(result => {
                console.log(result);
                if (result.diffCount == 0) {
                    console.log("no changes!");
                    // delete diff and second screen
                    const fs = require('fs')
                    fs.unlink(currentScreenshotName, (error) => console.log(error))
                    fs.unlink(diffScreenshotName, (error) => console.log(error))
                } else
                    previousScreenshotName = currentScreenshotName
            });
        }, interval * i * 1000);
    }
}

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv

console.log(argv.url)
console.log(argv.interval)
console.log(argv.screenshotsCount)

main(argv.url, argv.interval, argv.screenshotsCount)
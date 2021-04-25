const fs = require('fs')
const puppeteer = require("puppeteer");
const { imgDiff } = require("img-diff-js");

const takeScreenshot = async(path, url) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.setViewport({
        width: 1920,
        height: 1080
    })

    await page.goto(url)
    await page.screenshot({
        path: path,
        fullPage: true
    })
    await browser.close();
};

function getDateString() {
    let d = new Date()
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(d);
    let ho = new Intl.DateTimeFormat('en', { hour: 'numeric' }).format(d);
    let mi = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
    let se = new Intl.DateTimeFormat('en', { second: '2-digit' }).format(d);

    return `${da}-${mo}-${ye}-${ho}-${mi}-${se}`
}

function delay(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

async function processLoop(url, interval, screenshotsCount, output) {
    if (!screenshotsCount) screenshotsCount = 5
    if (!interval) interval = 5 * 1000
    if (!url) {
        console.log("Пожалуйста, укажите url сайта, который хотите мониторить")
        return
    }


    var previousScreenshotName = 'screenshots/' + getDateString() + '.png'
    await takeScreenshot(previousScreenshotName, url);
    for (let i = 0; i < screenshotsCount - 1; i++) {
        await delay(1000 * interval)
        let diffScreenshotName = "screenshots/diff" + getDateString() + ".png"
        let currentScreenshotName = 'screenshots/' + getDateString() + '.png'
        await takeScreenshot(currentScreenshotName, url);
        await imgDiff({
            actualFilename: previousScreenshotName,
            expectedFilename: currentScreenshotName,
            diffFilename: diffScreenshotName,
        }).then(result => {
            diffLogger.write(`${diffScreenshotName};width:${result.width};height:${result.height};imagesAreSame:;${result.imagesAreSame};diffCount:${result.diffCount}\n`)
            if (result.imagesAreSame) {
                fs.unlink(currentScreenshotName, (error) => {})
                fs.unlink(diffScreenshotName, (error) => {})
            } else {
                previousScreenshotName = currentScreenshotName
            }
        });
    }
}


async function main(url, interval, screenshotsCount, output) {
    await processLoop(url, interval, screenshotsCount, output)
    diffLogger.end();
    await archive(output);
}

async function archive(output) {
    if (output) {
        let zipFolder = require('zip-folder');

        await zipFolder('screenshots', output, function(err) {
            if (err) {
                console.log('oh no!', err);
            } else {
                console.log('screenshots folder zipped');
            }
        });
    }
}

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv

let screenshotsDir = __dirname + '/screenshots';
let rimraf = require("rimraf");
if (fs.existsSync(screenshotsDir))
    rimraf.sync(screenshotsDir, {});
fs.mkdirSync(screenshotsDir, 0755);

var diffLogger = fs.createWriteStream('screenshots/diff_info.txt', {
    flags: 'a'
})



main(argv.url, argv.interval, argv.screenshotsCount, argv.output)
const puppeteer = require("puppeteer");

// we're using async/await - so we need an async function, that we can run
const run = async(path, url) => {
    // open the browser and prepare a page
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // set the size of the viewport, so our screenshot will have the desired size
    await page.setViewport({
        width: 1920,
        height: 3000
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


async function main() {
    // run the async function
    var diffName = "screenshots/diff" + getDateString() + ".png"
    var defaultName = 'screenshots/default.png'
    await run(defaultName, 'https://vk.com/');
    var screenshotName = 'screenshots/' + getDateString() + '.png'
    await run(screenshotName, 'https://vk.com/');

    const { imgDiff } = require("img-diff-js");

    await imgDiff({
        actualFilename: defaultName,
        expectedFilename: screenshotName,
        diffFilename: diffName,
    }).then(result => console.log(result));
}

var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

main()
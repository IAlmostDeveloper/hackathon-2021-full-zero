const webdriver = require('selenium-webdriver');
const { Options, Dimension } = require('selenium-webdriver/chrome');



async function getSiteElementsAndSaveScreenshot(url, fileName) {
    const builder = new webdriver.Builder();
    builder.forBrowser('chrome');
    const driver = builder.build();
    driver.manage().window().setSize(new Dimension(1000, 1000));
    await driver.get(url);
    var data = driver.getPageSource().then(found => data = found).catch(error => console.log("error!"));
    var elements = []
    await driver.findElements(webdriver.By.css("*")).then(found => elements = found);
    (await driver).takeScreenshot().then(
        function(image, err) {
            require('fs').writeFile(fileName, image, 'base64', function(err) {
                console.log(err);
            });
        })
    await driver.quit();
    return { elements: elements, rawHtml: data };
}

async function makeDefaultScreenshot(url) {
    return makeScreenshot(url, "screenshots/default.png")
}

async function makeNowScreenshot(url) {
    var d = new Date()
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    let ho = new Intl.DateTimeFormat('en', { hour: 'numeric' }).format(d);
    let mi = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
    let se = new Intl.DateTimeFormat('en', { second: '2-digit' }).format(d);

    return makeScreenshot(url, "screenshots/" + `${da}-${mo}-${ye}-${ho}-${mi}-${se}` + ".png")
}

async function makeScreenshot(url, screenPath) {
    var element = await getSiteElementsAndSaveScreenshot(url, screenPath).then(found => element = found);
    return element
}

async function main() {
    var url = 'https://time100.ru/'
    var screen = await makeDefaultScreenshot(url)
    setInterval(async() => await makeNowScreenshot(url), 4500)
}

main()
const webdriver = require('selenium-webdriver');



async function getSiteElements(url, fileName) {
    const builder = new webdriver.Builder();
    builder.forBrowser('chrome');
    const driver = builder.build();

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

async function compareWebElements(element1, element2) {
    if (!element1 || !element2) {
        console.log("UNDEFINED!!!!!!!!!!!!!!!")
        return;
    }
    var children1 = await element1.driver.findElements(webdriver.By.css("*")).then(found => children1 = found)
    var children2 = await element2.driver.findElements(webdriver.By.css("*")).then(found => children2 = found)
    if (!children1.length || !children2.length) {
        console.log("Вложенных элементов нет!!!!")
        return
    }
    if (children1.length != children2.length) {
        // Вывести сразу различие
        console.log("Различие!!!!!!!!!!!!!!!!")
        children1[i].driver.getPageSource().then(found => console.log(found))
    } else {
        for (var i = 0; i < children1.length; i++) {
            compareWebElements(children1[i], children2[i])
        }
    }
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
    var element = await getSiteElements(url, screenPath).then(found => element = found);
    return element
}

async function main() {
    // var url = 'https://time100.ru/'
    // var screen = await makeDefaultScreenshot(url)
    // setInterval(async() => await makeNowScreenshot(url), 4500)

}

main()
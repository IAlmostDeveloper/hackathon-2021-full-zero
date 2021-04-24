const webdriver = require('selenium-webdriver');

const builder = new webdriver.Builder();
builder.forBrowser('chrome');
const driver = builder.build();

driver.get('http://localhost:4200');
console.log(driver.getPageSource().then(found => console.log(found)));
driver.quit();
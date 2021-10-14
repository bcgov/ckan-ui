const { setDefaultTimeout, After, Before, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const { createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');
const config = require('./step-definitions/config.json');

setDefaultTimeout(200000);

BeforeAll(async () => {
    let browser = config.browser
    await startWebDriver({ env: browser });
})

Before(async () => {
  await createSession();
});

After(async () => {
  await closeSession();
});

AfterAll(async () => {
    await stopWebDriver();
})
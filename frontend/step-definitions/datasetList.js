const { client } = require('nightwatch-api');
const { Given, Then, When } = require('@cucumber/cucumber');

const helpers = require('./helpers');


Given(/^A public user comes to the catalogue$/, async () => {
    return await helpers.open(client);
});

When(/^They click the datastes button$/, async () => {
    await client.waitForElementVisible('#header-menu', 1000).click('#header-menu')
    return await client.waitForElementVisible('#header-menu-explore-datasets', 1000).click('#header-menu-explore-datasets')
});

Then(/^They should be on the dataset list page$/, async () => {
    return await client.waitForElementVisible('a[class="titleLink"]')
});

Then(/^the title is "([^"]*)"$/, title => {
    return client.assert.title(title);
});

Then(/^their should be some datasets$/, async () => {
    return client.expect.element('#list-found-count').text.to.not.equal('0 datasets found');
});
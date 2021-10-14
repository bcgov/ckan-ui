const { client } = require('nightwatch-api');
const { Given, Then, When } = require('@cucumber/cucumber');

const helpers = require('./helpers');

Given(/^A user has login credentials$/, async () => {
    return ( (helpers.confHas('username')) && (helpers.confHas('password')) )
});

When(/^They click the login button$/, async () => {
    await helpers.open(client);
    return await helpers.login(client);
});

Then(/^They should login$/, async () => {
    return true
});
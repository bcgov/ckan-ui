const { client } = require('nightwatch-api');
const { Given, Then, When } = require('@cucumber/cucumber');

const helpers = require('./helpers');
let allowedClickableStates = new Set([]);
const STATES = ["Draft", "Pending-Publish", "Published", "Pending-Archive", "Archived"];



Given(/^A user has "([^"]*)" permissions and is creating a dataset$/, async (userType) => {
    await helpers.open(client);
    await helpers.login(client, userType);
    await client.waitForElementVisible('#add-dataset-btn', 1000).click('#add-dataset-btn');
    return await client.waitForElementVisible('input[name="title"]');
});

Given(/^A user has "([^"]*)" permissions and is editing a "([^"]*)" dataset$/, async(userType, recordState) => {
    await helpers.open(client);
    await helpers.login(client, userType);
    //nav to dataset list page
    await client.click('#header-menu').click('#header-menu-explore-datasets');    
    
    //filter to a draf trecord
    await client.waitForElementVisible('#facetPanelHeader-Record-Status', 5000).click('#facetPanelHeader-Record-Status');
    await client.waitForElementVisible('#facet-filterOn-State-'+recordState.toUpperCase().replace(' ', '-'), 5000).click('#facet-filterOn-State-'+recordState.toUpperCase().replace(' ', '-'));
    await client.pause(5000);

    //open and edit draft record
    await client.click('a[href^="/dataset/"]');
    await client.waitForElementVisible('#editDataset-btn', 10000).click('#editDataset-btn');
});

When(/^They have selected an org$/, async () => {
    await client.waitForElementVisible('#select-owner_org', 1000).click('#select-owner_org div[role="button"]');
    return await client.waitForElementVisible('div[role="listbox"] div', 10000).click('div[role="listbox"] div');
});

Then(/^They should be able to select the "([^"]*)" State$/, async (state) => {
    let stateButtonId = '#'+state.replace(' ', '-')+"-publish_state";
    allowedClickableStates.add(state);
    await client.assert.elementPresent(stateButtonId);
    await client.assert.cssClassPresent(stateButtonId, "fauxButton");
    return client.click(stateButtonId);
});

Then(/^They should not be able to select any other state$/, async () => {
    let cantClick = STATES.filter(function(obj) { return allowedClickableStates.has(obj) === false; });
    console.log("CANTCLICK", cantClick, allowedClickableStates);
    success = true;
    for (let i=0; i<cantClick.length; i++){
        let stateSelector = '#'+cantClick[i]+'-publish_state';
        let result = await client.element('css selector', stateSelector);

        if(result && result.status != -1){
            let elementClass = await element.getAttribute('class')
            success = success && elementClass.indexOf("fauxDisabled") !== -1;
        }
    }
    
    return success;
});
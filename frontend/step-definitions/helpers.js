const { client } = require('nightwatch-api');
const conf = require('./config.json');

confGet = function(parm){
    return conf[parm];
}

confHas = function(parm){
    return (typeof(conf[parm]) !== "undefined");
}

module.exports = {
    confGet: confGet,

    confHas: confHas,

    open: function(){
        return client.url(confGet('url'));
    },

    //assumes not logged in won't work otherwise
    login: async function(client, userType){

        if (typeof(userType) === "undefined"){
            userType = "default"
        }
        

        await client.waitForElementVisible('#login-btn', 1000).click('#login-btn');
        await client.waitForElementVisible('#zocial-idir', 1000).click('#zocial-idir');
        
        await client.waitForElementVisible('input[name="password"]', 1000);
        await client.waitForElementVisible('input[name="btnSubmit"]', 1000);
        await client
                .setValue('input[name="user"]', confGet(userType+"Username"))
                .setValue('input[name="password"]', confGet(userType+"Password"))
                .click('input[name="btnSubmit"]')


        return client.waitForElementVisible('#app', 5000);
    },

    logout: async function(client){
        await client.pause(1000);
        await client.click('#header-menu')
        await client.click('#mobile-logout-btn');
        try {
            await client.pause(1000);
            await client.click('#header-menu')
            return client.click('#mobile-logout-btn');
        }catch(ex){
            //this is because sometimes it needs to logout twice
        }
        return true;
    },
}
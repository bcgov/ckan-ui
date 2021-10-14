const seleniumServer = require('selenium-server');
const chromeDriver = require('chromedriver');
const geckoDriver = require('geckodriver');
const ieDriver = require('iedriver');
const edgeDriver = require('edgedriver');
const config = require('./step-definitions/config.json');
const path = config.screenshotPath;

module.exports = {
  silent: false,
  test_settings: {
    default: {
        screenshots: {
            enabled: true,
            path: path
        },
        selenium: {
            start_process: true,
            server_path: seleniumServer.path,
            port: 4444,
            cli_args: {
                'webdriver.chrome.driver': chromeDriver.path,
                'webdriver.gecko.driver': geckoDriver.path,
                'webdriver.ie.driver': ieDriver.path,
                'webdriver.edge.driver': edgeDriver.path
            }
        }
    },
    chromeHeadless: {
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          w3c: false,
          args: ['--headless']
        }
      }
    },
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          w3c: false
        }
      }
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true,
        marionette: true
      }
    },
    edge: {
      desiredCapabilities: {
        browserName: 'MicrosoftEdge',
        javascriptEnabled: true
      }
    },
    ie: {
      desiredCapabilities: {
        browserName: 'internet explorer',
        javascriptEnabled: true
      }
    }
  }
};
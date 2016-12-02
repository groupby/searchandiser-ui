const selenium = require('selenium-server-standalone-jar');

module.exports = {
  src_folders: ['test/e2e/tests'],
  output_folder: 'reports/',
  globals_path: 'test/e2e/globals',
  custom_commands_path: 'test/e2e/functions',
  // page_objects_path: ['test/e2e/pages'],
  selenium: {
    start_process: true,
    server_path: selenium.path,
    cli_args: {
      'webdriver.chrome.driver': './node_modules/.bin/chromedriver',
      'webdriver.gecko.driver': './node_modules/.bin/geckodriver'
    }
  },
  test_workers: true,
  test_settings: {
    default: {
      launch_url: 'localhost:9090',
      skip_testcases_on_fail: false,
      selenium_port: 4444,
      selenium_host: 'localhost',
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--no-sandbox']
        }
      },
      screenshots: {
        enabled: true,
        on_failure: true,
        path: 'screenshots/'
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        marionette: true
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--no-sandbox']
        }
      }
    },

    phantomjs: {
      desiredCapabilities: {
        browserName: 'phantomjs',
        'phantomjs.binary.path': './node_modules/.bin/phantomjs'
      }
    }
  }
};

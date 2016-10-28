const selenium = require('selenium-server-standalone-jar');

module.exports = {
  src_folders: ['test/e2e/tests'],
  output_folder: 'reports/',
  globals_path: 'test/e2e/globals',
  page_objects_path: ['test/e2e/pages'],
  selenium: {
    start_process: false,
    server_path: selenium.path
  },
  test_workers: false,
  test_settings: {
    default: {
      launch_url: 'localhost:8080',
      skip_testcases_on_fail: false,
      selenium_port: 9515,
      selenium_host: 'localhost',
      default_path_prefix: '',
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
    }
  }
};

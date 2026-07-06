const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: "reports/cucumber-json",
  reportPath: "reports/cucumber-html",
  reportName: "Cypress Cucumber Report",
  pageTitle: "Cypress Cucumber Report",
  displayDuration: true,
  openReportInBrowser: false,
  metadata: {
    browser: {
      name: "chrome",
      version: "latest",
    },
    device: "Local machine",
    platform: {
      name: "windows",
      version: "11",
    },
  },
  customData: {
    title: "Información de ejecución",
    data: [
      { label: "Proyecto", value: "CypressAutomation" },
      { label: "Suite", value: "SauceDemo Login" },
      { label: "Framework", value: "Cypress + Cucumber + POM" },
      { label: "Comando", value: "npm run test:login" },
    ],
  },
});
const report = require("multiple-cucumber-html-reporter");
const os = require("node:os");

const isCI = process.env.GITHUB_ACTIONS === "true";

report.generate({
  jsonDir: "reports/cucumber-json",
  reportPath: "reports/cucumber-html",
  reportName: "Cypress Cucumber Report",
  pageTitle: "Cypress Cucumber Report",
  displayDuration: true,
  openReportInBrowser: false,
  metadata: {
    browser: {
      name: process.env.CYPRESS_BROWSER || "Electron",
      version: "Administrado por Cypress",
    },
    device: isCI ? "GitHub Actions runner" : "Local machine",
    platform: {
      name: os.platform(),
      version: os.release(),
    },
  },
  customData: {
    title: "Información de ejecución",
    data: [
      { label: "Proyecto", value: "CypressAutomation" },
      { label: "Suite", value: process.env.TEST_SUITE || "SauceDemo E2E" },
      { label: "Framework", value: "Cypress + Cucumber + POM" },
      {
        label: "Comando",
        value: process.env.TEST_COMMAND || "Definido por la ejecución",
      },
    ],
  },
});

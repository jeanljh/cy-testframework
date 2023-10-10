const { defineConfig } = require('cypress')
require('dotenv').config()

module.exports = defineConfig({
  projectId: process.env.CYPRESS_PROJECT_ID,
  defaultCommandTimeout: 10000,
  viewportHeight: 1080,
  viewportWidth: 1920,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  e2e: {
    setupNodeEvents(on, config) {
      let val
      on('task', {
        log: msg => {
          console.log(msg)
          return null
        },
        setVal: input => (val = input ?? null),
        getVal: () => val ?? null,
      })
    },
    baseUrl: 'https://www.cheapflightsfares.com/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})

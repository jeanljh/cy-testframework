const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'd8p28t',
  defaultCommandTimeout: 10000,
  viewportHeight: 1080,
  viewportWidth: 1920,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      let val
      on('task', {
        log: msg => {
          console.log(msg)
          return null
        },
        setVal: input => val = input ?? null,
        getVal: () => val ?? null
      })
    },
    baseUrl: 'https://www.cheapflightsfares.com/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})

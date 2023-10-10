const dotenv = require('dotenv')

// load environment variables from .env file
const result = dotenv.config()

if (result.error) {
  throw result.error
}

// get the value of CYPRESS_RECORD_KEY
const cypressRecordKey = process.env.CYPRESS_RECORD_KEY

// run Cypress with the environment variable
const { exec } = require('child_process')

exec(`cypress run --headed --record --key ${cypressRecordKey}`, (error, stdout, stderr) => {
  if (error) {
    console.error(error)
    return
  }
  console.log({ stdout })
  console.error({ stderr })
})

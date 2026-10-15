// scripts/deploy-function.mjs
//
// Uploads reserve-spot.tar.gz (in the project root) as a new deployment and
// activates it. Same thing as "Create deployment → Manual" in the Console,
// but from the terminal, so any error is printed in full.
//
// Usage: node scripts/deploy-function.mjs
// Needs the API key in .env to have the functions.write scope.

import 'dotenv/config'
import { Client, Functions } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'

const FUNCTION_ID = 'reserve-spot'
const ARCHIVE = 'reserve-spot.tar.gz' // created with: tar -czf reserve-spot.tar.gz -C functions/reserve-spot .

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY)

const functions = new Functions(client)

try {
  const deployment = await functions.createDeployment({
    functionId: FUNCTION_ID,
    code: InputFile.fromPath(ARCHIVE, ARCHIVE),
    activate: true,
    entrypoint: 'src/main.js',
    commands: 'npm install',
  })
  console.log('✓ Uploaded. Deployment', deployment.$id, '— status:', deployment.status)
  console.log('  Check the Deployments tab in Appwrite until it says Ready.')
} catch (err) {
  console.error('✗ Failed:', err.message)
  process.exit(1)
}
import * as path from 'node:path'
import { BrowserCheck, Frequency } from 'checkly/constructs'
import { emailAlert } from './alert-channels'

new BrowserCheck('login-page', {
  name: 'Login Page — Direct Load',
  activated: true,
  muted: false,
  frequency: Frequency.EVERY_10M,
  locations: ['us-east-1', 'eu-west-1'],
  tags: ['showcase'],
  code: {
    entrypoint: path.join(__dirname, '..', '..', 'tests', 'login-page.spec.ts'),
  },
  alertChannels: [emailAlert],
})

import * as path from 'node:path'
import { BrowserCheck, Frequency } from 'checkly/constructs'
import { emailAlert, jiraWebhook } from './alert-channels'

new BrowserCheck('spa-journey', {
  name: 'SPA Journey — Login → Category → Product',
  activated: true,
  muted: false,
  frequency: Frequency.EVERY_10M,
  locations: ['us-east-1', 'eu-west-1'],
  tags: ['showcase', 'pr-gate'],
  code: {
    entrypoint: path.join(__dirname, '..', '..', 'tests', 'spa-journey.spec.ts'),
  },
  alertChannels: [emailAlert, jiraWebhook],
})

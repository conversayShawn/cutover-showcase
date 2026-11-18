import 'dotenv/config'
import { defineConfig } from 'checkly'
import { Frequency } from 'checkly/constructs'

export default defineConfig({
  projectName: 'Cutover Showcase',
  logicalId: 'cutover-showcase',
  checks: {
    locations: ['us-east-1', 'eu-west-1'],
    tags: ['showcase', 'pr-gate'],
    runtimeId: '2026.04',
    frequency: Frequency.EVERY_10M,
    checkMatch: '**/__checks__/**/*.check.ts',
    browserChecks: {
      frequency: Frequency.EVERY_10M,
    },
  },
  cli: {
    runLocation: 'us-east-1',
    reporters: ['list'],
  },
})

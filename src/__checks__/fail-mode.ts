/**
 * Toggle for the merge-block scene: when DEMO_FAIL_MODE=true, the SPA journey
 * spec intercepts the shop's JS bundles so the SPA never bootstraps and the
 * check fails at the sign-in affordance assertion.
 */
export const shouldFail = (): boolean =>
  process.env.DEMO_FAIL_MODE === 'true'

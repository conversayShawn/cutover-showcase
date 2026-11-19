import { EmailAlertChannel, WebhookAlertChannel } from 'checkly/constructs'

export const emailAlert = new EmailAlertChannel('showcase-email', {
  address: process.env.ALERT_EMAIL || 'se@example.com',
})

/**
 * Jira-shaped webhook that uses Checkly's grouped-error metadata. The payload
 * sent to the webhook target has:
 *   checkly.errorGroup.signature     deterministic hash of the failure
 *   checkly.errorGroup.errorGroupId  server-side id for the group
 *   checkly.errorGroup.first_seen    timestamp
 *   checkly.errorGroup.last_seen     timestamp
 *   checkly.errorGroup.occurrences   count
 * A Jira automation rule can match the signature against open issues to
 * update rather than duplicate, and open a new ticket when no match is found.
 */
export const jiraWebhook = new WebhookAlertChannel('showcase-jira-webhook', {
  name: 'Jira (grouped failures)',
  method: 'POST',
  url:
    process.env.JIRA_WEBHOOK_URL ||
    'https://webhook.site/89e6b87e-b0ec-46ff-b8e8-168fdd372f35',
  headers: [{ key: 'Content-Type', value: 'application/json' }],
  template: JSON.stringify(
    {
      alert: {
        title: '{{ALERT_TITLE}}',
        check_name: '{{CHECK_NAME}}',
        result_link: '{{RESULT_LINK}}',
        error_message: '{{ERROR_MESSAGE}}',
      },
      checkly: {
        errorGroup: {
          errorGroupId: '{{ERROR_GROUP_ID}}',
          signature: '{{ERROR_GROUP_SIGNATURE}}',
          first_seen: '{{ERROR_GROUP_FIRST_SEEN}}',
          last_seen: '{{ERROR_GROUP_LAST_SEEN}}',
          occurrences: '{{ERROR_GROUP_OCCURRENCES}}',
        },
      },
      jira: {
        dedupe_key: '{{ERROR_GROUP_SIGNATURE}}',
        summary: '{{CHECK_NAME}} — {{ALERT_TITLE}}',
      },
    },
    null,
    2,
  ),
})

import "server-only";

/**
 * Incoming webhook used to post internal notifications (signups, submissions).
 * Hard-coded intentionally so notifications work without extra env setup.
 */
const SLACK_WEBHOOK_URL =
  "https://hooks.slack.com/services/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";

/**
 * Post a plain-text message to the internal Slack channel. Never throws — a
 * failed notification should not break the user-facing request, so errors are
 * logged and swallowed.
 */
export async function sendSlackNotification(text: string) {
  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error(
        `Slack notification failed: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error("Failed to send Slack notification", error);
  }
}

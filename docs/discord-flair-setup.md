# Discord flair setup

One-time setup for giving every member of the Onsen Retreat Discord a custom
role ("flair") — an orange **Onsen OG** badge in the member list. The sweep
itself is `scripts/assign-discord-flair.ts`, run via `npm run discord:flair`.

## 1. Create the bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application**, name it (e.g. `Onsen Bot`), and create it.
3. Open the **Bot** tab in the left sidebar.
4. Click **Reset Token**, confirm, and copy the token. It is shown **only
   once** — save it now. This is your `DISCORD_BOT_TOKEN`.

## 2. Enable the Server Members Intent

Still on the **Bot** tab:

1. Scroll to **Privileged Gateway Intents**.
2. Toggle on **Server Members Intent**.
3. Save changes.

Without this, the script cannot list the server's members (the API returns
403).

## 3. Invite the bot to the server

1. Open the **OAuth2** tab → **URL Generator**.
2. Under **Scopes**, check `bot`.
3. Under **Bot Permissions**, check **Manage Roles**.
4. Copy the generated URL at the bottom, open it in your browser, pick the
   Onsen Retreat server, and click **Authorize**.

You need the **Manage Server** permission on the Onsen Retreat server to do
this.

## 4. Get the server (guild) ID

1. In Discord: **User Settings → Advanced → Developer Mode** — turn it on.
2. Right-click the Onsen Retreat server icon in the sidebar → **Copy Server
   ID**. This is your `DISCORD_GUILD_ID`.

## 5. Configure .env

Add to `.env` (never commit these):

```
DISCORD_BOT_TOKEN=your-bot-token
DISCORD_GUILD_ID=your-server-id
```

## 6. Run it

Preview first — no changes are made:

```sh
npm run discord:flair -- --dry-run
```

You should see the member count and the list of people who would get the
role. If that looks right:

```sh
npm run discord:flair
```

The script creates the **Onsen OG** role (orange, `#ff7100`) if it doesn't
exist, then assigns it to every non-bot member. It ends with a summary like:

```
Done: assigned 142, already had 0, skipped bots 3, failed 0
```

Large servers take a few minutes — Discord rate-limits role assignments and
the script waits automatically.

### Troubleshooting

| Symptom                       | Cause / fix                                                                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `401 Unauthorized`            | Bad or stale token — reset it in the Bot tab and update `.env`.                                                                                                                |
| `403` when listing members    | Server Members Intent not enabled (step 2).                                                                                                                                    |
| `403` when assigning the role | The bot's own role is below **Onsen OG** in the hierarchy. In Discord: **Server Settings → Roles**, drag the bot's role above it. Or the bot is missing Manage Roles (step 3). |
| Members missing from the list | The bot isn't in the server — redo step 3.                                                                                                                                     |

## 7. Re-running later

The script is idempotent — re-run `npm run discord:flair` anytime to give the
role to people who joined since the last sweep; existing holders are skipped.

To change the flair, edit `ROLE_NAME` / `ROLE_COLOR` at the top of
`scripts/assign-discord-flair.ts`. Note: changing `ROLE_NAME` makes the
script create a **new** role on the next run; the old one stays in Discord
until you delete it in **Server Settings → Roles**.

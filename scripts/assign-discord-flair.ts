/**
 * Assign a custom "flair" role to every member of the Discord server.
 *
 * Setup guide: docs/discord-flair-setup.md
 *
 * Usage:
 *   npm run discord:flair -- --dry-run   # preview who would get the role
 *   npm run discord:flair                # create role (if needed) and assign
 *
 * Requires DISCORD_BOT_TOKEN and DISCORD_GUILD_ID in .env.
 * Safe to re-run: members who already have the role are skipped.
 */

const ROLE_NAME = "ONSEN RETREAT OG";
const ROLE_COLOR = 0xff7100; // --color-flame brand orange
const AUDIT_REASON = "Onsen Retreat flair automation";

const API = "https://discord.com/api/v10";

const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;
const dryRun = process.argv.includes("--dry-run");

if (!token || !guildId) {
  console.error(
    "Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID. Add them to .env — see docs/discord-flair-setup.md",
  );
  process.exit(1);
}

interface Role {
  id: string;
  name: string;
}

interface GuildMember {
  user: { id: string; username: string; bot?: boolean };
  roles: string[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function discord(
  method: string,
  path: string,
  body?: unknown,
): Promise<Response> {
  for (; ;) {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
        "X-Audit-Log-Reason": AUDIT_REASON,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (res.status === 429) {
      const data = (await res.json()) as { retry_after: number };
      await sleep(data.retry_after * 1000 + 100);
      continue;
    }

    // Preemptively wait out the bucket so we never actually hit 429s.
    if (res.headers.get("X-RateLimit-Remaining") === "0") {
      const resetAfter = Number(res.headers.get("X-RateLimit-Reset-After"));
      if (resetAfter > 0) await sleep(resetAfter * 1000 + 100);
    }

    return res;
  }
}

async function fail(res: Response, context: string): Promise<never> {
  const body = await res.text();
  if (res.status === 401) {
    console.error(`${context}: 401 Unauthorized — check DISCORD_BOT_TOKEN.`);
  } else if (res.status === 403) {
    console.error(
      `${context}: 403 Forbidden — is the Server Members Intent enabled and does the bot have Manage Roles? See docs/discord-flair-setup.md troubleshooting.`,
    );
  } else {
    console.error(`${context}: ${res.status} ${body}`);
  }
  process.exit(1);
}

async function findOrCreateRole(): Promise<Role> {
  const res = await discord("GET", `/guilds/${guildId}/roles`);
  if (!res.ok) await fail(res, "Listing roles failed");
  const roles = (await res.json()) as Role[];

  const existing = roles.find((r) => r.name === ROLE_NAME);
  if (existing) {
    console.log(`Role "${ROLE_NAME}" already exists (${existing.id})`);
    return existing;
  }

  if (dryRun) {
    console.log(`[dry-run] Would create role "${ROLE_NAME}"`);
    return { id: "dry-run-role", name: ROLE_NAME };
  }

  const created = await discord("POST", `/guilds/${guildId}/roles`, {
    name: ROLE_NAME,
    color: ROLE_COLOR,
    hoist: false,
    mentionable: false,
  });
  if (!created.ok) await fail(created, "Creating role failed");
  const role = (await created.json()) as Role;
  console.log(`Created role "${ROLE_NAME}" (${role.id})`);
  return role;
}

async function fetchAllMembers(): Promise<GuildMember[]> {
  const members: GuildMember[] = [];
  let after = "0";
  for (; ;) {
    const res = await discord(
      "GET",
      `/guilds/${guildId}/members?limit=1000&after=${after}`,
    );
    if (!res.ok) await fail(res, "Listing members failed");
    const page = (await res.json()) as GuildMember[];
    members.push(...page);
    if (page.length < 1000) return members;
    after = page[page.length - 1]!.user.id;
  }
}

async function main() {
  console.log(`${dryRun ? "[dry-run] " : ""}Guild ${guildId}`);
  const role = await findOrCreateRole();
  const members = await fetchAllMembers();
  console.log(`Fetched ${members.length} members`);

  let assigned = 0;
  let alreadyHad = 0;
  let bots = 0;
  let failed = 0;

  for (const member of members) {
    if (member.user.bot) {
      bots++;
      continue;
    }
    if (member.roles.includes(role.id)) {
      alreadyHad++;
      continue;
    }
    if (dryRun) {
      console.log(`[dry-run] Would assign to ${member.user.username}`);
      assigned++;
      continue;
    }
    const res = await discord(
      "PUT",
      `/guilds/${guildId}/members/${member.user.id}/roles/${role.id}`,
    );
    if (res.ok) {
      assigned++;
      if (assigned % 25 === 0) console.log(`...${assigned} assigned`);
    } else {
      failed++;
      console.error(
        `Failed for ${member.user.username}: ${res.status} ${await res.text()}`,
      );
    }
  }

  console.log(
    `${dryRun ? "[dry-run] " : ""}Done: assigned ${assigned}, already had ${alreadyHad}, skipped bots ${bots}, failed ${failed}`,
  );
  if (failed > 0) process.exit(1);
}

void main();

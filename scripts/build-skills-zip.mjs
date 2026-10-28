#!/usr/bin/env node
// Build the Anthropic marketing skills download (G07-T06, decision G13).
//
// Reproducible: the upstream folder is pinned to one commit, entries are
// sorted, every timestamp is the pinned commit's date, and the zip writer
// below is deterministic. Two runs give byte-identical zips.
//
// Safety: the upstream checkout is untrusted data. It goes into a NEW, EMPTY
// scratch folder outside this project, git hooks are pointed at an empty
// folder, and nothing from the checkout is executed. Files are only read as
// bytes and checked against their git blob ids.
//
// Usage:
//   node scripts/build-skills-zip.mjs [--keep-scratch] [--evidence <dir>]
//
// Writes:
//   skills/downloads/anthropic-marketing-skills.zip   (the 8 skills + LICENSE + NOTICE.txt + SOURCE.md + INSTALL.md + per-skill zips)
//   skills/downloads/<skill>.zip                      (one skill per zip, for upload in Claude apps)
//   skills/downloads/SHA256SUMS.txt
//   <evidence>/manifest.json, <evidence>/build-log.txt (default experience/evidence/g07-skills-zip)

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

// ---- Pin (G07-T02, experience/research/g07-skills-packaging.md) ----
const REPO = "anthropics/knowledge-work-plugins";
const REPO_URL = `https://github.com/${REPO}.git`;
const PIN_SHA = "c71b6f3082b1e5ace3d1a9e30ac9205934134c9c";
const PIN_DATE_ISO = "2026-09-21T18:25:14Z"; // committer date of PIN_SHA (UTC)
const PIN_DATE_TEXT = "21 September 2026";
const UPSTREAM_DIR = "marketing";
const SKILLS = [
  "brand-review",
  "campaign-plan",
  "competitive-brief",
  "content-creation",
  "draft-content",
  "email-sequence",
  "performance-report",
  "seo-audit",
];
const BUNDLE_NAME = "anthropic-marketing-skills.zip";
const BUNDLE_SKILLS_DIR = "marketing-skills";
const BUNDLE_UPLOAD_DIR = "upload-to-claude";
const DOCS_CHECKED = "27 October 2026";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "skills", "downloads");
const args = process.argv.slice(2);
const KEEP_SCRATCH = args.includes("--keep-scratch");
const evIdx = args.indexOf("--evidence");
const EVIDENCE_DIR = path.resolve(ROOT, evIdx >= 0 ? args[evIdx + 1] : "experience/evidence/g07-skills-zip");

const log = [];
function say(line) {
  log.push(line);
  console.log(line);
}
function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}
function gitBlobId(buf) {
  return createHash("sha1").update(`blob ${buf.length}\0`).update(buf).digest("hex");
}

// ---- 1. Sparse checkout at the pin into a new, empty scratch folder ----
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "gtp-skills-"));
const noHooks = fs.mkdtempSync(path.join(os.tmpdir(), "gtp-nohooks-"));
const checkout = path.join(scratch, "upstream");
fs.mkdirSync(checkout);
if (fs.readdirSync(checkout).length !== 0) throw new Error("scratch checkout folder is not empty");

function git(...gitArgs) {
  return execFileSync(
    "git",
    [
      "-c", `core.hooksPath=${noHooks}`,
      "-c", "core.autocrlf=false",
      "-c", "core.longpaths=true",
      "-c", "advice.detachedHead=false",
      "-c", "protocol.file.allow=never",
      ...gitArgs,
    ],
    { cwd: checkout, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  ).trim();
}

say(`scratch: ${checkout}`);
git("init", "-q");
git("remote", "add", "origin", REPO_URL);
git("sparse-checkout", "set", "--cone", UPSTREAM_DIR);
git("fetch", "-q", "--depth", "1", "--filter=blob:none", "origin", PIN_SHA);
git("checkout", "-q", "FETCH_HEAD");
const head = git("rev-parse", "HEAD");
if (head !== PIN_SHA) throw new Error(`HEAD ${head} != pin ${PIN_SHA}`);
say(`checked out ${REPO}@${head}`);

// Blob ids from the tree, used to prove each read file is the exact upstream blob.
const treeLines = git("ls-tree", "-r", "HEAD").split("\n").filter(Boolean);
const blobIds = new Map();
for (const line of treeLines) {
  const [meta, file] = line.split("\t");
  const [, type, id] = meta.split(" ");
  if (type === "blob") blobIds.set(file, id);
}
const noticeFiles = [...blobIds.keys()].filter((f) => /(^|\/)NOTICE[^/]*$/i.test(f));
say(`NOTICE files anywhere in the upstream tree at the pin: ${noticeFiles.length ? noticeFiles.join(", ") : "none"}`);

function readUpstream(rel) {
  const buf = fs.readFileSync(path.join(checkout, ...rel.split("/")));
  const expected = blobIds.get(rel);
  if (!expected) throw new Error(`${rel} is not in the pinned tree`);
  if (gitBlobId(buf) !== expected) throw new Error(`${rel} bytes differ from blob ${expected}`);
  return buf;
}

// ---- 2. Collect the 8 skill folders and the licence, unmodified ----
const skillFiles = []; // { skill, rel (inside skill folder), buf }
for (const skill of SKILLS) {
  const prefix = `${UPSTREAM_DIR}/skills/${skill}/`;
  const files = [...blobIds.keys()].filter((f) => f.startsWith(prefix)).sort();
  if (!files.includes(`${prefix}SKILL.md`)) throw new Error(`${skill}: SKILL.md missing upstream`);
  for (const f of files) skillFiles.push({ skill, rel: f.slice(prefix.length), buf: readUpstream(f) });
}
const upstreamSkillDirs = new Set(
  [...blobIds.keys()]
    .filter((f) => f.startsWith(`${UPSTREAM_DIR}/skills/`))
    .map((f) => f.split("/")[2]),
);
const extra = [...upstreamSkillDirs].filter((s) => !SKILLS.includes(s));
const missing = SKILLS.filter((s) => !upstreamSkillDirs.has(s));
if (missing.length) throw new Error(`missing skill folders upstream: ${missing.join(", ")}`);
say(`upstream skill folders: ${[...upstreamSkillDirs].sort().join(", ")}${extra.length ? ` (not packed: ${extra.join(", ")})` : ""}`);
const LICENSE = readUpstream(`${UPSTREAM_DIR}/LICENSE`);
const licenceFirst = LICENSE.toString("utf8").split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 2).join(" / ");
if (!/^Apache License \/ Version 2\.0, January 2004$/.test(licenceFirst)) throw new Error(`unexpected licence header: ${licenceFirst}`);
say(`licence: ${UPSTREAM_DIR}/LICENSE sha256 ${sha256(LICENSE)} (${licenceFirst})`);

// ---- 3. Attribution and install texts (deterministic, no build-time values) ----
const treeUrl = `https://github.com/${REPO}/tree/${PIN_SHA}/${UPSTREAM_DIR}`;
const noticeLine = noticeFiles.length
  ? `Upstream ships these NOTICE files, reproduced unchanged: ${noticeFiles.join(", ")}.`
  : "Upstream ships no NOTICE file at this commit, so there is no upstream NOTICE text to reproduce.";

const NOTICE = Buffer.from(
  [
    "Anthropic marketing skills - attribution notice",
    "",
    "The skills in this download were written by Anthropic and are published in",
    `the ${REPO} repository, folder ${UPSTREAM_DIR}/skills.`,
    "",
    `Source:  ${treeUrl}`,
    `Commit:  ${PIN_SHA} (${PIN_DATE_TEXT})`,
    `Skills:  ${SKILLS.join(", ")}`,
    "",
    "Every SKILL.md is an unmodified copy of the upstream file at that commit.",
    "",
    "Licence: Apache License, Version 2.0. The full text is in LICENSE, copied",
    `byte for byte from ${UPSTREAM_DIR}/LICENSE at the same commit.`,
    noticeLine,
    "",
    "Packaged for the GTP ECO marketing workshop (South Africa). The packaging",
    "files (NOTICE.txt, SOURCE.md, INSTALL.md, and the per-skill upload zips) are",
    "not part of the upstream work. Each per-skill zip adds LICENSE.txt (the same",
    "Apache-2.0 text) and NOTICE.txt (this notice) beside the unmodified SKILL.md.",
    "This download is not an Anthropic product and is not endorsed by Anthropic.",
    "",
  ].join("\n"),
);

const SOURCE = Buffer.from(
  [
    "# Source",
    "",
    `- Upstream folder at the pinned commit: <${treeUrl}>`,
    `- Commit: \`${PIN_SHA}\` (${PIN_DATE_TEXT})`,
    `- Repository: <https://github.com/${REPO}>`,
    "- Licence: Apache-2.0 (see `LICENSE`)",
    "",
    "## Files and SHA-256",
    "",
    "| File in this zip | Upstream path | SHA-256 |",
    "|---|---|---|",
    ...skillFiles.map(
      (f) => `| \`${BUNDLE_SKILLS_DIR}/${f.skill}/${f.rel}\` | \`${UPSTREAM_DIR}/skills/${f.skill}/${f.rel}\` | \`${sha256(f.buf)}\` |`,
    ),
    `| \`LICENSE\` | \`${UPSTREAM_DIR}/LICENSE\` | \`${sha256(LICENSE)}\` |`,
    "",
  ].join("\n"),
);

const INSTALL = Buffer.from(
  [
    "# Install a marketing skill in Claude",
    "",
    "Start with step 1 on a computer. One skill takes about 3 minutes.",
    "",
    "You need a Claude account. The free plan works. Each skill zip is under 15 KB, so it uses almost no data.",
    "",
    "## Step 1. Switch on file creation (1 minute)",
    "",
    "1. Open <https://claude.ai> in your browser and sign in.",
    "2. Go to **Settings > Capabilities**.",
    "3. Switch on **Code execution and file creation**. In the newer layout it is called **Create and edit files**.",
    "",
    "## Step 2. Upload one skill (1 minute per skill)",
    "",
    "1. Unzip `anthropic-marketing-skills.zip`. Open the `upload-to-claude` folder.",
    "2. In Claude, go to **Customize > Skills**.",
    "3. Click **+**, then **+ Create skill**, then **Upload a skill**.",
    "4. Choose one zip, for example `campaign-plan.zip`. Upload the zip as it is. Do not unzip it.",
    "5. Repeat for each skill you want. One zip is one skill.",
    "",
    "## Step 3. Use it (1 minute)",
    "",
    "1. Check that the switch next to the skill is on.",
    "2. Start a new chat and name the skill in your request, for example:",
    "   > Use the campaign-plan skill to plan four weeks of Facebook and WhatsApp posts for my bakery in Durban.",
    "",
    "## Which skill does what",
    "",
    "| Skill | Use it to |",
    "|---|---|",
    "| brand-review | check a post or page against your brand voice before it goes out |",
    "| campaign-plan | turn a goal into a week-by-week campaign plan |",
    "| competitive-brief | compare your business with a competitor |",
    "| content-creation | write posts, emails and web pages in the right format for each channel |",
    "| draft-content | draft one piece of content with headline options |",
    "| email-sequence | write a series of follow-up emails |",
    "| performance-report | turn your numbers into a short report with next steps |",
    "| seo-audit | find what to fix so people find your website on Google |",
    "",
    "## If an upload fails",
    "",
    "Claude shows the reason. The Claude Help Center lists the common ones (size, folder name, missing SKILL.md, characters in the name or description):",
    "<https://support.claude.com/en/articles/12512180-use-skills-in-claude>",
    "",
    "## Already use Claude Code? (optional)",
    "",
    "Install Anthropic's whole marketing plugin instead. Type these two commands in your terminal:",
    "",
    "```",
    "claude plugin marketplace add anthropics/knowledge-work-plugins",
    "claude plugin install marketing@knowledge-work-plugins",
    "```",
    "",
    "Then type `/` in Claude Code and look for `/marketing:campaign-plan`. The plugin route installs the newest upstream version, not the pinned copy in this zip, and it also offers connectors to other apps.",
    "",
    `Steps checked against the Claude Help Center and Claude Code docs on ${DOCS_CHECKED}. Menu names can change; the Help Center link above has the current wording.`,
    "",
    "Next: upload `campaign-plan.zip` and ask it to plan your next month.",
    "",
  ].join("\n"),
);

// ---- 4. Deterministic zip writer (deflate, fixed timestamps, sorted entries) ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
const pinDate = new Date(PIN_DATE_ISO);
const DOS_TIME = (pinDate.getUTCHours() << 11) | (pinDate.getUTCMinutes() << 5) | Math.floor(pinDate.getUTCSeconds() / 2);
const DOS_DATE = ((pinDate.getUTCFullYear() - 1980) << 9) | ((pinDate.getUTCMonth() + 1) << 5) | pinDate.getUTCDate();

// entries: [{ name, data? }]; names ending in "/" are folders.
function makeZip(entries) {
  const sorted = [...entries].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const local = [];
  const central = [];
  let offset = 0;
  for (const e of sorted) {
    const name = Buffer.from(e.name, "utf8");
    const isDir = e.name.endsWith("/");
    const raw = isDir ? Buffer.alloc(0) : e.data;
    const method = isDir ? 0 : 8;
    const body = isDir ? raw : zlib.deflateRawSync(raw, { level: 9 });
    const crc = isDir ? 0 : crc32(raw);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4); // version needed
    lh.writeUInt16LE(0, 6); // flags
    lh.writeUInt16LE(method, 8);
    lh.writeUInt16LE(DOS_TIME, 10);
    lh.writeUInt16LE(DOS_DATE, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(body.length, 18);
    lh.writeUInt32LE(raw.length, 22);
    lh.writeUInt16LE(name.length, 26);
    lh.writeUInt16LE(0, 28);
    local.push(lh, name, body);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4); // version made by (MS-DOS, 2.0)
    ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0, 8);
    ch.writeUInt16LE(method, 10);
    ch.writeUInt16LE(DOS_TIME, 12);
    ch.writeUInt16LE(DOS_DATE, 14);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(body.length, 20);
    ch.writeUInt32LE(raw.length, 24);
    ch.writeUInt16LE(name.length, 28);
    ch.writeUInt16LE(0, 30); // extra
    ch.writeUInt16LE(0, 32); // comment
    ch.writeUInt16LE(0, 34); // disk
    ch.writeUInt16LE(0, 36); // internal attrs
    ch.writeUInt32LE(isDir ? 0x10 : 0x20, 38); // external attrs: DOS dir / archive
    ch.writeUInt32LE(offset, 42);
    central.push(ch, name);
    offset += lh.length + name.length + body.length;
  }
  const cd = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(sorted.length, 8);
  end.writeUInt16LE(sorted.length, 10);
  end.writeUInt32LE(cd.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...local, cd, end]);
}

// ---- 5. Per-skill zips: the skill folder is the zip root (Claude Help Center rule) ----
const perSkill = new Map();
for (const skill of SKILLS) {
  const entries = [{ name: `${skill}/` }];
  for (const f of skillFiles.filter((x) => x.skill === skill)) {
    for (const dir of dirsOf(`${skill}/${f.rel}`)) entries.push({ name: dir });
    entries.push({ name: `${skill}/${f.rel}`, data: f.buf });
  }
  entries.push({ name: `${skill}/LICENSE.txt`, data: LICENSE });
  entries.push({ name: `${skill}/NOTICE.txt`, data: NOTICE });
  perSkill.set(skill, makeZip(dedupe(entries)));
}
function dirsOf(file) {
  const parts = file.split("/").slice(0, -1);
  return parts.map((_, i) => `${parts.slice(0, i + 1).join("/")}/`);
}
function dedupe(entries) {
  const seen = new Set();
  return entries.filter((e) => (seen.has(e.name) ? false : (seen.add(e.name), true)));
}

// ---- 6. The bundle ----
const bundleEntries = [
  { name: "INSTALL.md", data: INSTALL },
  { name: "LICENSE", data: LICENSE },
  { name: "NOTICE.txt", data: NOTICE },
  { name: "SOURCE.md", data: SOURCE },
  { name: `${BUNDLE_SKILLS_DIR}/` },
  { name: `${BUNDLE_UPLOAD_DIR}/` },
];
for (const f of skillFiles) {
  for (const dir of dirsOf(`${BUNDLE_SKILLS_DIR}/${f.skill}/${f.rel}`)) bundleEntries.push({ name: dir });
  bundleEntries.push({ name: `${BUNDLE_SKILLS_DIR}/${f.skill}/${f.rel}`, data: f.buf });
}
for (const [skill, zip] of perSkill) bundleEntries.push({ name: `${BUNDLE_UPLOAD_DIR}/${skill}.zip`, data: zip });
const bundle = makeZip(dedupe(bundleEntries));

// ---- 7. Write outputs and manifest ----
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const outputs = [[BUNDLE_NAME, bundle], ...[...perSkill].map(([s, z]) => [`${s}.zip`, z])];
for (const [name, buf] of outputs) fs.writeFileSync(path.join(OUT_DIR, name), buf);
const sums = outputs.map(([name, buf]) => `${sha256(buf)}  ${name}`).join("\n") + "\n";
fs.writeFileSync(path.join(OUT_DIR, "SHA256SUMS.txt"), sums);

const manifest = {
  upstream: { repo: REPO, path: UPSTREAM_DIR, commit: PIN_SHA, commitDate: PIN_DATE_ISO, tree: treeUrl, noticeFiles },
  licence: { file: `${UPSTREAM_DIR}/LICENSE`, sha256: sha256(LICENSE), spdx: "Apache-2.0" },
  skills: skillFiles.map((f) => ({
    file: `${UPSTREAM_DIR}/skills/${f.skill}/${f.rel}`,
    bytes: f.buf.length,
    sha256: sha256(f.buf),
    gitBlob: gitBlobId(f.buf),
  })),
  packaging: [
    ["INSTALL.md", INSTALL],
    ["NOTICE.txt", NOTICE],
    ["SOURCE.md", SOURCE],
  ].map(([name, buf]) => ({ file: name, bytes: buf.length, sha256: sha256(buf) })),
  outputs: outputs.map(([name, buf]) => ({ file: `skills/downloads/${name}`, bytes: buf.length, sha256: sha256(buf) })),
};
fs.writeFileSync(path.join(EVIDENCE_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
for (const o of manifest.outputs) say(`${o.sha256}  ${o.bytes} B  ${o.file}`);

if (KEEP_SCRATCH) say(`kept scratch checkout: ${checkout}`);
else fs.rmSync(scratch, { recursive: true, force: true });
fs.rmSync(noHooks, { recursive: true, force: true });
fs.writeFileSync(path.join(EVIDENCE_DIR, "build-log.txt"), log.join("\n") + "\n");

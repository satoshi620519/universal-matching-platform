#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(new URL("../..", import.meta.url).pathname);
const outputDir = resolve(process.env.RELEASE_OUTPUT_DIR ?? join(repoRoot, "release-artifacts"));
const releaseRef = process.env.RELEASE_REF ?? "HEAD";
const archiveBase = process.env.RELEASE_ARCHIVE_NAME ?? `universal-matching-platform-${releaseRef.slice(0, 12)}`;
const archivePath = join(outputDir, `${archiveBase}.tar.gz`);
const checksumPath = `${archivePath}.sha256`;

const forbidden = [
  /^\.env(?:\..*)?$/,
  /(^|\/)\.env(?:\..*)?$/,
  /(^|\/)(?:node_modules|\.git|dist|build|coverage|release-artifacts)(\/|$)/,
  /(^|\/)(?:.*\.(?:pem|key|p12|pfx|crt))$/i,
];

function runGit(args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();
}

function fail(message) {
  console.error(`Release archive refused: ${message}`);
  process.exit(1);
}

if (!statSync(repoRoot).isDirectory()) fail("repository root is unavailable");

const resolvedRef = runGit(["rev-parse", "--verify", `${releaseRef}^{commit}`]);
const trackedFiles = runGit(["ls-tree", "-r", "--name-only", resolvedRef])
  .split("\n")
  .filter(Boolean);
const violations = trackedFiles.filter((file) => forbidden.some((pattern) => pattern.test(file)));
if (violations.length) fail(`forbidden tracked files detected:\n- ${violations.join("\n- ")}`);

mkdirSync(outputDir, { recursive: true });
runGit(["archive", "--format=tar.gz", `--prefix=${archiveBase}/`, resolvedRef]);

// git archive writes to stdout, so rerun it with an explicit output file.
const archiveBytes = execFileSync("git", ["archive", "--format=tar.gz", `--prefix=${archiveBase}/`, resolvedRef]);
writeFileSync(archivePath, archiveBytes);

const digest = createHash("sha256").update(readFileSync(archivePath)).digest("hex");
writeFileSync(checksumPath, `${digest}  ${archiveBase}.tar.gz\n`);

const licensePresent = trackedFiles.some((file) => file === "LICENSE");
if (!licensePresent) {
  console.warn("WARNING: LICENSE is not present; archive created for pre-license verification only.");
}

console.log(`Release ref: ${resolvedRef}`);
console.log(`Archive: ${archivePath}`);
console.log(`SHA-256: ${digest}`);
console.log(`Checksum: ${checksumPath}`);

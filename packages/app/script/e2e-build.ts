const args = process.argv.slice(2)
const specs = args.length ? args : ["e2e/prompt/prompt.spec.ts", "e2e/prompt/prompt-async.spec.ts"]

const proc = Bun.spawn(["bun", "script/e2e-local.ts", ...specs], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    OPENCODE_E2E_BUILD: "1",
  },
  stdout: "inherit",
  stderr: "inherit",
})

process.exit(await proc.exited)

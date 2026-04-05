import type { PermissionRuleset } from "@opencode-ai/sdk/v2/client"

export const BONUS_ROOT = ".bonus"
export const BONUS_README = `${BONUS_ROOT}/README.md`
export const BONUS_SOURCE_DIR = `${BONUS_ROOT}/source`
export const BONUS_SPEC_DIR = `${BONUS_ROOT}/spec`
export const BONUS_CONFORMANCE_DIR = `${BONUS_ROOT}/conformance`
export const BONUS_PROVENANCE_DIR = `${BONUS_ROOT}/provenance`
export const BONUS_IMPLEMENTATION_DIR = `${BONUS_ROOT}/implementation`
export const BONUS_TESTS_DIR = `${BONUS_ROOT}/tests`
export const BONUS_DOCS_DIR = `${BONUS_ROOT}/docs`
export const BONUS_NOTES_DIR = `${BONUS_ROOT}/notes`

export type BonusWorkflowPreset = "analysis" | "cleanroom"

function normalizeAbsolute(input: string) {
  return input.replaceAll("\\", "/")
}

function absolutePath(directory: string, relativePath: string) {
  const root = normalizeAbsolute(directory).replace(/\/+$/, "")
  const child = normalizeAbsolute(relativePath).replace(/^\/+/, "")
  return `${root}/${child}`
}

function absoluteTree(directory: string, relativePath: string) {
  const root = absolutePath(directory, relativePath)
  return [root, `${root}/*`] as const
}

function relativeTree(relativePath: string) {
  return [relativePath, `${relativePath}*`] as const
}

export function bonusWorkflowTitle(preset: BonusWorkflowPreset) {
  if (preset === "analysis") return "BONUS Analysis Lane"
  return "BONUS Clean Room Lane"
}

export function bonusWorkflowAgent(preset: BonusWorkflowPreset) {
  if (preset === "analysis") return "analysis"
  return "cleanroom"
}

export function createBonusSessionPermissions(input: {
  directory: string
  preset: BonusWorkflowPreset
}): PermissionRuleset {
  const sourceTree = absoluteTree(input.directory, BONUS_SOURCE_DIR)
  const implementationTree = absoluteTree(input.directory, BONUS_IMPLEMENTATION_DIR)

  if (input.preset === "analysis") {
    return [
      { permission: "read", action: "deny", pattern: implementationTree[0] },
      { permission: "read", action: "deny", pattern: implementationTree[1] },
      { permission: "list", action: "deny", pattern: implementationTree[0] },
      { permission: "list", action: "deny", pattern: implementationTree[1] },
      { permission: "edit", action: "deny", pattern: "*" },
      { permission: "edit", action: "allow", pattern: BONUS_README },
      ...relativeTree(BONUS_SPEC_DIR).map((pattern) => ({ permission: "edit", action: "allow" as const, pattern })),
      ...relativeTree(BONUS_CONFORMANCE_DIR).map((pattern) => ({
        permission: "edit",
        action: "allow" as const,
        pattern,
      })),
      ...relativeTree(BONUS_PROVENANCE_DIR).map((pattern) => ({
        permission: "edit",
        action: "allow" as const,
        pattern,
      })),
      ...relativeTree(BONUS_NOTES_DIR).map((pattern) => ({ permission: "edit", action: "allow" as const, pattern })),
    ]
  }

  return [
    { permission: "bash", action: "deny", pattern: "*" },
    { permission: "glob", action: "deny", pattern: "*" },
    { permission: "grep", action: "deny", pattern: "*" },
    { permission: "lsp", action: "deny", pattern: "*" },
    { permission: "task", action: "deny", pattern: "*" },
    { permission: "skill", action: "deny", pattern: "*" },
    { permission: "webfetch", action: "deny", pattern: "*" },
    { permission: "websearch", action: "deny", pattern: "*" },
    { permission: "codesearch", action: "deny", pattern: "*" },
    { permission: "read", action: "deny", pattern: sourceTree[0] },
    { permission: "read", action: "deny", pattern: sourceTree[1] },
    { permission: "list", action: "deny", pattern: sourceTree[0] },
    { permission: "list", action: "deny", pattern: sourceTree[1] },
    { permission: "edit", action: "deny", pattern: "*" },
    { permission: "edit", action: "allow", pattern: BONUS_README },
    ...relativeTree(BONUS_IMPLEMENTATION_DIR).map((pattern) => ({
      permission: "edit",
      action: "allow" as const,
      pattern,
    })),
    ...relativeTree(BONUS_TESTS_DIR).map((pattern) => ({ permission: "edit", action: "allow" as const, pattern })),
    ...relativeTree(BONUS_DOCS_DIR).map((pattern) => ({ permission: "edit", action: "allow" as const, pattern })),
  ]
}

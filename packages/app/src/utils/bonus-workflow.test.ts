import { describe, expect, test } from "bun:test"
import {
  BONUS_IMPLEMENTATION_DIR,
  BONUS_SOURCE_DIR,
  bonusWorkflowAgent,
  bonusWorkflowTitle,
  createBonusSessionPermissions,
} from "./bonus-workflow"

describe("bonus workflow helpers", () => {
  test("maps workflow presets to visible labels", () => {
    expect(bonusWorkflowTitle("analysis")).toBe("BONUS Analysis Lane")
    expect(bonusWorkflowTitle("cleanroom")).toBe("BONUS Clean Room Lane")
    expect(bonusWorkflowAgent("analysis")).toBe("analysis")
    expect(bonusWorkflowAgent("cleanroom")).toBe("cleanroom")
  })

  test("locks the analysis lane out of implementation files", () => {
    const rules = createBonusSessionPermissions({
      directory: "C:\\repo",
      preset: "analysis",
    })

    expect(rules).toContainEqual({
      permission: "read",
      action: "deny",
      pattern: `C:/repo/${BONUS_IMPLEMENTATION_DIR}`,
    })
    expect(rules).toContainEqual({
      permission: "edit",
      action: "allow",
      pattern: ".bonus/spec*",
    })
  })

  test("normalizes trailing separators in absolute permission paths", () => {
    const rules = createBonusSessionPermissions({
      directory: "C:\\repo\\",
      preset: "analysis",
    })

    expect(rules).toContainEqual({
      permission: "read",
      action: "deny",
      pattern: `C:/repo/${BONUS_IMPLEMENTATION_DIR}`,
    })
  })

  test("locks the cleanroom lane away from source materials and shell access", () => {
    const rules = createBonusSessionPermissions({
      directory: "C:\\repo",
      preset: "cleanroom",
    })

    expect(rules).toContainEqual({
      permission: "bash",
      action: "deny",
      pattern: "*",
    })
    expect(rules).toContainEqual({
      permission: "read",
      action: "deny",
      pattern: `C:/repo/${BONUS_SOURCE_DIR}`,
    })
    expect(rules).toContainEqual({
      permission: "edit",
      action: "allow",
      pattern: ".bonus/implementation*",
    })
  })
})

import { For, Show, createMemo } from "solid-js"
import { DateTime } from "luxon"
import { useSync } from "@/context/sync"
import { useSDK } from "@/context/sdk"
import { useLanguage } from "@/context/language"
import { useLocal } from "@/context/local"
import { Icon } from "@opencode-ai/ui/icon"
import { Mark } from "@opencode-ai/ui/logo"
import { getDirectory, getFilename } from "@opencode-ai/util/path"
import {
  BONUS_CONFORMANCE_DIR,
  BONUS_IMPLEMENTATION_DIR,
  BONUS_SOURCE_DIR,
  BONUS_SPEC_DIR,
  bonusWorkflowAgent,
  type BonusWorkflowPreset,
} from "@/utils/bonus-workflow"

const MAIN_WORKTREE = "main"
const CREATE_WORKTREE = "create"
const ROOT_CLASS = "size-full flex flex-col"

interface NewSessionViewProps {
  worktree: string
  workflow?: BonusWorkflowPreset
  onWorkflowSelect?: (workflow: BonusWorkflowPreset) => void
}

export function NewSessionView(props: NewSessionViewProps) {
  const sync = useSync()
  const sdk = useSDK()
  const language = useLanguage()
  const local = useLocal()

  const workflows: Array<{
    id: BonusWorkflowPreset
    title: string
    description: string
    bullets: string[]
  }> = [
    {
      id: "analysis",
      title: "Analysis lane",
      description: "Inspect materials in .bonus/source and extract a spec, conformance suite, and provenance.",
      bullets: [
        `Read from ${BONUS_SOURCE_DIR}`,
        `Write specs to ${BONUS_SPEC_DIR}`,
        `Write fixtures to ${BONUS_CONFORMANCE_DIR}`,
      ],
    },
    {
      id: "cleanroom",
      title: "Clean-room lane",
      description: "Implement a fresh codebase from the spec without reading uploaded source materials.",
      bullets: [
        `Blocked from ${BONUS_SOURCE_DIR}`,
        `Implement in ${BONUS_IMPLEMENTATION_DIR}`,
        "Use only the spec and conformance outputs",
      ],
    },
  ]

  const sandboxes = createMemo(() => sync.project?.sandboxes ?? [])
  const options = createMemo(() => [MAIN_WORKTREE, ...sandboxes(), CREATE_WORKTREE])
  const current = createMemo(() => {
    const selection = props.worktree
    if (options().includes(selection)) return selection
    return MAIN_WORKTREE
  })
  const projectRoot = createMemo(() => sync.project?.worktree ?? sdk.directory)
  const isWorktree = createMemo(() => {
    const project = sync.project
    if (!project) return false
    return sdk.directory !== project.worktree
  })

  const label = (value: string) => {
    if (value === MAIN_WORKTREE) {
      if (isWorktree()) return language.t("session.new.worktree.main")
      const branch = sync.data.vcs?.branch
      if (branch) return language.t("session.new.worktree.mainWithBranch", { branch })
      return language.t("session.new.worktree.main")
    }

    if (value === CREATE_WORKTREE) return language.t("session.new.worktree.create")

    return getFilename(value)
  }

  return (
    <div class={ROOT_CLASS}>
      <div class="h-12 shrink-0" aria-hidden />
      <div class="flex-1 px-6 pb-30 flex items-center justify-center">
        <div class="w-full max-w-5xl flex flex-col items-center gap-8">
          {/* Header Section */}
          <div class="flex flex-col items-center gap-4 text-center">
            <div class="relative">
              <Mark class="w-12 opacity-90" />
              <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
            </div>
            <div class="flex flex-col gap-2">
              <h1 class="text-24-bold text-text-strong tracking-tight">
                {language.t("session.new.title")}
              </h1>
              <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <span class="text-11-medium text-blue-400 uppercase tracking-wider">Clean Room as a Service</span>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div class="flex flex-col gap-2 items-center">
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-base border border-border-weak-base">
              <Icon name="folder" size="small" class="text-text-weak" />
              <div class="text-12-medium text-text-weak select-text">
                {getDirectory(projectRoot())}
                <span class="text-text-strong">{getFilename(projectRoot())}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 px-3 py-1 rounded-md bg-surface-base/50">
              <Icon name="branch" size="small" class="text-text-weak" />
              <div class="text-11-medium text-text-weak select-text">
                {label(current())}
              </div>
            </div>
          </div>

          {/* Main Workflow Section */}
          <div class="w-full max-w-4xl">
            {/* Workflow Header */}
            <div class="mb-6 p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                  <span class="text-20-bold text-white">B</span>
                </div>
                <div class="flex-1">
                  <div class="text-16-bold text-text-strong mb-2">BONUS Workflow</div>
                  <div class="text-13-regular text-text-weak leading-relaxed mb-3">
                    Upload inspectable materials to <code class="px-2 py-0.5 rounded bg-surface-raised-base text-blue-400 text-11-mono">{BONUS_SOURCE_DIR}</code>, then select your lane. Session permissions persist after creation.
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <div class="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-10-medium border border-amber-500/20">
                      1. Upload Source
                    </div>
                    <div class="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-10-medium border border-blue-500/20">
                      2. Analysis Lane
                    </div>
                    <div class="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-10-medium border border-cyan-500/20">
                      3. Clean-Room Lane
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lane Selection Cards */}
            <div class="grid md:grid-cols-2 gap-4">
              <For each={workflows}>
                {(workflow) => {
                  const selected = () => props.workflow === workflow.id
                  const isAnalysis = workflow.id === "analysis"
                  const accentColor = isAnalysis ? "amber" : "cyan"

                  return (
                    <button
                      type="button"
                      class="relative rounded-2xl border p-6 text-left transition-all duration-300 group overflow-hidden"
                      classList={{
                        "border-border-weak-base bg-surface-base hover:bg-surface-raised-base hover:border-border-base hover:shadow-lg": !selected(),
                        "border-2 bg-surface-raised-base shadow-xl": selected(),
                        "hover:border-amber-500/50": !selected() && isAnalysis,
                        "hover:border-cyan-500/50": !selected() && !isAnalysis,
                        "border-amber-500": selected() && isAnalysis,
                        "border-cyan-500": selected() && !isAnalysis,
                      }}
                      onClick={() => {
                        props.onWorkflowSelect?.(workflow.id)
                        local.agent.set(bonusWorkflowAgent(workflow.id))
                      }}
                    >
                      {/* Accent gradient background */}
                      <div
                        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        classList={{
                          "bg-gradient-to-br from-amber-500/5 to-amber-500/0": isAnalysis,
                          "bg-gradient-to-br from-cyan-500/5 to-cyan-500/0": !isAnalysis,
                        }}
                      />

                      {/* Content */}
                      <div class="relative z-10">
                        {/* Header */}
                        <div class="flex items-start justify-between gap-3 mb-4">
                          <div class="flex items-center gap-3">
                            <div
                              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                              classList={{
                                "bg-amber-500/20 text-amber-400": isAnalysis,
                                "bg-cyan-500/20 text-cyan-400": !isAnalysis,
                              }}
                            >
                              <span class="text-16-bold">{isAnalysis ? "A" : "C"}</span>
                            </div>
                            <div class="text-15-bold text-text-strong">{workflow.title}</div>
                          </div>
                          <Show when={selected()}>
                            <div
                              class="px-2.5 py-1 rounded-full text-10-bold uppercase tracking-wide"
                              classList={{
                                "bg-amber-500 text-white": isAnalysis,
                                "bg-cyan-500 text-white": !isAnalysis,
                              }}
                            >
                              Active
                            </div>
                          </Show>
                        </div>

                        {/* Description */}
                        <div class="text-13-regular text-text-weak leading-relaxed mb-4">
                          {workflow.description}
                        </div>

                        {/* Capabilities */}
                        <div class="flex flex-col gap-2">
                          <div class="text-11-medium text-text-weak uppercase tracking-wide mb-1">Capabilities</div>
                          <For each={workflow.bullets}>
                            {(item) => (
                              <div class="flex items-start gap-2">
                                <div
                                  class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                  classList={{
                                    "bg-amber-400": isAnalysis,
                                    "bg-cyan-400": !isAnalysis,
                                  }}
                                />
                                <div class="text-12-regular text-text-weak flex-1">{item}</div>
                              </div>
                            )}
                          </For>
                        </div>

                        {/* Selection indicator */}
                        <Show when={selected()}>
                          <div class="mt-4 pt-4 border-t border-border-weak-base">
                            <div class="flex items-center gap-2 text-11-medium text-text-weak">
                              <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              Lane configured and ready
                            </div>
                          </div>
                        </Show>
                      </div>
                    </button>
                  )
                }}
              </For>
            </div>
          </div>

          {/* Footer Info */}
          <Show when={sync.project}>
            {(project) => (
              <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-base/50 border border-border-weak-base/50">
                <Icon name="pencil-line" size="small" class="text-text-weak" />
                <div class="text-11-medium text-text-weak">
                  {language.t("session.new.lastModified")}&nbsp;
                  <span class="text-text-strong">
                    {DateTime.fromMillis(project().time.updated ?? project().time.created)
                      .setLocale(language.intl())
                      .toRelative()}
                  </span>
                </div>
              </div>
            )}
          </Show>
        </div>
      </div>
    </div>
  )
}

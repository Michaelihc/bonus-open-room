import { createMemo, For, Match, Switch } from "solid-js"
import { Button } from "@opencode-ai/ui/button"
import { Logo } from "@opencode-ai/ui/logo"
import { useLayout } from "@/context/layout"
import { useNavigate } from "@solidjs/router"
import { base64Encode } from "@opencode-ai/util/encode"
import { Icon } from "@opencode-ai/ui/icon"
import { usePlatform } from "@/context/platform"
import { DateTime } from "luxon"
import { useDialog } from "@opencode-ai/ui/context/dialog"
import { DialogSelectDirectory } from "@/components/dialog-select-directory"
import { DialogSelectServer } from "@/components/dialog-select-server"
import { useServer } from "@/context/server"
import { useGlobalSync } from "@/context/global-sync"
import { useLanguage } from "@/context/language"

export default function Home() {
  const sync = useGlobalSync()
  const layout = useLayout()
  const platform = usePlatform()
  const dialog = useDialog()
  const navigate = useNavigate()
  const server = useServer()
  const language = useLanguage()
  const homedir = createMemo(() => sync.data.path.home)
  const recent = createMemo(() => {
    return sync.data.project
      .slice()
      .sort((a, b) => (b.time.updated ?? b.time.created) - (a.time.updated ?? a.time.created))
      .slice(0, 5)
  })

  const serverDotClass = createMemo(() => {
    const healthy = server.healthy()
    if (healthy === true) return "bg-icon-success-base"
    if (healthy === false) return "bg-icon-critical-base"
    return "bg-border-weak-base"
  })

  function openProject(directory: string) {
    layout.projects.open(directory)
    server.projects.touch(directory)
    navigate(`/${base64Encode(directory)}`)
  }

  async function chooseProject() {
    function resolve(result: string | string[] | null) {
      if (Array.isArray(result)) {
        for (const directory of result) {
          openProject(directory)
        }
      } else if (result) {
        openProject(result)
      }
    }

    if (platform.openDirectoryPickerDialog && server.isLocal()) {
      const result = await platform.openDirectoryPickerDialog?.({
        title: language.t("command.project.open"),
        multiple: true,
      })
      resolve(result)
    } else {
      dialog.show(
        () => <DialogSelectDirectory multiple={true} onSelect={resolve} />,
        () => resolve(null),
      )
    }
  }

  return (
    <div class="mx-auto w-full flex flex-col items-center px-4 py-8">
      {/* BONUS Branding */}
      <div class="text-center" style={{ "margin-top": "-20px", "margin-bottom": "8px" }}>
        <h1 class="tracking-tight" style={{ "font-size": "48px", "font-weight": "bold", "color": "#22c55e", "line-height": "1" }}>
          BONUS
        </h1>
        <div class="text-11-medium text-text-weak uppercase tracking-widest mt-1">
          Clean Room as a Service
        </div>
      </div>

      {/* Powered by OpenCode */}
      <div class="flex items-center gap-2 mb-8 opacity-60 hover:opacity-100 transition-opacity">
        <span class="text-10-regular text-text-weak">powered by</span>
        <Logo class="h-4" />
      </div>

      {/* Hero Description */}
      <div class="w-full max-w-xl mb-10 text-center">
        <p class="text-13-regular text-text-weak leading-relaxed">
          Build legally clean implementations from closed-source materials using isolated analysis and clean-room development lanes
        </p>
      </div>

      {/* Workflow Overview Cards - Clickable */}
      <div class="w-full max-w-5xl mb-10">
        <div class="text-11-medium text-text-weak uppercase tracking-wider mb-3 text-center">Select a workflow to start</div>
        <div class="grid md:grid-cols-3 gap-3">
          {/* Step 1 - Upload Materials */}
          <Button
            variant="ghost"
            class="relative p-5 rounded-xl bg-surface-base border border-border-weak-base hover:border-amber-500 hover:bg-amber-500/5 transition-all text-left h-auto group"
            onClick={chooseProject}
          >
            <div class="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-amber-500 text-background-base flex items-center justify-center text-13-bold shadow-lg">
              1
            </div>
            <div class="flex flex-col gap-2 w-full min-w-0">
              <div class="text-13-bold text-text-strong">Upload Materials</div>
              <div class="text-11-regular text-text-weak card-text-wrap">
                Place closed-source SDKs, docs, and samples in <code class="px-1 py-0.5 rounded bg-surface-raised-base text-amber-400 text-10-mono">.bonus/source/</code>
              </div>
              <div class="flex items-center justify-between mt-1">
                <Icon name="folder-add-left" size="small" class="text-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                <span class="text-10-medium text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">Open Project →</span>
              </div>
            </div>
          </Button>

          {/* Step 2 - Analysis Lane */}
          <Button
            variant="ghost"
            class="relative p-5 rounded-xl bg-surface-base border border-border-weak-base hover:border-blue-500 hover:bg-blue-500/5 transition-all text-left h-auto group"
            onClick={chooseProject}
          >
            <div class="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-blue-500 text-background-base flex items-center justify-center text-13-bold shadow-lg">
              2
            </div>
            <div class="flex flex-col gap-2 w-full min-w-0">
              <div class="text-13-bold text-text-strong">Analysis Lane</div>
              <div class="text-11-regular text-text-weak card-text-wrap">
                Extract specifications and conformance tests from source
              </div>
              <div class="flex items-center justify-between mt-1">
                <div class="flex gap-1.5">
                  <div class="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-9-medium">READ</div>
                  <div class="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-9-medium">SPEC</div>
                  <div class="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-9-medium">TESTS</div>
                </div>
                <span class="text-10-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Start Analysis →</span>
              </div>
            </div>
          </Button>

          {/* Step 3 - Clean-Room Lane */}
          <Button
            variant="ghost"
            class="relative p-5 rounded-xl bg-surface-base border border-border-weak-base hover:border-cyan-500 hover:bg-cyan-500/5 transition-all text-left h-auto group"
            onClick={chooseProject}
          >
            <div class="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-cyan-500 text-background-base flex items-center justify-center text-13-bold shadow-lg">
              3
            </div>
            <div class="flex flex-col gap-2 w-full min-w-0">
              <div class="text-13-bold text-text-strong">Clean-Room Lane</div>
              <div class="text-11-regular text-text-weak card-text-wrap">
                Implement fresh code from specs, blocked from source
              </div>
              <div class="flex items-center justify-between mt-1">
                <div class="flex gap-1.5">
                  <div class="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-9-medium">BLOCKED</div>
                  <div class="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-9-medium">IMPLEMENT</div>
                </div>
                <span class="text-10-medium text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">Start Clean-Room →</span>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Server Status */}
      <div class="mb-8">
        <Button
          size="large"
          variant="ghost"
          class="text-14-regular text-text-weak hover:text-text-strong transition-colors"
          onClick={() => dialog.show(() => <DialogSelectServer />)}
        >
          <div
            classList={{
              "size-2 rounded-full": true,
              [serverDotClass()]: true,
            }}
          />
          {server.name}
        </Button>
      </div>

      {/* Projects Section */}
      <div class="w-full max-w-3xl">
        <Switch>
          <Match when={sync.data.project.length > 0}>
            <div class="flex flex-col gap-4">
              <div class="flex gap-2 items-center justify-between px-3">
                <div class="text-14-medium text-text-strong">{language.t("home.recentProjects")}</div>
                <Button icon="folder-add-left" size="normal" class="pl-2 pr-3" onClick={chooseProject}>
                  {language.t("command.project.open")}
                </Button>
              </div>
              <ul class="flex flex-col gap-2">
                <For each={recent()}>
                  {(project) => (
                    <Button
                      size="large"
                      variant="ghost"
                      class="text-14-mono text-left justify-between px-3 hover:bg-surface-raised-base-hover transition-colors"
                      onClick={() => openProject(project.worktree)}
                    >
                      {project.worktree.replace(homedir(), "~")}
                      <div class="text-14-regular text-text-weak">
                        {DateTime.fromMillis(project.time.updated ?? project.time.created).toRelative()}
                      </div>
                    </Button>
                  )}
                </For>
              </ul>
            </div>
          </Match>
          <Match when={!sync.ready}>
            <div class="flex flex-col items-center gap-4">
              <div class="text-12-regular text-text-weak">{language.t("common.loading")}</div>
              <Button class="px-4 py-2" onClick={chooseProject}>
                {language.t("command.project.open")}
              </Button>
            </div>
          </Match>
          <Match when={true}>
            <div class="flex flex-col items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30">
                <Icon name="folder-add-left" size="large" class="text-blue-400" />
              </div>
              <div class="flex flex-col gap-2 items-center justify-center text-center">
                <div class="text-16-medium text-text-strong">{language.t("home.empty.title")}</div>
                <div class="text-13-regular text-text-weak max-w-md">
                  {language.t("home.empty.description")}
                </div>
              </div>
              <Button class="px-6 py-2.5 mt-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors" onClick={chooseProject}>
                {language.t("command.project.open")}
              </Button>
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  )
}

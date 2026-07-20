# Rebuild directory junctions between the repo-tracked `app/` tree and the
# local WTP project source at `../<local-module>/`.
#
# When this is useful:
#   - After a fresh clone on the dev machine that also has the local WTP project.
#   - After junctions get broken (rare — e.g. anti-virus, disk repair).
#
# Not needed on machines that only have the cloned repo (no local WTP project).
# In that case, `app/` is just real files and works standalone.
#
# Prerequisites: the local WTP project folder must exist next to `app/`.
# The default target is discovered by looking for a sibling folder that
# contains `src/main/java/cres/pss`.

param(
  [string]$RepoRoot = (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Definition)),
  [string]$LocalProject
)

function Fail($msg) { Write-Error $msg; exit 1 }

Set-Location $RepoRoot

if (-not $LocalProject) {
  $candidates = Get-ChildItem -Directory | Where-Object {
    $_.Name -ne 'app' -and (Test-Path "$($_.FullName)\src\main\java\cres\pss")
  }
  if ($candidates.Count -eq 0) {
    Fail "No sibling local WTP project found (need one with src\main\java\cres\pss). Pass -LocalProject <path> to override."
  }
  if ($candidates.Count -gt 1) {
    Fail ("Multiple candidates found: " + ($candidates.Name -join ', ') + ". Pass -LocalProject <path>.")
  }
  $LocalProject = $candidates[0].FullName
}
if (-not (Test-Path "$LocalProject\src\main\java\cres\pss")) {
  Fail "Local project at $LocalProject does not contain src\main\java\cres\pss"
}

$links = @(
  @{ Link = "$RepoRoot\app\src\main\java\cres\pss";                   Target = "$LocalProject\src\main\java\cres\pss" },
  @{ Link = "$RepoRoot\app\src\main\webapp\pss";                      Target = "$LocalProject\src\main\webapp\pss" },
  @{ Link = "$RepoRoot\app\src\main\webapp\WEB-INF\jsp\pss";          Target = "$LocalProject\src\main\webapp\WEB-INF\jsp\pss" }
)

Write-Output "Local project: $LocalProject"
Write-Output "Repo root:     $RepoRoot"
Write-Output ""

foreach ($l in $links) {
  $link   = $l.Link
  $target = $l.Target

  if (-not (Test-Path $target)) {
    Fail "Target missing: $target"
  }

  if (Test-Path $link) {
    $item = Get-Item $link -Force
    if ($item.LinkType -eq 'Junction') {
      if ($item.Target[0] -eq $target) {
        Write-Output "OK        $link"
        continue
      }
      Write-Output "REPLACING $link (was junction to $($item.Target))"
      Remove-Item $link -Force
    } else {
      Write-Output "REPLACING $link (real dir -> junction)"
      Remove-Item $link -Recurse -Force
    }
  }

  $parent = Split-Path $link -Parent
  if (-not (Test-Path $parent)) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }

  New-Item -ItemType Junction -Path $link -Target $target | Out-Null
  Write-Output "CREATED   $link -> $target"
}

Write-Output ""
Write-Output "Done. Verify with: git status (should show no changes if content matches)."

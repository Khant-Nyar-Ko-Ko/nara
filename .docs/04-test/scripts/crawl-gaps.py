"""Digest freshness NFR: hours between successful crawl runs.

Reads the GitHub Actions history of .github/workflows/crawl.yml with the
GitHub CLI and prints each run in Thailand time with the gap since the previous
successful run.

    python3 .docs/04-test/scripts/crawl-gaps.py                       # all runs since 3 Nov
    python3 .docs/04-test/scripts/crawl-gaps.py 2026-11-17T08:00:00Z  # runs since a time (UTC)

Needs `gh` signed in to an account that can read Khant-Nyar-Ko-Ko/nara.
"""

import datetime as dt
import json
import subprocess
import sys

REPO = "Khant-Nyar-Ko-Ko/nara"
SINCE = sys.argv[1] if len(sys.argv) > 1 else "2026-11-03T00:00:00Z"
TH = dt.timezone(dt.timedelta(hours=7))

runs = json.loads(subprocess.check_output([
    "gh", "api", "--paginate",
    f"repos/{REPO}/actions/workflows/crawl.yml/runs?per_page=100&created=>={SINCE}",
    "--jq", "[.workflow_runs[] | {id, event, head_branch, conclusion, created_at}]",
]))
runs.sort(key=lambda r: r["created_at"])

gaps, prev = [], None
print("started (Thai time)   event              branch  result   gap since previous success")
for r in runs:
    t = dt.datetime.fromisoformat(r["created_at"].replace("Z", "+00:00"))
    gap = ""
    if r["conclusion"] == "success":
        if prev is not None:
            hours = (t - prev).total_seconds() / 3600
            gaps.append(hours)
            gap = f"{hours:.2f} h"
        prev = t
    print(f"{t.astimezone(TH):%a %d %b %H:%M}      {r['event']:<18} {r['head_branch']:<7} {r['conclusion'] or 'running':<8} {gap}")

if gaps:
    print(f"\n{len(gaps)} gaps · average {sum(gaps) / len(gaps):.2f} h · longest {max(gaps):.2f} h · "
          f"{sum(g <= 3 for g in gaps)} of {len(gaps)} at 3 h or less")

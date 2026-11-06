import { findings } from "../fixtures/findings";
import { createEvaluator } from "../lib/jef";
import { severityLabel, triageFinding, type Finding, type TriageResult } from "../lib/triage";

export const dynamic = "force-dynamic";

const SOURCE_LABEL = {
  gateway: "閘道 · rp_app",
  firmware: "韌體 · firmware-research-demo",
} as const;

const TEAM_LABEL = {
  gateway: "閘道",
  firmware: "韌體",
  appsec: "應用安全",
} as const;

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function FindingCard({ finding, result }: { finding: Finding; result: TriageResult }) {
  const answers = result.answers;

  return (
    <article>
      <p className="source">{SOURCE_LABEL[finding.source]}</p>
      <h2>{finding.title}</h2>
      <p className="detail">{finding.detail}</p>
      <div className="status">
        <strong>需要人工覆核</strong>
        {result.unavailable || !answers ? (
          <p>JEF 沒有回應。這筆沒有分數。</p>
        ) : (
          <p>分數描述分布有多集中。daemon 不執行處置。</p>
        )}
      </div>
      {answers ? (
        <dl>
          <div>
            <dt>緊急</dt>
            <dd>
              {percent(answers.urgent)}
              <small>集中度 {percent(answers.urgentConfidence)}</small>
            </dd>
          </div>
          <div>
            <dt>團隊</dt>
            <dd>
              {TEAM_LABEL[answers.team]}
              <small>集中度 {percent(answers.teamConfidence)}</small>
            </dd>
          </div>
          <div>
            <dt>嚴重度</dt>
            <dd>
              {answers.severity.toFixed(1)}
              <small>
                接近{severityLabel(answers.severity)} · 集中度 {percent(answers.severityConfidence)}
              </small>
            </dd>
          </div>
        </dl>
      ) : null}
    </article>
  );
}

export default async function Page() {
  const evaluate = createEvaluator();
  const results = await Promise.all(findings.map((finding) => triageFinding(finding, evaluate)));

  return (
    <main>
      <header>
        <div className="mark" aria-hidden="true" />
        <h1>The Fire Daemon</h1>
        <p>閘道事件與韌體摘要送到 JEF 分級。兩份上游維持在自己的 tag，這裡只做裁決。</p>
      </header>
      <section className="grid">
        {findings.map((finding, index) => (
          <FindingCard key={finding.id} finding={finding} result={results[index]!} />
        ))}
      </section>
    </main>
  );
}

export const TEAMS = ["gateway", "firmware", "appsec"] as const;

export type Team = (typeof TEAMS)[number];

export const SEVERITY_LEVELS = ["資訊", "低", "中", "高", "危急"] as const;

export type Finding = {
  id: string;
  source: "gateway" | "firmware";
  title: string;
  detail: string;
};

export type QuestionSet = {
  state: string;
  urgent: string;
  teamPrompt: string;
  teamOptions: Record<Team, string>;
  severityPrompt: string;
  severityLevels: typeof SEVERITY_LEVELS;
};

export type TriageAnswers = {
  urgent: number;
  urgentConfidence: number;
  team: Team;
  teamConfidence: number;
  severity: number;
  severityConfidence: number;
};

export type TriageResult = {
  findingId: string;
  humanReview: true;
  unavailable: boolean;
  answers?: TriageAnswers;
};

export type Evaluator = (finding: Finding) => Promise<TriageAnswers>;

export function questionsFor(finding: Finding): QuestionSet {
  return {
    state: `${finding.title}\n${finding.detail}`,
    urgent: "這則事件是否需要立刻處理？",
    teamPrompt: "應由哪個團隊處理？",
    teamOptions: {
      gateway: "邊緣閘道、DNS 防火牆、IoT AP 或 VPN",
      firmware: "韌體映像、靜態特徵或元件識別",
      appsec: "應用程式漏洞與程式碼相關",
    },
    severityPrompt: "評估此事件的嚴重度",
    severityLevels: SEVERITY_LEVELS,
  };
}

export function isTeam(value: string): value is Team {
  return (TEAMS as readonly string[]).includes(value);
}

/** Nearest ordinal label. The score itself stays continuous. */
export function severityLabel(score: number, levels: readonly string[] = SEVERITY_LEVELS): string {
  if (levels.length === 0 || !Number.isFinite(score)) {
    return "";
  }
  const index = Math.min(levels.length - 1, Math.max(0, Math.round(score)));
  return levels[index] ?? "";
}

export async function triageFinding(finding: Finding, evaluate: Evaluator): Promise<TriageResult> {
  try {
    const answers = await evaluate(finding);
    return {
      findingId: finding.id,
      humanReview: true,
      unavailable: false,
      answers,
    };
  } catch {
    return {
      findingId: finding.id,
      humanReview: true,
      unavailable: true,
    };
  }
}

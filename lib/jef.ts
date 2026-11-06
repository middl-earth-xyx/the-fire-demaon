import { JefClient, choice, noul, score } from "@jef-ai/sdk";
import { isTeam, questionsFor, type Evaluator, type TriageAnswers } from "./triage";

const DEFAULT_BASE_URL = "http://localhost:8080";

export function createEvaluator(baseUrl = process.env.JEF_BASE_URL ?? DEFAULT_BASE_URL): Evaluator {
  const jef = new JefClient({ baseUrl, timeoutMs: 4_000 });

  return async (finding): Promise<TriageAnswers> => {
    const questions = questionsFor(finding);
    const { answers } = await jef.evaluate(questions.state, {
      urgent: noul(questions.urgent),
      team: choice(questions.teamPrompt, questions.teamOptions),
      severity: score(questions.severityPrompt, questions.severityLevels),
    });

    if (!isTeam(answers.team.choice)) {
      throw new Error(`unexpected team: ${answers.team.choice}`);
    }

    return {
      urgent: answers.urgent.noul,
      urgentConfidence: answers.urgent.confidence,
      team: answers.team.choice,
      teamConfidence: answers.team.confidence,
      severity: answers.severity.score,
      severityConfidence: answers.severity.confidence,
    };
  };
}

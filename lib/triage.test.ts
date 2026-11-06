import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findings } from "../fixtures/findings.ts";
import { questionsFor, severityLabel, triageFinding } from "./triage.ts";

describe("questionsFor", () => {
  it("keeps severity levels lowest-first and includes the finding text", () => {
    const gateway = questionsFor(findings[0]!);
    const firmware = questionsFor(findings[1]!);

    assert.match(gateway.state, /DNS 防火牆/);
    assert.match(firmware.state, /telnetd/);
    assert.deepEqual([...gateway.severityLevels], ["資訊", "低", "中", "高", "危急"]);
    assert.equal(gateway.teamOptions.gateway.length > 0, true);
    assert.equal(firmware.teamOptions.firmware.length > 0, true);
  });
});

describe("severityLabel", () => {
  it("maps a continuous score onto the nearest level without changing the scale", () => {
    assert.equal(severityLabel(0), "資訊");
    assert.equal(severityLabel(3.2), "高");
    assert.equal(severityLabel(3.6), "危急");
  });
});

describe("triageFinding", () => {
  it("returns human review without scores when evaluation fails", async () => {
    const result = await triageFinding(findings[0]!, async () => {
      throw new Error("connect ECONNREFUSED");
    });

    assert.equal(result.findingId, "gw-dns-1");
    assert.equal(result.humanReview, true);
    assert.equal(result.unavailable, true);
    assert.equal(result.answers, undefined);
  });

  it("keeps human review when JEF returns answers", async () => {
    const result = await triageFinding(findings[1]!, async () => ({
      urgent: 0.22,
      urgentConfidence: 0.15,
      team: "firmware",
      teamConfidence: 0.81,
      severity: 2.4,
      severityConfidence: 0.4,
    }));

    assert.equal(result.unavailable, false);
    assert.equal(result.humanReview, true);
    assert.equal(result.answers?.team, "firmware");
    assert.equal(result.answers?.severity, 2.4);
  });
});

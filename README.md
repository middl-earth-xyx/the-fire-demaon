# The Fire Daemon

閘道事件與韌體摘要的分級台。`rp_app` 負責邊緣閘道，`firmware-research-demo` 負責韌體解包與規則比對。這個倉庫把兩份已標籤的上游接進來，用 `@jef-ai/sdk` 問三件事：是否緊急、交給哪個團隊、嚴重度。分數描述分布有多集中。處置留給人。

## 執行

```bash
npm install
npm test
npm run dev
```

JEF 預設在 `http://localhost:8080`。沒有伺服器時，頁面仍顯示兩筆事件，並標成需要人工覆核、沒有分數。位址用 `JEF_BASE_URL` 覆蓋，見 `.env.example`。

## 依賴

清單在 [dependency-inventory/manifest.json](dependency-inventory/manifest.json)。

| 名稱 | 來源 | tag |
| --- | --- | --- |
| `@jef-ai/sdk` | npm，發佈者 dennislee928 | `0.2.0-rc.4` |
| `rp_app` | fork [dennislee928/rp_app](https://github.com/dennislee928/rp_app)，上游 [Jest-Test-Team/rp_app](https://github.com/Jest-Test-Team/rp_app) | `v0.2.0` |
| `firmware-research-demo` | [dennislee928/firmware-research-demo](https://github.com/dennislee928/firmware-research-demo)。原倉庫已是這個帳號，所以 tag 打在原倉庫 | `v0.1.0` |

兩個 git 依賴是 submodule，路徑在 `external/`。韌體分析腳本、YARA 規則與映像留在該 tag 裡，不複製到這個倉庫的應用程式碼。

## Security CI

Extension Guard 在 pull request 變更擴充清單時執行，動作 pin 在 `Jest-Test-Team/ide-extension@d56084f6c17d7fa4a203bf1bdec10cd2897c270b`（tag `0.0.1`）。Marketplace 文件裡的 `@v1` 目前不存在。政策在 `.github/jest-security.yml`，建議擴充只有 `dbaeumer.vscode-eslint`。

Vuln Sentinel pin 在 `BabyGrootCICD/cve_validator_patcher@e98480149a159318c30809301e68c3321ea65aba`（`v1.2.0`）。workflow 只在手動觸發時跑，`mode: scan`、`dry-run: true`、`auto-merge: false`，而且 `repos` 只含這個倉庫。它不會把報告 commit 回去。

要改成會開 issue 並送修補 PR 的完整流程，先在倉庫建立 secret `SENTINEL_TOKEN`（classic PAT：`repo`、`workflow`、`read:org`），再把 workflow 的 `mode` 改成 `run`、`dry-run` 改成 `false`。那個模式會對 token 看得到的倉庫開 ticket；`repos` 留著，範圍才不會擴到其他倉庫。`auto-merge` 維持 `false`，除非你要它在 CI 綠燈後自己合併。

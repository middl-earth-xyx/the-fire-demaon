export const findings = [
  {
    id: "gw-dns-1",
    source: "gateway",
    title: "隔離 AP 上的裝置查詢被封鎖的網域",
    detail:
      "IoT AP 的一台裝置在 10 分鐘內對被 DNS 防火牆封鎖的網域發出 40 次查詢。閘道沒有放行。",
  },
  {
    id: "fw-telnet-1",
    source: "firmware",
    title: "韌體映像中出現 telnetd",
    detail:
      "靜態摘要指出解包後的檔案包含 telnetd 字串。這表示映像裡有傳統遠端服務，處置前仍要人工看過。",
  },
] as const;

function StrategyVerifyPanel({ verifyResult }) {
  if (!verifyResult) {
    return null;
  }

  return (
    <div className="verify-panel">
      <p className={verifyResult.ok ? "verify-ok" : "verify-fail"}>
        {verifyResult.ok
          ? "Code verification passed."
          : "Code verification failed."}
      </p>
      <p className="verify-meta">
        Risk score: {verifyResult.riskScore ?? 0}/100 · Errors:{" "}
        {verifyResult.errors?.length ?? 0} · Warnings:{" "}
        {verifyResult.warnings?.length ?? 0}
      </p>
      <p className="verify-meta">
        Contract: {verifyResult.contract?.style || "unknown"} · Methods:{" "}
        {(verifyResult.contract?.methods || []).length > 0
          ? (verifyResult.contract.methods || []).join(", ")
          : "none"}
      </p>
      {verifyResult.issues.length > 0 && (
        <ul className="verify-list">
          {verifyResult.issues.map((issue, index) => (
            <li key={`${issue.type}-${index}`}>
              [{issue.type.toUpperCase()}] {issue.message}
              {issue.line ? ` (line ${issue.line})` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StrategyVerifyPanel;

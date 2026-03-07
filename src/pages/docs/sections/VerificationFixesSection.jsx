function VerificationFixesSection() {
  return (
    <section id="verification-fixes" className="info-box docs-section">
      <h2>Verification Errors: Quick Fixes</h2>
      <div className="table-wrap">
        <table className="strategy-table">
          <thead>
            <tr>
              <th>Error Pattern</th>
              <th>Why It Happens</th>
              <th>How to Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Missing default export</td>
              <td>Strategy object is not exported as default</td>
              <td>Export a default object with required methods</td>
            </tr>
            <tr>
              <td>Missing required method</td>
              <td>One of reset/observe/act is absent</td>
              <td>Add the missing method to the default object</td>
            </tr>
            <tr>
              <td>Syntax error</td>
              <td>Invalid JavaScript parse state</td>
              <td>Fix parser-highlighted token/line issue</td>
            </tr>
            <tr>
              <td>Unsafe runtime usage</td>
              <td>Restricted API or unsafe pattern detected</td>
              <td>Remove restricted call and use deterministic logic</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default VerificationFixesSection;

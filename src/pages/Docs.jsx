import PageShell from "../components/PageShell";

function Docs() {
  return (
    <PageShell
      title="Strategy Docs"
      subtitle="User-facing guide for writing, verifying, and configuring strategies in Algo Arena."
    >
      <div className="docs-quick-nav" aria-label="Docs quick links">
        <a className="docs-chip" href="#strategy-basics">
          Strategy Basics
        </a>
        <a className="docs-chip" href="#workflow">
          Workflow
        </a>
        <a className="docs-chip" href="#verification">
          Verification
        </a>
        <a className="docs-chip" href="#metadata">
          Metadata
        </a>
        <a className="docs-chip" href="#environments">
          Environments
        </a>
        <a className="docs-chip" href="#strategy-quality">
          Quality Checklist
        </a>
        <a className="docs-chip" href="#faq">
          FAQ
        </a>
      </div>

      <section id="strategy-basics" className="info-box docs-section">
        <h2>How Strategies Work</h2>
        <p>
          A strategy runs as a lifecycle: <strong>reset</strong> at run start,
          <strong> observe</strong> for incoming state updates, then
          <strong> act</strong> to return the next environment decision.
        </p>
        <ul className="feature-list">
          <li>
            <strong>reset(context)</strong>: initialize or clear any internal
            state for a fresh run.
          </li>
          <li>
            <strong>observe(observation)</strong>: ingest incoming signals/data
            and update local state.
          </li>
          <li>
            <strong>act(state)</strong>: compute and return your next
            decision/output expected by the selected environment contract.
          </li>
          <li>
            Export a <strong>default</strong> object containing all required
            lifecycle methods.
          </li>
        </ul>
      </section>

      <section id="workflow" className="info-box docs-section">
        <h2>Recommended Workflow</h2>
        <p>
          Use this loop to avoid blind submits and keep strategy iteration
          predictable.
        </p>
        <ol className="feature-list">
          <li>Write or update your strategy source.</li>
          <li>
            Run <strong>Verify Code</strong> and resolve all errors.
          </li>
          <li>
            Run <strong>Run</strong> (enabled only for verified, unchanged
            source) to test behavior quickly.
          </li>
          <li>
            Review sandbox output and metadata assumptions, then save when
            ready.
          </li>
        </ol>
      </section>

      <section id="verification" className="info-box docs-section">
        <h2>Verification Guide</h2>
        <p>
          Verify checks are there to catch unsafe or invalid code before save.
          You must export a default strategy implementation containing
          <strong> reset</strong>, <strong>observe</strong>, and
          <strong> act</strong>.
        </p>
        <ul className="feature-list">
          <li>Errors block save; warnings are guidance.</li>
          <li>
            The <strong>Run</strong> button is enabled only after a successful
            verify on the current, unchanged source.
          </li>
          <li>
            Common failures: missing default export, missing required method,
            empty <strong>act</strong>, syntax errors.
          </li>
          <li>
            Restricted runtime APIs are blocked for safety and deterministic
            execution.
          </li>
        </ul>
      </section>

      <section id="metadata" className="info-box docs-section">
        <h2>Metadata (JSON)</h2>
        <p>
          Metadata stores extra structured config for your strategy (notes,
          tuning values, tags, thresholds). It is optional but useful for
          organizing and versioning strategy behavior.
        </p>
        <pre className="docs-code">{`{
  "tags": ["baseline", "auctionhouse"],
  "riskLimit": 0.2,
  "notes": "Conservative variant for volatile rounds"
}`}</pre>
      </section>

      <section id="environments" className="info-box docs-section">
        <h2>Environments</h2>
        <p>
          Environment references explain the game itself, what information your
          strategy receives, and what kind of decision it must return.
        </p>

        <details id="environment-auctionhouse" className="docs-env-details">
          <summary className="docs-env-summary">AuctionHouse</summary>
          <div className="docs-env-content">
            <p>
              AuctionHouse is a repeated bidding game. Each round presents an
              item and your strategy decides a bid. The goal is to win valuable
              items without exhausting budget too early.
            </p>

            <h3>How the Game Works</h3>
            <ul className="feature-list">
              <li>
                You start with a limited budget and face multiple auction
                rounds.
              </li>
              <li>
                In each round, strategies submit bids; higher bids are more
                likely to win but consume more budget.
              </li>
              <li>
                Overbidding early can leave you unable to compete in later
                rounds.
              </li>
              <li>
                Strong strategies balance aggression and conservation based on
                remaining budget and round context.
              </li>
            </ul>

            <h3>Contract</h3>
            <ul className="feature-list">
              <li>
                <strong>Expected output:</strong> <code>act(...)</code> returns
                a number (bid).
              </li>
              <li>
                <strong>Input behavior:</strong> on the very first turn,
                observation may be missing/empty depending on flow.
              </li>
              <li>
                <strong>Safety guideline:</strong> clamp bids to a bounded range
                and always write null-safe access for observation fields.
              </li>
            </ul>

            <h3>Observation Example</h3>
            <pre className="docs-code">{`{
  "round": 3,
  "myBid": 5,
  "myReward": 1.2,
  "mySpend": 14,
  "myWins": 2,
  "remainingBudget": 86,
  "startingBudget": 100,
  "lastWinner": "agent-2",
  "lastWinningBid": 7,
  "itemHint": 6
}`}</pre>

            <p>
              First turn note: <code>obs</code> may be <code>null</code>,
              <code>undefined</code>, or an empty object. Client examples should
              always be null-safe.
            </p>

            <h3>Observation Field Reference</h3>
            <div className="table-wrap">
              <table className="strategy-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>round</td>
                    <td>number</td>
                    <td>Current round number.</td>
                  </tr>
                  <tr>
                    <td>myBid</td>
                    <td>number</td>
                    <td>Your most recent bid.</td>
                  </tr>
                  <tr>
                    <td>myReward</td>
                    <td>number</td>
                    <td>Reward from the latest step.</td>
                  </tr>
                  <tr>
                    <td>mySpend</td>
                    <td>number</td>
                    <td>Total amount spent so far.</td>
                  </tr>
                  <tr>
                    <td>myWins</td>
                    <td>number</td>
                    <td>Total auctions won so far.</td>
                  </tr>
                  <tr>
                    <td>remainingBudget</td>
                    <td>number | null</td>
                    <td>Budget left; null when budget is unbounded.</td>
                  </tr>
                  <tr>
                    <td>startingBudget</td>
                    <td>number | null</td>
                    <td>Initial budget; null when unbounded.</td>
                  </tr>
                  <tr>
                    <td>lastWinner</td>
                    <td>string | null</td>
                    <td>Agent ID of last round winner, if any.</td>
                  </tr>
                  <tr>
                    <td>lastWinningBid</td>
                    <td>number | null</td>
                    <td>Winning price from last round, if any.</td>
                  </tr>
                  <tr>
                    <td>itemHint</td>
                    <td>number</td>
                    <td>Rounded hint of item value (not exact value).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Decision I/O Reference</h3>
            <div className="table-wrap">
              <table className="strategy-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Input (Typical)</th>
                    <th>Output (Required)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>reset(context)</td>
                    <td>Run bootstrap data (optional object)</td>
                    <td>Internal state object for strategy lifecycle</td>
                  </tr>
                  <tr>
                    <td>observe(observation)</td>
                    <td>Round/game observation (object, shape may vary)</td>
                    <td>Updated internal state snapshot</td>
                  </tr>
                  <tr>
                    <td>act(state)</td>
                    <td>Current strategy state / latest observation</td>
                    <td>Numeric bid value</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Scoring & Objectives</h3>
            <ul className="feature-list">
              <li>
                Primary objective: maximize long-term value gained from won
                rounds.
              </li>
              <li>
                Secondary objective: preserve enough budget to stay competitive
                across the full run.
              </li>
              <li>
                Practical tradeoff: aggressive bids can secure early wins but
                may reduce endgame flexibility.
              </li>
            </ul>

            <h3>Common Pitfalls</h3>
            <ul className="feature-list">
              <li>Bidding all available budget too early.</li>
              <li>Returning unbounded values without clamping.</li>
              <li>
                Assuming optional observation fields always exist and are
                numeric.
              </li>
              <li>
                Ignoring run-to-run variability when testing in sandbox mode.
              </li>
            </ul>

            <h3>Reference Strategy</h3>
            <pre className="docs-code">{`export default {
  reset(context) {
    return {
      rounds: 0,
      lastObservation: context || null,
    };
  },
  observe(obs) {
    return {
      lastObservation: obs || null,
    };
  },
  act(state) {
    const remainingBudget = Number(state?.lastObservation?.remainingBudget || 0);
    return Math.max(0, Math.min(remainingBudget, 5));
  }
};`}</pre>
          </div>
        </details>

        <details id="environment-tictactoe" className="docs-env-details">
          <summary className="docs-env-summary">TicTacToe</summary>
          <div className="docs-env-content">
            <p>
              TicTacToe is a turn-based 3x3 board game. Your strategy selects a
              legal cell index on its turn and should prioritize fast wins while
              blocking immediate losses.
            </p>

            <h3>How the Game Works</h3>
            <ul className="feature-list">
              <li>
                The board has indices <code>0</code> through <code>8</code>.
              </li>
              <li>
                You can only choose from <code>legalMoves</code> when
                <code>isMyTurn</code> is true.
              </li>
              <li>
                A game ends when one side wins or the board reaches a draw.
              </li>
              <li>
                Invalid moves can be penalized, forfeited, or skipped depending
                on environment settings.
              </li>
            </ul>

            <h3>Contract</h3>
            <ul className="feature-list">
              <li>
                <strong>Expected output:</strong> <code>act(...)</code> returns
                a numeric move index (0-8).
              </li>
              <li>
                <strong>Input behavior:</strong> first turn observation may be
                missing or incomplete in some flows.
              </li>
              <li>
                <strong>Safety guideline:</strong> always null-check
                <code>obs</code>, ensure selected move is in
                <code>legalMoves</code>, and provide fallback behavior.
              </li>
            </ul>

            <h3>Observation Example</h3>
            <pre className="docs-code">{`{
  "round": 2,
  "board": ["X", null, "O", null, null, null, null, null, null],
  "mySymbol": "X",
  "currentPlayerId": "sandbox-agent",
  "legalMoves": [1, 3, 4, 5, 6, 7, 8],
  "isMyTurn": true,
  "lastMove": { "playerId": "sandbox-agent", "symbol": "X", "index": 0 },
  "winnerId": null,
  "done": false,
  "myReward": 0,
  "info": {
    "reason": "move_applied",
    "requestedMove": 0,
    "invalidMoveBy": null
  }
}`}</pre>

            <h3>Reference Strategy</h3>
            <pre className="docs-code">{`export default {
  reset(context) {
    return context || {};
  },
  observe(obs) {
    return obs || {};
  },
  act(obs) {
    const moves = Array.isArray(obs?.legalMoves) ? obs.legalMoves : [];
    return moves.length ? moves[0] : 0;
  }
};`}</pre>
          </div>
        </details>
      </section>

      <section id="strategy-quality" className="info-box docs-section">
        <h2>Strategy Quality Checklist</h2>
        <ul className="feature-list">
          <li>
            <strong>Contract complete:</strong> default export includes
            <strong> reset</strong>, <strong>observe</strong>, and
            <strong> act</strong>.
          </li>
          <li>
            <strong>Verification clean:</strong> no blocking verify errors.
          </li>
          <li>
            <strong>Sandbox tested:</strong> latest run output reviewed and
            interpreted before save.
          </li>
          <li>
            <strong>Bounded decisions:</strong> numeric outputs clamped to safe
            ranges.
          </li>
          <li>
            <strong>Metadata updated:</strong> notes/tags reflect strategy
            behavior and intent.
          </li>
        </ul>
      </section>

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

      <section id="sandbox-reading" className="info-box docs-section">
        <h2>How to Read Sandbox Output</h2>
        <ul className="feature-list">
          <li>
            Start with outcome summary fields first, then inspect round-level or
            diagnostic details.
          </li>
          <li>
            Look for signals of unstable behavior: extreme bids, abrupt budget
            drops, or repeated zero-action patterns.
          </li>
          <li>
            After each run, tweak one strategy assumption at a time for clearer
            causality.
          </li>
          <li>Re-run only after a fresh verify pass when source changes.</li>
        </ul>
      </section>

      <section id="faq" className="info-box docs-section">
        <h2>FAQ</h2>
        <details className="docs-env-details">
          <summary className="docs-env-summary">Why is Run disabled?</summary>
          <div className="docs-env-content">
            <p>
              Run is enabled only after a successful verification of the current
              source. Any source edit invalidates that verify state.
            </p>
          </div>
        </details>

        <details className="docs-env-details">
          <summary className="docs-env-summary">
            Why can verify pass but strategy still perform poorly?
          </summary>
          <div className="docs-env-content">
            <p>
              Verification checks safety and contract validity, not strategy
              quality. Use sandbox output to refine decision logic and budget
              control.
            </p>
          </div>
        </details>

        <details className="docs-env-details">
          <summary className="docs-env-summary">
            When should I use metadata?
          </summary>
          <div className="docs-env-content">
            <p>
              Use metadata for notes, tags, and tunable values that help you
              track strategy versions and intent across iterations.
            </p>
          </div>
        </details>
      </section>
    </PageShell>
  );
}

export default Docs;

import { Link } from "react-router-dom";
import { ROUTES } from "../../../../lib/routes";

function AuctionHouse() {
  return (
    <section id="environment-auctionhouse" className="info-box docs-section">
      <p>
        <Link
          to={ROUTES.docsSection("environments")}
          className="docs-inline-link"
        >
          Back to Environments
        </Link>
      </p>
      <h2>AuctionHouse</h2>
      <p>
        AuctionHouse is a repeated bidding game. Each round presents an item and
        your strategy decides a bid. The goal is to win valuable items without
        exhausting budget too early.
      </p>

      <h3>How the Game Works</h3>
      <ul className="feature-list">
        <li>
          You start with a limited budget and face multiple auction rounds.
        </li>
        <li>
          In each round, strategies submit bids; higher bids are more likely to
          win but consume more budget.
        </li>
        <li>
          Overbidding early can leave you unable to compete in later rounds.
        </li>
        <li>
          Strong strategies balance aggression and conservation based on
          remaining budget and round context.
        </li>
      </ul>

      <h3>Contract</h3>
      <ul className="feature-list">
        <li>
          <strong>Game type:</strong> non-zero-sum repeated auction.
        </li>
        <li>
          <strong>Expected output:</strong> <code>act(...)</code> returns a
          number (bid).
        </li>
        <li>
          <strong>Input behavior:</strong> on the very first turn, observation
          may be missing/empty depending on flow.
        </li>
        <li>
          <strong>Safety guideline:</strong> clamp bids to a bounded range and
          always write null-safe access for observation fields.
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
          Primary objective: maximize long-term value gained from won rounds.
        </li>
        <li>
          Secondary objective: preserve enough budget to stay competitive across
          the full run.
        </li>
        <li>
          Practical tradeoff: aggressive bids can secure early wins but may
          reduce endgame flexibility.
        </li>
      </ul>

      <h3>Common Pitfalls</h3>
      <ul className="feature-list">
        <li>Bidding all available budget too early.</li>
        <li>Returning unbounded values without clamping.</li>
        <li>
          Assuming optional observation fields always exist and are numeric.
        </li>
        <li>Ignoring run-to-run variability when testing in sandbox mode.</li>
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
    </section>
  );
}

export default AuctionHouse;

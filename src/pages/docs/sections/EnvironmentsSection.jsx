import { Link } from "react-router-dom";
import { ROUTES } from "../../../lib/routes";

function EnvironmentsSection() {
  return (
    <section id="environments" className="info-box docs-section">
      <h2>Environments</h2>
      <p>
        Environment references explain the game itself, what information your
        strategy receives, and what kind of decision it must return.
      </p>

      <h3>Game Type & Evaluation Tie Behavior</h3>
      <ul className="feature-list">
        <li>
          <strong>AuctionHouse:</strong> generally <strong>non-zero-sum</strong>
          . Multiple strategies can perform well at the same time, but exact
          same aggregate evaluation values are typically uncommon because
          outcomes depend on bid dynamics, budget usage, and round variance.
        </li>
        <li>
          <strong>TicTacToe:</strong> effectively a <strong>zero-sum</strong>
          &nbsp; head-to-head game. Symmetry and bounded outcomes make equal or
          very close evaluations more common across strong strategies.
        </li>
      </ul>

      <h3>Environment References</h3>
      <p>
        Open each environment guide for full contract, observation examples,
        pitfalls, and reference strategy snippets.
      </p>
      <div
        className="docs-quick-nav"
        role="navigation"
        aria-label="Environment docs links"
      >
        <Link to={ROUTES.docsEnvironment("AuctionHouse")} className="docs-chip">
          AuctionHouse
        </Link>
        <Link to={ROUTES.docsEnvironment("TicTacToe")} className="docs-chip">
          TicTacToe
        </Link>
      </div>
    </section>
  );
}

export default EnvironmentsSection;

import { Link } from "react-router-dom";
import { ROUTES } from "../../../../lib/routes";

function TicTacToe() {
  return (
    <section id="environment-tictactoe" className="info-box docs-section">
      <p>
        <Link
          to={ROUTES.docsSection("environments")}
          className="docs-inline-link"
        >
          Back to Environments
        </Link>
      </p>
      <h2>TicTacToe</h2>
      <p>
        TicTacToe is a turn-based 3x3 board game. Your strategy selects a legal
        cell index on its turn and should prioritize fast wins while blocking
        immediate losses.
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
        <li>A game ends when one side wins or the board reaches a draw.</li>
        <li>
          Invalid moves can be penalized, forfeited, or skipped depending on
          environment settings.
        </li>
      </ul>

      <h3>Contract</h3>
      <ul className="feature-list">
        <li>
          <strong>Game type:</strong> zero-sum, turn-based board game.
        </li>
        <li>
          <strong>Expected output:</strong> <code>act(...)</code> returns a
          numeric move index (0-8).
        </li>
        <li>
          <strong>Input behavior:</strong> first turn observation may be missing
          or incomplete in some flows.
        </li>
        <li>
          <strong>Safety guideline:</strong> always null-check <code>obs</code>,
          ensure selected move is in <code>legalMoves</code>, and provide
          fallback behavior.
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
    </section>
  );
}

export default TicTacToe;

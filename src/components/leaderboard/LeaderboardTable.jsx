import { Trophy } from "lucide-react";

function LeaderboardTable({
  rows,
  evaluationId,
  contextLabel,
  showPodium = false,
  highlightTopRanks = false,
  currentUserId = "",
  pinnedRows = [],
}) {
  const contextText =
    contextLabel || (evaluationId ? `Evaluation: ${evaluationId}` : "");

  const getRowKey = (row, index) =>
    row.resultId || row._id || row.agentId || index;

  const getUsername = (row) =>
    row.ownerProfile?.username ||
    row.username ||
    row.displayName ||
    "Unknown User";

  const getMetric = (row, key) => row[key] ?? row.metrics?.[key] ?? null;

  const formatMetric = (value, key) => {
    if (value === null || value === undefined) {
      return "-";
    }

    if (typeof value !== "number") {
      return value;
    }

    if (key === "failRate") {
      const percentValue = value <= 1 ? value * 100 : value;
      return `${percentValue.toFixed(1)}%`;
    }

    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const sortedRows = [...rows].sort((left, right) => {
    const leftRank = Number(left?.rank);
    const rightRank = Number(right?.rank);

    if (Number.isNaN(leftRank) && Number.isNaN(rightRank)) {
      return 0;
    }
    if (Number.isNaN(leftRank)) {
      return 1;
    }
    if (Number.isNaN(rightRank)) {
      return -1;
    }

    return leftRank - rightRank;
  });

  const podiumCards = (() => {
    if (!showPodium || sortedRows.length === 0) {
      return [];
    }

    const groups = {
      1: [],
      2: [],
      3: [],
    };

    sortedRows.forEach((row) => {
      const rank = Number(row?.rank);
      if ([1, 2, 3].includes(rank)) {
        groups[rank].push(row);
      }
    });

    const groupedKeys = new Set();
    Object.values(groups).forEach((rowsForRank) => {
      rowsForRank.forEach((row, index) => {
        groupedKeys.add(getRowKey(row, index));
      });
    });

    const fallbackPool = sortedRows.filter((row, index) => {
      const key = getRowKey(row, index);
      return !groupedKeys.has(key);
    });

    const takeFallback = () => {
      const next = fallbackPool.shift();
      if (!next) {
        return null;
      }
      return next;
    };

    const cards = [];
    const pushGroup = (rank, label, className) => {
      const rowsForRank = groups[rank];
      if (rowsForRank.length > 0) {
        rowsForRank.forEach((row) => {
          cards.push({ rank, label, className, row });
        });
        return;
      }

      const fallback = takeFallback();
      if (fallback) {
        cards.push({ rank, label, className, row: fallback });
      }
    };

    pushGroup(2, "2nd", "podium-silver");
    pushGroup(1, "1st", "podium-gold");
    pushGroup(3, "3rd", "podium-bronze");

    return cards;
  })();

  const podiumRowKeys = new Set(
    podiumCards.map((card, index) => getRowKey(card.row, index)),
  );

  const tableRows = showPodium
    ? sortedRows.filter((row, index) => !podiumRowKeys.has(getRowKey(row, index)))
    : sortedRows;

  const effectivePinnedRows = pinnedRows.filter(
    (row, index) => !podiumRowKeys.has(getRowKey(row, index)),
  );

  const resolveRowClassName = (row, rankNumber, isPinned) => {
    const rankClass =
      highlightTopRanks && [1, 2, 3].includes(rankNumber)
        ? `leaderboard-rank-${rankNumber}`
        : "";
    const isUserRow =
      currentUserId &&
      (row.agentOwnerId === currentUserId || row.ownerId === currentUserId);
    return [
      rankClass,
      isUserRow ? "leaderboard-user-row" : "",
      isPinned ? "leaderboard-pinned-row" : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const renderRow = (row, index, { isPinned } = {}) => {
    const rowKey = getRowKey(row, index);
    const rank = row.rank ?? "-";
    const username = getUsername(row);
    const totalReturn = getMetric(row, "totalReturn");
    const averageReturn = getMetric(row, "averageReturn");
    const failRate = getMetric(row, "failRate");
    const rankNumber = Number(rank);
    const rowClassName = resolveRowClassName(row, rankNumber, isPinned);

    return (
      <tr key={`${isPinned ? "pinned-" : ""}${rowKey}`} className={rowClassName}>
        <td>
                  {Number.isFinite(rankNumber) ? (
                    <span className={`rank-badge rank-badge-${rankNumber}`}>
                      #{rankNumber}
                    </span>
                  ) : (
                    "-"
                  )}
        </td>
        <td>{username}</td>
        <td className="cell-numeric">
          {formatMetric(totalReturn, "totalReturn")}
        </td>
        <td className="cell-numeric">
          {formatMetric(averageReturn, "averageReturn")}
        </td>
        <td className="cell-numeric">{formatMetric(failRate, "failRate")}</td>
      </tr>
    );
  };

  return (
    <div className="table-wrap">
      {contextText ? (
        <p className="verify-meta leaderboard-context">{contextText}</p>
      ) : null}
      {showPodium && podiumCards.length > 0 ? (
        <div className="leaderboard-podium">
          {podiumCards.map((slot, index) => (
            <div
              key={`${slot.rank}-${getRowKey(slot.row, index)}`}
              className={`podium-card ${slot.className} ${slot.row ? "" : "podium-empty"}`}
            >
              <div className="podium-header">
                <div className="podium-rank">{slot.label}</div>
                <div className="podium-badge" aria-hidden="true">
                  <Trophy className="podium-trophy" size={18} />
                </div>
              </div>
              <div className="podium-name">
                {slot.row ? getUsername(slot.row) : "-"}
              </div>
              <div className="podium-metrics">
                <div className="podium-metric">
                  <span className="podium-metric-label">
                    Total <span className="col-unit">pts</span>
                  </span>
                  <span className="podium-metric-value">
                    {slot.row
                      ? formatMetric(
                          getMetric(slot.row, "totalReturn"),
                          "totalReturn",
                        )
                      : "-"}
                  </span>
                </div>
                <div className="podium-metric">
                  <span className="podium-metric-label">
                    Avg <span className="col-unit">pts</span>
                  </span>
                  <span className="podium-metric-value">
                    {slot.row
                      ? formatMetric(
                          getMetric(slot.row, "averageReturn"),
                          "averageReturn",
                        )
                      : "-"}
                  </span>
                </div>
                <div className="podium-metric">
                  <span className="podium-metric-label">
                    Fail <span className="col-unit">%</span>
                  </span>
                  <span className="podium-metric-value">
                    {slot.row
                      ? formatMetric(
                          getMetric(slot.row, "failRate"),
                          "failRate",
                        )
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {tableRows.length > 0 || effectivePinnedRows.length > 0 ? (
        <table className="strategy-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th className="cell-numeric">
                Total Return <span className="col-unit">pts</span>
              </th>
              <th className="cell-numeric">
                Avg Return <span className="col-unit">pts</span>
              </th>
              <th className="cell-numeric">
                Fail Rate <span className="col-unit">%</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {effectivePinnedRows.length > 0
              ? effectivePinnedRows.map((row, index) =>
                  renderRow(row, index, { isPinned: true }),
                )
              : null}
            {effectivePinnedRows.length > 0 ? (
              <tr className="leaderboard-divider">
                <td colSpan={5}>
                  <span>Leaderboard</span>
                </td>
              </tr>
            ) : null}
            {tableRows.map((row, index) => renderRow(row, index))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

export default LeaderboardTable;

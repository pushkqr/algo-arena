import useServiceEvaluationData from "./useServiceEvaluationData";
import useServiceEvaluationQueue from "./useServiceEvaluationQueue";

export default function useServiceEvaluations() {
  const data = useServiceEvaluationData();
  const queue = useServiceEvaluationQueue({
    loadEvaluations: data.loadEvaluations,
    loadEvaluationDetail: data.loadEvaluationDetail,
  });

  return {
    ...queue,
    ...data,
  };
}

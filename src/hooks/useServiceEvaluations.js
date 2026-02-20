import useServiceEvaluationData from "./useServiceEvaluationData";
import useServiceEvaluationQueue, {
  SERVICE_ENV_OPTIONS,
} from "./useServiceEvaluationQueue";

export { SERVICE_ENV_OPTIONS };

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

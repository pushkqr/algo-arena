import { useParams } from "react-router-dom";
import { LoadingState } from "../components/AsyncState";
import PageShell from "../components/PageShell";
import StrategyEditorForm from "../components/strategyEditor/StrategyEditorForm";
import useStrategyEditor, {
  DEFAULT_STRATEGY_ENV,
} from "../hooks/useStrategyEditor";

function StrategyEditor() {
  const { strategyId } = useParams();
  const {
    isCreateMode,
    loading,
    saving,
    running,
    error,
    title,
    name,
    setName,
    envName,
    setEnvName,
    source,
    setSource,
    metadataText,
    setMetadataText,
    isActive,
    setIsActive,
    verifyResult,
    runResult,
    isRunEnabled,
    handleSubmit,
    handleVerifyCode,
    handleRun,
    handleCancel,
  } = useStrategyEditor(strategyId);

  return (
    <PageShell
      title={title}
      subtitle="Code editor + metadata form for strategy source and configuration."
    >
      {loading ? (
        <LoadingState message="Loading strategy..." compact />
      ) : (
        <StrategyEditorForm
          defaultEnv={DEFAULT_STRATEGY_ENV}
          name={name}
          onNameChange={setName}
          envName={envName}
          onEnvNameChange={setEnvName}
          source={source}
          onSourceChange={setSource}
          onVerifyCode={handleVerifyCode}
          onRun={handleRun}
          canRun={isRunEnabled}
          running={running}
          verifyResult={verifyResult}
          runResult={runResult}
          metadataText={metadataText}
          onMetadataTextChange={setMetadataText}
          isActive={isActive}
          onIsActiveChange={setIsActive}
          error={error}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          saving={saving}
          isCreateMode={isCreateMode}
        />
      )}
    </PageShell>
  );
}

export default StrategyEditor;

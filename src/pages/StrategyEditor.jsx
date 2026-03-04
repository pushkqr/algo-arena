import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingState } from "../components/AsyncState";
import PageShell from "../components/PageShell";
import StrategyEditorForm from "../components/strategyEditor/StrategyEditorForm";
import useStrategyEditor from "../hooks/useStrategyEditor";
import useEnvironmentCatalog from "../hooks/useEnvironmentCatalog";

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
    isSubmitEnabled,
    handleSubmit,
    handleVerifyCode,
    handleRun,
    handleCancel,
  } = useStrategyEditor(strategyId);
  const { envOptions, envNames } = useEnvironmentCatalog();

  useEffect(() => {
    if (!envNames.length || envNames.includes(envName)) {
      return;
    }

    setEnvName(envNames[0]);
  }, [envName, envNames, setEnvName]);

  const resolvedEnvOptions =
    envOptions.length > 0 ? envOptions : [{ name: envName, label: envName }];

  return (
    <PageShell
      title={title}
      subtitle="Code editor + metadata form for strategy source and configuration."
    >
      {loading ? (
        <LoadingState message="Loading strategy..." compact />
      ) : (
        <StrategyEditorForm
          envOptions={resolvedEnvOptions}
          name={name}
          onNameChange={setName}
          envName={envName}
          onEnvNameChange={setEnvName}
          source={source}
          onSourceChange={setSource}
          onVerifyCode={handleVerifyCode}
          onRun={handleRun}
          canRun={isRunEnabled}
          canSubmit={isSubmitEnabled}
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

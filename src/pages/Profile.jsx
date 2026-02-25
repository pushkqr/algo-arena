import PageShell from "../components/PageShell";
import { EmptyState, LoadingState } from "../components/AsyncState";
import useAuthState from "../hooks/useAuthState";
import ProfileDetailsTable from "../components/profile/ProfileDetailsTable";
import ProfileSummary from "../components/profile/ProfileSummary";
import useProfileState from "../hooks/useProfileState";

function Profile() {
  const { user, loading, sessionUser, hasFirebaseConfig } = useAuthState();
  const {
    rows,
    copiedField,
    isEditingName,
    nameDraft,
    actionLoading,
    canSaveName,
    usernameCheck,
    setNameDraft,
    handleCopy,
    handleStartEditName,
    handleCancelEditName,
    handleSaveName,
    handleVerifyEmail,
  } = useProfileState({ user, sessionUser });

  return (
    <PageShell
      title="Profile"
      subtitle="Your account identity and session details."
    >
      {loading ? (
        <LoadingState message="Loading profile..." compact />
      ) : !hasFirebaseConfig ? (
        <EmptyState
          title="Firebase not configured"
          message="Profile details are unavailable until Firebase config is provided."
          compact
        />
      ) : !user ? (
        <EmptyState
          title="Profile unavailable"
          message="No authenticated user session is active."
          compact
        />
      ) : (
        <>
          <ProfileSummary
            user={user}
            sessionUser={sessionUser}
            isEditingName={isEditingName}
            onCompleteUsernameSetup={handleStartEditName}
          />

          <ProfileDetailsTable
            rows={rows}
            user={user}
            copiedField={copiedField}
            isEditingName={isEditingName}
            nameDraft={nameDraft}
            usernameCheck={usernameCheck}
            actionLoading={actionLoading}
            canSaveName={canSaveName}
            onNameDraftChange={(value) => setNameDraft(value.toLowerCase())}
            onSaveName={handleSaveName}
            onCancelEditName={handleCancelEditName}
            onStartEditName={handleStartEditName}
            onVerifyEmail={handleVerifyEmail}
            onCopy={handleCopy}
          />
        </>
      )}
    </PageShell>
  );
}

export default Profile;

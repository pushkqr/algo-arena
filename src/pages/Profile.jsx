import PageShell from "../components/PageShell";
import { EmptyState } from "../components/AsyncState";

function Profile() {
  return (
    <PageShell
      title="Profile"
      subtitle="Account details, token/session info, and role visibility settings."
    >
      <EmptyState
        title="Profile details not loaded"
        message="Connect Firebase user metadata and role claims to populate this view."
      />
    </PageShell>
  );
}

export default Profile;

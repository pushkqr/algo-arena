import PageShell from "../components/PageShell";

function Profile() {
  return (
    <PageShell
      title="Profile"
      subtitle="Account details, token/session info, and role visibility settings."
    >
      <p className="body-text">
        Profile scaffold ready. Next: show Firebase user info + service-role
        claims.
      </p>
    </PageShell>
  );
}

export default Profile;

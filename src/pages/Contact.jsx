import { useState } from "react";
import HeroShell from "../components/HeroShell";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "General Question",
    message: "",
  });
  const [submitHint, setSubmitHint] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const subject = `[Algo Arena Support] ${form.topic}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      "",
      "Message:",
      form.message,
    ].join("\n");

    window.location.href = `mailto:support@algoarena.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitHint("Opened your mail app with a prefilled support draft.");
  }

  return (
    <HeroShell>
      <div className="signin-layout">
        <div className="signin-copy">
          <p className="landing-kicker">CONTACT</p>
          <h1 className="landing-title signin-title">
            Support Hub.
            <br />
            <span>Continue building and improving.</span>
          </h1>
        </div>

        <section className="signin-card" aria-label="Submit a support query">
          <p className="signin-helper">
            Submit a query and we will get back soon.
          </p>
          <form className="auth-panel" onSubmit={handleSubmit}>
            <label className="auth-label" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              className="auth-input"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
              required
            />

            <label className="auth-label" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              className="auth-input"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <label className="auth-label" htmlFor="contact-topic">
              Topic
            </label>
            <select
              id="contact-topic"
              name="topic"
              className="auth-input"
              value={form.topic}
              onChange={handleChange}
            >
              <option>General Question</option>
              <option>Sign In / Account</option>
              <option>Strategy Editor</option>
              <option>Verification / Sandbox</option>
              <option>Results / Leaderboard</option>
              <option>Security Report</option>
            </select>

            <label className="auth-label" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              className="auth-input"
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Describe what happened, expected behavior, and steps to reproduce."
              required
            />

            <div className="auth-actions">
              <button type="submit">Send Query</button>
            </div>
          </form>

          {submitHint ? <p className="verify-meta">{submitHint}</p> : null}
        </section>
      </div>
    </HeroShell>
  );
}

export default Contact;

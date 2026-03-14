import { useMemo, useState } from "react";

function normalizeCode(children) {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.filter((item) => typeof item === "string").join("");
  }

  return "";
}

function DocsCodeBlock({ children, label }) {
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => normalizeCode(children), [children]);

  const handleCopy = async () => {
    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setCopied(true);
    }

    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="docs-code-block" data-copied={copied || undefined}>
      <div className="docs-code-toolbar">
        {label ? <span className="docs-code-label">{label}</span> : <span />}
        <button
          type="button"
          className="docs-code-button"
          onClick={handleCopy}
          disabled={!code}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="docs-code">{children}</pre>
    </div>
  );
}

export default DocsCodeBlock;

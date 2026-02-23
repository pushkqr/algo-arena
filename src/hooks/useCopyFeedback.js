import { useState } from "react";
import { toast } from "react-toastify";

export default function useCopyFeedback() {
  const [copiedField, setCopiedField] = useState("");

  async function copyField(label, value) {
    if (!value || value === "-") {
      return;
    }

    try {
      await navigator.clipboard.writeText(String(value));
      setCopiedField(label);
      toast.success(`${label} copied.`);
      window.setTimeout(() => {
        setCopiedField((current) => (current === label ? "" : current));
      }, 1400);
    } catch {
      setCopiedField("");
      toast.error("Failed to copy value.");
    }
  }

  return {
    copiedField,
    copyField,
  };
}

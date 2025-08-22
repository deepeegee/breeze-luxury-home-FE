"use client";

import { useEffect, useRef, useState } from "react";
import Form from "@/components/pages/contact/Form";

export default function FormWithToast() {
  const wrapRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const formEl = wrapRef.current ? wrapRef.current.querySelector("form") : null;
    if (!formEl) return;

    const handleSubmit = (e) => {
      if (e?.preventDefault) e.preventDefault();
      setShow(true);
      try {
        if (e?.target?.reset) e.target.reset();
      } catch {}
      const t = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(t);
    };

    formEl.addEventListener("submit", handleSubmit);
    return () => formEl.removeEventListener("submit", handleSubmit);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <Form />
      {show && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 9999,
            background: "#111",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: 10,
            boxShadow: "0 10px 24px rgba(0,0,0,.25)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>✅</span>
          <span>Message sent! We’ll get back to you shortly.</span>
        </div>
      )}
    </div>
  );
}

"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/lib/useApi";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get("from") || "/dashboard-home";
  const { trigger: login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email, password });
      const result = await login({ email, password });
      console.log("Login result:", result);

      let token = null;
      if (result?.token) token = result.token;
      else if (result?.data?.token) token = result.data.token;
      else if (result?.access_token) token = result.access_token;

      // ✅ Accept cookie-only success
      if (result?.success && !token) token = "http-only-cookie";

      if (token) {
        if (token !== "http-only-cookie") {
          // Optional: if BE also returns a token, mirror it in a non-HTTP-only cookie for the UI.
          const attrs = [`admin_session=${token}`, "path=/", "max-age=86400"];
          if (process.env.NODE_ENV === "production") {
            attrs.push("secure", "samesite=strict");
          }
          document.cookie = attrs.join("; ");
        }

        // ✅ Redirect to the original destination if present
        router.push(from);
        router.refresh?.();
        return;
      }

      console.error("No token found in response:", result);
      setError("Login failed. No authentication token received.");
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      <div className="mb25">
        <label className="form-label fw600 dark-color">Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb15">
        <label className="form-label fw600 dark-color">Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb10">
        <label className="custom_checkbox fz14 ff-heading">
          Remember me
          <input type="checkbox" defaultChecked />
          <span className="checkmark" />
        </label>
        <a className="fz14 ff-heading" href="#">
          Lost your password?
        </a>
      </div>

      <div className="d-grid mb20">
        <button className="ud-btn btn-thm" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Signing in...
            </>
          ) : (
            <>
              Sign in <i className="fal fa-arrow-right-long" />
            </>
          )}
        </button>
      </div>

      <p className="dark-color text-center mb0 mt10">
        Not signed up?{" "}
        <Link className="dark-color fw600" href="/register">
          Create an account.
        </Link>
      </p>
    </form>
  );
};

export default SignIn;

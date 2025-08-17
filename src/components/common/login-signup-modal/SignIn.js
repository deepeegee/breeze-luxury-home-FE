"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/lib/useApi";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { trigger: login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log('Attempting login with:', { email, password });
      const result = await login({ email, password });
      
      console.log('Login result:', result);
      
      // Handle different response formats
      let token = null;
      if (result.token) {
        token = result.token;
      } else if (result.data?.token) {
        token = result.data.token;
      } else if (result.access_token) {
        token = result.access_token;
      } else if (result.success && result.token === 'http-only-cookie') {
        // Backend set the token as HTTP-only cookie, login was successful
        token = 'http-only-cookie';
      }
      
      if (token) {
        if (token === 'http-only-cookie') {
          // Token is already set as HTTP-only cookie by backend
          console.log('Login successful, token set as HTTP-only cookie, redirecting to dashboard');
          router.push('/dashboard-home');
        } else {
          // Set the admin session cookie manually
          const cookieAttributes = [
            `admin_session=${token}`,
            'path=/',
            'max-age=86400'
          ];
          
          // Only add secure and samesite in production
          if (process.env.NODE_ENV === 'production') {
            cookieAttributes.push('secure', 'samesite=strict');
          }
          
          document.cookie = cookieAttributes.join('; ');
          console.log('Admin session cookie set, redirecting to dashboard');
          router.push('/dashboard-home');
        }
      } else {
        console.error('No token found in response:', result);
        setError("Login failed. No authentication token received.");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || "Login failed. Please try again.");
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
      {/* End email */}

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
      {/* End Password */}

      <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb10">
        <label className="custom_checkbox fz14 ff-heading">
          Remember me
          <input type="checkbox" defaultChecked="checked" />
          <span className="checkmark" />
        </label>
        <a className="fz14 ff-heading" href="#">
          Lost your password?
        </a>
      </div>
      {/* End  Lost your password? */}

      <div className="d-grid mb20">
        <button 
          className="ud-btn btn-thm" 
          type="submit"
          disabled={isLoading}
        >
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
      {/* End submit */}

      <div className="hr_content mb20">
        <hr />
        <span className="hr_top_text">OR</span>
      </div>

      <div className="d-grid mb10">
        <button className="ud-btn btn-white" type="button">
          <i className="fab fa-google" /> Continue Google
        </button>
      </div>
      <div className="d-grid mb10">
        <button className="ud-btn btn-fb" type="button">
          <i className="fab fa-facebook-f" /> Continue Facebook
        </button>
      </div>
      <div className="d-grid mb20">
        <button className="ud-btn btn-apple" type="button">
          <i className="fab fa-apple" /> Continue Apple
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

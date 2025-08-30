import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginClientWrapper from "@/components/common/login-signup-modal/LoginClientWrapper";  // Import directly

export const metadata = {
  title: "Login  ||  Breeze Luxury Homes",
};

export const dynamic = "force-dynamic"; // Keep this for dynamic rendering of the page.

export default function Login() {
  return (
    <section className="our-compare pt60 pb60">
      <Image
        width={1012}
        height={519}
        src="/images/icon/login-page-icon.svg"
        alt="logo"
        className="login-bg-icon contain"
        data-aos="fade-right"
        data-aos-delay="300"
      />
      <div className="container">
        <div className="row" data-aos="fade-left" data-aos-delay="300">
          <div className="col-lg-6">
            <div className="log-reg-form signup-modal form-style1 bgc-white p50 p30-sm default-box-shadow2 bdrs12">
              <div className="text-center mb40">
                <Link href="/">
                  <Image
                    width={138}
                    height={44}
                    className="mb25"
                    src="/images/header-logo2.svg"
                    alt="Breeze Luxury Homes Logo"
                  />
                </Link>
                <h2>Sign in</h2>
                <p className="text">
                  Sign in with this account across the following sites.
                </p>
              </div>

              {/* Wrap the client component (uses useSearchParams) in Suspense */}
              <Suspense fallback={<div>Loading sign-in…</div>}>
                <LoginClientWrapper />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import React from "react";

import { Brain, ClipboardMinus, FileUp, Play } from "lucide-react";
import { SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-page-bg">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src="/src/assets/landing-page.mp4"
        />

        <div className="absolute inset-0 bg-deep-charcoal/50" />

        <div className="absolute top-6 right-6 z-20 flex gap-4 items-center">
          <SignedOut>
            <Link to="/sign-in">
              <button className="px-4 py-2 text-card-white border border-border-gray rounded-xl hover:bg-hover-state/20">
                Login
              </button>
            </Link>

            <Link to="/sign-up">
              <button className="px-6 py-2 bg-alert-orange text-card-white rounded-xl hover:opacity-80">
                Sign Up
              </button>
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-card-white text-4xl md:text-6xl font-bold mb-15">
            Detect Rust Before It Becomes a Problem
          </h1>

          <h2 className="text-card-white text-lg md:text-2xl max-w-3xl">
            AI-powered rust detection for industrial equipment. Get instant
            analysis, severity reports, and maintenance recommendations in
            seconds.
          </h2>

          <div className="flex gap-4 mt-6">
            <SignedOut>
              <Link to="/sign-up">
                <button className="px-6 py-3 bg-alert-orange text-card-white rounded-2xl">
                  Start Free Analysis
                </button>
              </Link>
            </SignedOut>

            <Link to="/dashboard">
              <SignedIn>
                <button className="px-4 py-3 bg-processing-amber text-card-white rounded-2xl">
                  Dashboard
                </button>
              </SignedIn>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-card-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-industrial-navy mb-4">
            Three Simple Steps to Safer Equipment
          </h2>

          <p className="text-neutral-slate max-w-2xl mx-auto mb-16">
            Detect rust early, analyze severity instantly, and take action
            before damage escalates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div className="flex gap-5 p-6 rounded-2xl border border-border-gray shadow-sm hover:shadow-md transition bg-card-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-processing-amber/20 text-processing-amber">
                <FileUp size={26} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-deep-charcoal mb-2">
                  Upload Your Image
                </h3>
                <p className="text-sm text-neutral-slate leading-relaxed">
                  Upload photos of metal surfaces or equipment. Supports JPG,
                  PNG, and batch uploads for faster inspection.
                </p>
              </div>
            </div>

            <div className="flex gap-5 p-6 rounded-2xl border border-border-gray shadow-sm hover:shadow-md transition bg-card-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-processing-amber/20 text-processing-amber">
                <Brain size={26} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-deep-charcoal mb-2">
                  AI Analysis
                </h3>
                <p className="text-sm text-neutral-slate leading-relaxed">
                  Our AI engine detects rust patterns, evaluates severity, and
                  identifies affected areas in seconds.
                </p>
              </div>
            </div>

            <div className="flex gap-5 p-6 rounded-2xl border border-border-gray shadow-sm hover:shadow-md transition bg-card-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-processing-amber/20 text-processing-amber">
                <ClipboardMinus size={26} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-deep-charcoal mb-2">
                  Actionable Insights
                </h3>
                <p className="text-sm text-neutral-slate leading-relaxed">
                  Receive detailed reports with heat maps, risk levels, and
                  maintenance recommendations to prevent failures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;

import { SignUp } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function SignUpPage() {
  const leftRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      leftRef.current,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
    );

    gsap.fromTo(
      taglineRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.4 },
    );

    gsap.fromTo(
      cardRef.current,
      { x: 60, opacity: 0, scale: 0.97 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.2,
      },
    );

    gsap.fromTo(
      mascotRef.current,
      { y: -60, opacity: 0, rotation: -15 },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        ease: "bounce.out",
        delay: 0.6,
        onComplete: () => {
          gsap.to(mascotRef.current, {
            y: -14,
            rotation: 4,
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      },
    );
  }, []);

  return (
    <div
      className="min-h-screen flex overflow-hidden relative"
      style={{
        background: "#0f0f0f",
        fontFamily: "'Sora', 'Nunito', sans-serif",
      }}
    >
      {/* Ambient glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "5%",
          left: "5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(255,107,53,0.10)",
          filter: "blur(110px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "0%",
          right: "0%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "rgba(255,107,53,0.07)",
          filter: "blur(90px)",
        }}
      />

      {/* LEFT PANEL */}
      <div
        ref={leftRef}
        className="relative flex flex-col justify-between"
        style={{
          width: "52%",
          minHeight: "100vh",
          background: "linear-gradient(150deg, #FF6B35 0%, #d94010 100%)",
          padding: "48px 56px",
          overflow: "hidden",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.13) 0%, transparent 55%)",
          }}
        />

        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -120,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.12)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -60,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.08)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.03em",
            }}
          >
            RUSTDETECTOR
          </span>
        </div>

        {/* Center content */}
        <div
          ref={taglineRef}
          className="relative z-10 flex flex-col items-start"
          style={{ marginTop: "auto", marginBottom: "auto", paddingTop: 100 }}
        >
          <div
            ref={mascotRef}
            style={{ marginBottom: 40, position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                bottom: -12,
                left: "50%",
                transform: "translateX(-50%)",
                width: 140,
                height: 24,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.25)",
                filter: "blur(12px)",
              }}
            />
          </div>

          <h1
            style={{
              fontSize: "clamp(42px,4vw,64px)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              marginBottom: 20,
              maxWidth: 520,
            }}
          >
            Join the future.
            <br />
            Ship smarter.
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.78)",
              fontWeight: 500,
              lineHeight: 1.7,
              maxWidth: 420,
            }}
          >
            RUSTDETECTOR gives you the power of Rust-speed AI tooling — right in your
            workflow. No limits. No excuses.
          </p>
        </div>

        <div className="relative z-10"></div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className="flex flex-col items-center justify-center"
        style={{
          width: "48%",
          minHeight: "100vh",
          padding: "48px 56px",
          position: "relative",
        }}
      >
        <div ref={cardRef} style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ marginBottom: 32 }}></div>

          <SignUp
            appearance={{
              variables: {
                colorPrimary: "#FF6B35",
                colorBackground: "transparent",
                colorText: "#ffffff",
                colorTextSecondary: "rgba(255,255,255,0.6)",
                colorInputBackground: "rgba(255,255,255,0.06)",
                colorInputText: "#ffffff",
                borderRadius: "14px",
                fontFamily: "'Sora', 'Nunito', sans-serif",
              },
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none w-full p-0",
                header: "hidden",
                socialButtonsBlockButton:
                  "bg-white/6 hover:bg-white/12 border border-white/12 text-white transition-all duration-200 rounded-2xl h-12",
                socialButtonsBlockButtonText:
                  "text-white font-semibold text-sm",
                socialButtonsBlockButtonArrow: "text-white/60",
                dividerLine: "bg-white/15",
                dividerText:
                  "text-white/40 text-xs font-semibold tracking-widest uppercase",
                formFieldLabel:
                  "text-white/70 font-semibold text-xs tracking-wide uppercase mb-1.5",
                formFieldInput:
                  "bg-white/6 border border-white/12 hover:border-white/25 text-white placeholder:text-white/30 focus:border-[#FF6B35]/70 focus:bg-white/10 focus:ring-0 rounded-2xl py-3 px-4 text-sm transition-all",
                formFieldInputShowPasswordButton:
                  "text-white/40 hover:text-white/80",
                formButtonPrimary:
                  "bg-[#FF6B35] hover:bg-[#e8521e] text-white font-bold rounded-2xl py-3 text-sm tracking-wide transition-all duration-200 mt-1 shadow-lg shadow-orange-900/30",
                footerActionText: "text-white/40 text-xs",
                footerActionLink:
                  "text-[#FF6B35] font-bold text-xs hover:text-orange-300",
                footer: "bg-transparent border-t border-white/8 mt-4 pt-4",
                formFieldErrorText: "text-orange-300 text-xs",
                alertText: "text-white text-sm",
                identityPreviewText: "text-white text-sm",
                identityPreviewEditButtonIcon: "text-white/60",
                otpCodeFieldInput:
                  "border-b-2 border-white/20 focus:border-[#FF6B35] bg-transparent text-white text-xl font-bold text-center",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

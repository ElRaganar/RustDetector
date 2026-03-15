import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
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
        className="relative flex flex-col justify-between"
        style={{
          width: "52%",
          minHeight: "100vh",
          background: "linear-gradient(145deg, #FF6B35 0%, #cc3a0d 100%)",
          padding: "40px 52px",
          overflow: "hidden",
          animation: "slideLeft .85s cubic-bezier(.22,1,.36,1) both",
        }}
      >
        <style>{`
          @keyframes slideLeft  { from{opacity:0;transform:translateX(-50px)} to{opacity:1;transform:translateX(0)} }
          @keyframes slideRight { from{opacity:0;transform:translateX(50px)}  to{opacity:1;transform:translateX(0)} }
          @keyframes fadeUp     { from{opacity:0;transform:translateY(28px)}  to{opacity:1;transform:translateY(0)} }
          @keyframes float      { 0%,100%{transform:translateY(0px) rotate(1deg)} 50%{transform:translateY(-14px) rotate(-1deg)} }
          @keyframes shadowPulse{ 0%,100%{transform:translateX(-50%) scaleX(1);opacity:.22} 50%{transform:translateX(-50%) scaleX(.72);opacity:.11} }
          @keyframes eyeGlow    { 0%,100%{filter:drop-shadow(0 0 8px #FF6B35) drop-shadow(0 20px 40px rgba(0,0,0,.45))} 50%{filter:drop-shadow(0 0 22px #FF6B35) drop-shadow(0 0 40px rgba(255,107,53,.5)) drop-shadow(0 20px 40px rgba(0,0,0,.45))} }
        `}</style>

        {/* Sheen + deco circles */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 28% 18%, rgba(255,255,255,.14) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -110,
            left: -110,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(0,0,0,.13)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -55,
            left: -55,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(0,0,0,.08)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: -70,
            right: -70,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,.06)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div></div>
          <span
            style={{
              fontSize: 21,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-.03em",
            }}
          >
            RUSTAI
          </span>
        </div>

        {/* Hero content */}
        <div
          className="relative z-10 flex flex-col justify-center flex-1"
          style={{ paddingTop: 24, animation: "fadeUp .8s .3s both" }}
        >
          {/* Mascot */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: 24,
              animation: "float 2.8s ease-in-out infinite",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                width: 130,
                height: 18,
                borderRadius: "50%",
                background: "rgba(0,0,0,.28)",
                filter: "blur(9px)",
                animation: "shadowPulse 2.8s ease-in-out infinite",
              }}
            />
          </div>

          <h1
            style={{
              fontSize: "clamp(26px,2.8vw,44px)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-.035em",
              marginBottom: 14,
            }}
          >
            Build faster.
            <br />
            Scale smarter.
          </h1>
          <p
            style={{
              fontSize: 25,
              color: "rgba(255,255,255,.75)",
              fontWeight: 500,
              lineHeight: 1.65,
              maxWidth: 380,
            }}
          >
            Smart AI inspection for industrial equipment. Detect corrosion,
            predict maintenance, and prevent costly failures.
          </p>
        </div>
      </div>

      {/* Panel divider */}
      <div
        style={{
          width: 1,
          background: "rgba(255,255,255,.06)",
          alignSelf: "stretch",
        }}
      />

      {/* RIGHT PANEL */}
      <div
        className="flex items-center justify-center"
        style={{
          width: "48%",
          minHeight: "100vh",
          padding: "40px 52px",
          animation: "slideRight .85s cubic-bezier(.22,1,.36,1) .15s both",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-.03em",
                marginBottom: 6,
              }}
            >

            </h2>
          </div>

          <SignIn
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

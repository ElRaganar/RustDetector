import React, { useEffect, useRef, useState } from "react";
import {
  Brain,
  ClipboardMinus,
  FileUp,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import { SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../lib/api";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../Footer/Footer";

gsap.registerPlugin(ScrollTrigger);

/* ─── Three.js Iridescent Orb ─────────────────────────────────── */
const IridescentOrb = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 3.5;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        float noise(vec3 p) {
          return sin(p.x * 2.0 + uTime) * sin(p.y * 2.0 + uTime * 0.7) * sin(p.z * 2.0 + uTime * 0.5);
        }

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          vec3 pos = position;
          float n = noise(pos * 1.5 + uTime * 0.2);
          pos += normal * n * 0.12;
          pos.x += uMouse.x * 0.1;
          pos.y += uMouse.y * 0.1;
          vPosition = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        vec3 palette(float t) {
          vec3 a = vec3(0.1, 0.08, 0.05);
          vec3 b = vec3(0.5, 0.3, 0.1);
          vec3 c = vec3(1.0, 0.6, 0.2);
          vec3 d = vec3(0.0, 0.15, 0.4);
          return a + b * cos(6.28318 * (c * t + d));
        }

        void main() {
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(vNormal, viewDir), 2.5);
          float t = vUv.x * 3.0 + vUv.y * 2.0 + uTime * 0.3;
          vec3 col = palette(t);
          vec3 innerCol = palette(t + 0.5);
          col = mix(innerCol * 0.4, col, fresnel);
          float shimmer = sin(vPosition.x * 8.0 + uTime * 2.0) * 0.5 + 0.5;
          col += shimmer * 0.15 * vec3(1.0, 0.7, 0.3);
          float alpha = 0.6 + fresnel * 0.4;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const geo = new THREE.IcosahedronGeometry(1.2, 60);
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe87c3e,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.22, 12),
      wireMat,
    );
    scene.add(wire);

    const partGeo = new THREE.BufferGeometry();
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xe87c3e,
      size: 0.025,
      transparent: true,
      opacity: 0.6,
    });
    scene.add(new THREE.Points(partGeo, partMat));

    const mouse = { x: 0, y: 0 };
    const handleMouse = (e: { clientX: number; clientY: number }) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouse);

    let raf: number;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;
      material.uniforms.uMouse.value.x +=
        (mouse.x - material.uniforms.uMouse.value.x) * 0.05;
      material.uniforms.uMouse.value.y +=
        (mouse.y - material.uniforms.uMouse.value.y) * 0.05;
      mesh.rotation.y = t * 0.12;
      mesh.rotation.x = Math.sin(t * 0.08) * 0.2;
      wire.rotation.y = -t * 0.07;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const W2 = el.clientWidth,
        H2 = el.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

/* ─── Typing animation ─────────────────────────────────────────── */
const words = ["Corrosion", "Rust", "Degradation", "Oxidation", "Damage"];
const TypingWord = () => {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    let timeout: number | undefined;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(
        () => setDisplayed(word.slice(0, displayed.length + 1)),
        80,
      );
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(
        () => setDisplayed(word.slice(0, displayed.length - 1)),
        45,
      );
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return (
    <span
      className="inline-block"
      style={{ color: "#e87c3e", minWidth: "240px" }}
    >
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
};

/* ─── Main Landing ─────────────────────────────────────────────── */
const Landing = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const orbY = useTransform(scrollYProgress, [0, 0.5], [0, -120]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-reveal",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".steps-section", start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".gsap-stat",
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".stats-section", start: "top 80%" },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);
// here is  the code for the sending the tracking data to the backend part of the server
  useEffect(() => {
    
    const sendTrackingData = async () => {
      const trackingData = {
        url: window.location.href,
        referrer: document.referrer || "Direct",
        user_agent: navigator.userAgent,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString(),
      };

      try {
     
        await fetch(`${API_BASE_URL}/api/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trackingData),
        });
      } catch (error) {
      
        console.error("Failed to send tracking data:", error);
      }
    };

    sendTrackingData();
  }, []);

  const steps = [
    {
      icon: FileUp,
      title: "Upload Image",
      desc: "Drop photos of metal surfaces or equipment. JPG, PNG, batch — we handle it all.",
      num: "01",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      desc: "Our vision engine maps rust patterns, grades severity, and flags affected zones in seconds.",
      num: "02",
    },
    {
      icon: ClipboardMinus,
      title: "Actionable Report",
      desc: "Get heatmaps, risk tiers, and tailored maintenance steps to prevent costly failures.",
      num: "03",
    },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        background: "#0a0806",
        fontFamily: "'DM Sans', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .grain-overlay::before {
          content: '';
          position: fixed; inset: 0; z-index: 1000; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.35;
        }

        .glow-line {
          background: linear-gradient(90deg, transparent, #e87c3e, transparent);
          height: 1px;
          width: 100%;
          max-width: 56rem;
          margin: 0 auto;
        }

        .step-card {
          background: linear-gradient(135deg, rgba(232,124,62,0.06) 0%, rgba(17,14,10,0.9) 60%);
          border: 1px solid rgba(232,124,62,0.12);
          transition: border-color 0.3s, transform 0.3s;
        }
        .step-card:hover {
          border-color: rgba(232,124,62,0.45);
          transform: translateY(-6px);
        }

        .nav-pill {
          background: rgba(10, 8, 6, 0.75);
          border: 1px solid rgba(232,124,62,0.2);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        @keyframes floatAnim {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        .float-anim { animation: floatAnim 5s ease-in-out infinite; }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .pulse-cursor { animation: pulseDot 0.8s step-end infinite; }
      `}</style>

      <div className="grain-overlay" />

      {/* NAV */}
      <nav
        className="fixed top-4 left-1/2 z-50 nav-pill rounded-full px-6 py-3 flex items-center gap-5"
        style={{ transform: "translateX(-50%)" }}
      >
        <span
          style={{
            color: "#e87c3e",
            fontWeight: 800,
            fontSize: "0.95rem",
            letterSpacing: "-0.01em",
          }}
        >
          RUST<span style={{ color: "#fff" }}>AI</span>
        </span>
        <div
          style={{ width: 1, height: 18, background: "rgba(232,124,62,0.25)" }}
        />
        <div className="flex gap-3 items-center">
          <SignedOut>
            <Link to="/sign-in">
              <button
                style={{
                  color: "#c4a97a",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                className="hover:text-white transition-colors"
              >
                Login
              </button>
            </Link>
            <Link to="/sign-up">
              <button
                style={{
                  background: "#e87c3e",
                  color: "#fff",
                  fontSize: "0.78rem",
                  letterSpacing: "0.06em",
                  border: "none",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
                className="px-4 py-1.5 rounded-full hover:opacity-85 transition-opacity"
              >
                Get Started
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <button
                style={{
                  background: "#e87c3e",
                  color: "#fff",
                  fontSize: "0.78rem",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
                className="px-4 py-1.5 rounded-full hover:opacity-85 transition-opacity mr-2"
              >
                Dashboard
              </button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Three.js Orb */}
        <motion.div
          style={{
            y: orbY,
            opacity: orbOpacity,
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="float-anim"
        >
          <div
            style={{ width: "min(620px, 90vw)", height: "min(620px, 90vw)" }}
          >
            <IridescentOrb />
          </div>
        </motion.div>

        {/* Radial glow bg */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(232,124,62,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Hero copy */}
        <div
          className="relative z-10 text-center px-6"
          style={{ maxWidth: "860px", margin: "0 auto" }}
        >
          <motion.span
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              color: "#e87c3e",
              fontSize: "0.68rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 600,
              display: "block",
              marginBottom: "2rem",
            }}
          >
            AI-Powered Industrial Inspection
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 0.95,
              letterSpacing: "0.02em",
              marginBottom: "1.5rem",
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            Detect <br />
            <TypingWord />
            <br />
            Before It Strikes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.65 }}
            style={{
              color: "#9c8070",
              fontSize: "1rem",
              maxWidth: "480px",
              lineHeight: 1.75,
              margin: "0 auto 2.5rem",
            }}
          >
            Upload. Analyze. Prevent. Our vision AI spots corrosion at the
            earliest stage — saving equipment, money, and lives.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <SignedOut>
              <Link to="/sign-up">
                <button
                  style={{
                    background: "#e87c3e",
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    fontSize: "0.82rem",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1rem 2rem",
                    borderRadius: "1rem",
                  }}
                  className="hover:opacity-85 transition-all"
                >
                  Start Free Analysis <ArrowRight size={15} />
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard">
                <button
                  style={{
                    background: "#e87c3e",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1rem 2rem",
                    borderRadius: "1rem",
                    textTransform: "uppercase",
                  }}
                >
                  Dashboard <ArrowRight size={15} />
                </button>
              </Link>
            </SignedIn>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              color: "#3a2818",
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 1,
              height: 36,
              background: "linear-gradient(to bottom, #e87c3e, transparent)",
            }}
          />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="stats-section" style={{ padding: "5rem 1.5rem" }}>
        <div className="glow-line" style={{ marginBottom: "4rem" }} />
        <div
          style={{
            maxWidth: "56rem",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "2rem",
            textAlign: "center",
          }}
        >
          {[
            { value: "99.2%", label: "Detection Accuracy" },
            { value: "<3s", label: "Analysis Time" },
            { value: "50K+", label: "Images Analyzed" },
            { value: "4.8★", label: "Customer Rating" },
          ].map((s, i) => (
            <div
              key={i}
              className="gsap-stat"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "#e87c3e",
                  fontWeight: 800,
                  fontSize: "2.8rem",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  color: "#4a3828",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginTop: "0.4rem",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div className="glow-line" style={{ marginTop: "4rem" }} />
      </section>

      {/* HOW IT WORKS */}
      <section className="steps-section" style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: "4rem" }}
          >
            <span
              style={{
                color: "#e87c3e",
                fontSize: "0.68rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 600,
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              How It Works
            </span>
            <h2
              style={{
                color: "#fff",
                fontWeight: 400,
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                letterSpacing: "0.02em",
                lineHeight: 1,
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              Three steps to <span style={{ color: "#e87c3e" }}>safer</span>{" "}
              equipment
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                className="gsap-reveal step-card"
                style={{
                  borderRadius: "1.5rem",
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    right: 16,
                    fontSize: "7rem",
                    fontWeight: 900,
                    color: "rgba(232,124,62,0.05)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {step.num}
                </span>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "rgba(232,124,62,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  <step.icon size={22} color="#e87c3e" />
                </div>
                <h3
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1.15rem",
                    marginBottom: "0.6rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "#7a6050",
                    fontSize: "0.92rem",
                    lineHeight: 1.75,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHT */}
      <section
        style={{ padding: "6rem 1.5rem", background: "rgba(232,124,62,0.025)" }}
      >
        <div
          style={{
            maxWidth: "64rem",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 28,
              border: "1px solid rgba(232,124,62,0.15)",
              background:
                "linear-gradient(135deg, rgba(232,124,62,0.08), transparent)",
              padding: "3rem",
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {[1, 2, 3].map((r) => (
              <motion.div
                key={r}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{
                  duration: 2.5,
                  delay: r * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  borderRadius: "50%",
                  border: `1px solid rgba(232,124,62,${0.4 / r})`,
                  width: `${r * 80}px`,
                  height: `${r * 80}px`,
                }}
              />
            ))}
            <div
              style={{ textAlign: "center", position: "relative", zIndex: 2 }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(232,124,62,0.8), rgba(232,124,62,0.15))",
                  margin: "0 auto 1rem",
                  boxShadow: "0 0 32px rgba(232,124,62,0.4)",
                }}
              />
              <span
                style={{
                  color: "#e87c3e",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 4,
                  fontSize: "0.95rem",
                }}
              >
                High Severity Detected
              </span>
              <span style={{ color: "#5a4a3a", fontSize: "0.78rem" }}>
                Surface oxidation — 34% coverage
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                color: "#e87c3e",
                fontSize: "0.68rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 600,
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              Precision Analysis
            </span>
            <h2
              style={{
                color: "#fff",
                fontWeight: 400,
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                letterSpacing: "0.02em",
                lineHeight: 1.05,
                marginBottom: "1.25rem",
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              Visual intelligence that engineers trust
            </h2>
            <p
              style={{
                color: "#7a6050",
                lineHeight: 1.8,
                marginBottom: "2rem",
                fontSize: "0.92rem",
              }}
            >
              Our model was trained on hundreds of thousands of real industrial
              corrosion images. It distinguishes surface staining from
              structural rust with sub-millimeter accuracy.
            </p>
            {[
              { icon: Zap, label: "Real-time processing in under 3 seconds" },
              { icon: Shield, label: "99.2% accuracy on benchmark datasets" },
              {
                icon: BarChart3,
                label: "Severity grading from 1–5 risk tiers",
              },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.9rem",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "rgba(232,124,62,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <f.icon size={16} color="#e87c3e" />
                </div>
                <span style={{ color: "#c4a97a", fontSize: "0.88rem" }}>
                  {f.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "8rem 1.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,124,62,0.06) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <span
            style={{
              color: "#e87c3e",
              fontSize: "0.68rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 600,
              display: "block",
              marginBottom: "1rem",
            }}
          >
            Start Today
          </span>
          <h2
            style={{
              color: "#fff",
              fontWeight: 400,
              fontSize: "clamp(3rem, 7vw, 6rem)",
              letterSpacing: "0.03em",
              lineHeight: 0.95,
              marginBottom: "1.25rem",
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            Stop rust in its tracks.
          </h2>
          <p
            style={{
              color: "#7a6050",
              maxWidth: "420px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.75,
              fontSize: "0.93rem",
            }}
          >
            Join thousands of maintenance engineers who catch corrosion before
            it becomes catastrophic.
          </p>
          <SignedOut>
            <Link to="/sign-up">
              <button
                style={{
                  background: "#e87c3e",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "1.1rem 2.5rem",
                  borderRadius: "1rem",
                }}
                className="hover:opacity-85 transition-all"
              >
                Analyze Your First Image Free <ArrowRight size={16} />
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <button
                style={{
                  background: "#e87c3e",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "1.1rem 2.5rem",
                  borderRadius: "1rem",
                }}
                className="hover:opacity-85 transition-all"
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>
            </Link>
          </SignedIn>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

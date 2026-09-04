import React from "react";
import { useNavigate } from "react-router-dom";

type Tool = {
  id: string;
  name: string;
  description: string;
  action: string;
  icon: string;
};

const tools: Tool[] = [
  {
    id: "bmi",
    name: "BMI Calculator",
    description:
      "Check your Body Mass Index and understand your weight category.",
    action: "Calculate BMI",
    icon: "/assets/icons/bmi.png",
  },
  {
    id: "ideal-weight",
    name: "Ideal Weight",
    description:
      "Find an estimated healthy weight range based on your height.",
    action: "Check Weight",
    icon: "/assets/icons/ideal-weight.png",
  },
  {
    id: "bmr",
    name: "BMR Calculator",
    description:
      "Calculate your Basal Metabolic Rate and resting energy needs.",
    action: "Calculate BMR",
    icon: "/assets/icons/bmr.png",
  },
  {
    id: "calories",
    name: "Daily Calories",
    description:
      "Estimate your daily calorie needs based on your activity level.",
    action: "Calculate Calories",
    icon: "/assets/icons/calories.png",
  },
  {
    id: "water",
    name: "Water Intake",
    description:
      "Get a simple daily hydration target based on your body weight.",
    action: "Calculate Water",
    icon: "/assets/icons/water.png",
  },
  {
    id: "blood-pressure",
    name: "Blood Pressure",
    description:
      "Record and track your blood pressure readings over time.",
    action: "Track BP",
    icon: "/assets/icons/blood-pressure.png",
  },
  {
    id: "blood-sugar",
    name: "Blood Sugar",
    description:
      "Record and monitor your blood glucose measurements.",
    action: "Track Sugar",
    icon: "/assets/icons/blood-sugar.png",
  },
  {
    id: "weight",
    name: "Weight Tracker",
    description:
      "Track your body weight and follow your progress over time.",
    action: "Track Weight",
    icon: "/assets/icons/weight.png",
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleToolClick = (id: string) => {
    navigate(`/${id}`);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #F6FBFA;
        }

        button {
          font-family: inherit;
        }

        .careon-home {
          min-height: 100vh;
          background:
            linear-gradient(
              180deg,
              #F8FCFB 0%,
              #F3FAF9 48%,
              #F8FCFB 100%
            );
          color: #173B45;
          font-family:
            Arial,
            "Segoe UI",
            Roboto,
            Helvetica,
            sans-serif;
          padding-bottom: 45px;
        }

        /* =========================================
           HEADER
        ========================================= */

        .careon-home-header {
          background: rgba(255, 255, 255, 0.97);
          border-bottom: 1px solid #DCEBEA;
          padding: 15px 24px;
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(14px);
        }

        .careon-header-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .careon-brand-wrap {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .careon-logo {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background:
            linear-gradient(
              145deg,
              #1B8D8F,
              #147476
            );
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          font-weight: 800;
          box-shadow:
            0 7px 20px rgba(27, 141, 143, 0.18);
          flex-shrink: 0;
        }

        .careon-brand-name {
          margin: 0;
          font-size: 21px;
          line-height: 1.15;
          font-weight: 750;
          color: #173B45;
          letter-spacing: -0.4px;
        }

        .careon-brand-name span {
          color: #E54848;
        }

        .careon-brand-tagline {
          margin: 4px 0 0;
          color: #66808A;
          font-size: 12px;
        }

        /* =========================================
           NAVIGATION
        ========================================= */

        .careon-header-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .careon-nav-button {
          border: 1px solid #D7E9E7;
          background: #FFFFFF;
          color: #176F73;
          min-height: 38px;
          padding: 0 14px;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .careon-nav-button:hover {
          background: #EAF7F5;
          border-color: #B9DCDA;
          transform: translateY(-1px);
        }

        .careon-nav-button:active {
          transform: scale(0.98);
        }

        .careon-nav-button.primary {
          background: #E4F5F2;
          border-color: #CBE9E5;
        }

        .careon-nav-icon {
          font-size: 15px;
          line-height: 1;
        }

        /* =========================================
           MAIN
        ========================================= */

        .careon-main {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 44px 24px 0;
        }

        /* =========================================
           HERO
        ========================================= */

        .careon-hero {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 40px;
        }

        .careon-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 30px;
          background: #E4F5F2;
          color: #178385;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          margin-bottom: 15px;
        }

        .careon-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #1B8D8F;
          box-shadow:
            0 0 0 4px rgba(27, 141, 143, 0.08);
        }

        .careon-hero h2 {
          margin: 0;
          color: #153D48;
          font-size: clamp(29px, 4vw, 43px);
          line-height: 1.13;
          letter-spacing: -1.1px;
          font-weight: 800;
        }

        .careon-hero p {
          max-width: 660px;
          margin: 14px auto 0;
          color: #617984;
          font-size: 15px;
          line-height: 1.65;
        }

        /* =========================================
           SECTION
        ========================================= */

        .careon-section {
          margin-top: 34px;
        }

        .careon-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 17px;
        }

        .careon-section-title {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
          color: #173B45;
        }

        .careon-section-badge {
          padding: 6px 12px;
          border-radius: 20px;
          background: #E4F5F2;
          color: #178385;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        /* =========================================
           TOOLS GRID
        ========================================= */

        .careon-tools-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        /* =========================================
           TOOL CARD
        ========================================= */

        .careon-tool-card {
          position: relative;
          width: 100%;
          min-height: 270px;
          border: 1px solid #D9EAE8;
          border-radius: 21px;
          background: #FFFFFF;
          padding: 22px;
          text-align: left;
          cursor: pointer;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          box-shadow:
            0 5px 20px rgba(31, 86, 91, 0.055);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;

          font-family: inherit;
        }

        .careon-tool-card:hover {
          transform: translateY(-5px);
          border-color: #AED8D5;
          box-shadow:
            0 15px 35px rgba(27, 141, 143, 0.12);
        }

        .careon-tool-card:active {
          transform: scale(0.985);
        }

        .careon-tool-card:focus-visible {
          outline: 3px solid rgba(27, 141, 143, 0.24);
          outline-offset: 3px;
        }

        /* =========================================
           3D ICON
        ========================================= */

        .careon-tool-icon {
          width: 88px;
          height: 88px;
          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              #F0FAF9,
              #E2F4F1
            );

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 16px;

          border: 1px solid #D5ECE9;

          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.95),
            0 5px 12px rgba(27, 141, 143, 0.06);

          overflow: hidden;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .careon-tool-card:hover .careon-tool-icon {
          transform: translateY(-2px) scale(1.04);

          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.95),
            0 9px 20px rgba(27, 141, 143, 0.12);
        }

        .careon-tool-icon img {
          width: 82px;
          height: 82px;
          object-fit: contain;
          display: block;
          user-select: none;
          -webkit-user-drag: none;

          filter:
            drop-shadow(
              0 4px 5px rgba(0, 0, 0, 0.10)
            );
        }

        /* =========================================
           TOOL NAME
        ========================================= */

        .careon-tool-name {
          margin: 0;
          font-size: 17px;
          line-height: 1.3;
          color: #173B45;
          font-weight: 800;
        }

        /* =========================================
           DESCRIPTION
        ========================================= */

        .careon-tool-description {
          margin: 8px 0 0;
          color: #6A818B;
          font-size: 12.5px;
          line-height: 1.55;
          flex: 1;
        }

        /* =========================================
           ACTION
        ========================================= */

        .careon-tool-action {
          width: 100%;
          margin-top: 17px;
          padding-top: 13px;
          border-top: 1px solid #EDF3F2;

          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #168588;
          font-size: 11.5px;
          font-weight: 800;
        }

        .careon-arrow {
          width: 27px;
          height: 27px;
          border-radius: 50%;

          background: #E8F7F4;
          color: #168588;

          display: flex;
          align-items: center;
          justify-content: center;

          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .careon-tool-card:hover .careon-arrow {
          transform: translateX(3px);
          background: #DDF2EF;
        }

        .careon-arrow svg {
          width: 14px;
          height: 14px;
        }

        /* =========================================
           FOOTER
        ========================================= */

        .careon-footer-note {
          text-align: center;
          max-width: 600px;
          margin: 48px auto 0;
          padding: 20px 15px;

          color: #7A9098;
          font-size: 11px;
          line-height: 1.65;
        }

        .careon-footer-note strong {
          color: #168588;
        }

        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 1023px) {

          .careon-tools-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 599px) {

          .careon-home-header {
            padding: 12px 15px;
          }

          .careon-header-inner {
            gap: 10px;
          }

          .careon-brand-wrap {
            gap: 10px;
          }

          .careon-logo {
            width: 45px;
            height: 45px;
            border-radius: 13px;
            font-size: 21px;
          }

          .careon-brand-name {
            font-size: 18px;
          }

          .careon-brand-tagline {
            font-size: 10.5px;
          }

          .careon-header-nav {
            gap: 5px;
          }

          .careon-nav-button {
            min-height: 34px;
            padding: 0 9px;
            border-radius: 9px;
            font-size: 10px;
          }

          .careon-nav-icon {
            font-size: 13px;
          }

          .careon-main {
            padding: 29px 14px 0;
          }

          .careon-hero {
            margin-bottom: 30px;
          }

          .careon-eyebrow {
            font-size: 9px;
            letter-spacing: 0.8px;
            padding: 6px 11px;
          }

          .careon-hero h2 {
            font-size: 29px;
            letter-spacing: -0.7px;
          }

          .careon-hero p {
            font-size: 13.5px;
            line-height: 1.55;
            margin-top: 11px;
          }

          .careon-section {
            margin-top: 25px;
          }

          .careon-section-title {
            font-size: 17px;
          }

          .careon-section-badge {
            font-size: 9.5px;
            padding: 5px 9px;
          }

          .careon-tools-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .careon-tool-card {
            min-height: 0;
            padding: 17px;
            border-radius: 17px;

            display: grid;
            grid-template-columns: 72px 1fr;
            column-gap: 14px;
            align-items: center;
          }

          .careon-tool-icon {
            width: 72px;
            height: 72px;
            border-radius: 17px;

            grid-row: 1 / span 3;
            margin: 0;
          }

          .careon-tool-icon img {
            width: 68px;
            height: 68px;
          }

          .careon-tool-name {
            font-size: 15.5px;
          }

          .careon-tool-description {
            font-size: 11.8px;
            margin-top: 5px;
          }

          .careon-tool-action {
            margin-top: 8px;
            padding-top: 8px;
            font-size: 10.5px;
          }

          .careon-arrow {
            width: 25px;
            height: 25px;
          }

          .careon-footer-note {
            margin-top: 34px;
            font-size: 10.5px;
          }

        }

        @media (max-width: 390px) {

          .careon-brand-name {
            font-size: 16px;
          }

          .careon-brand-tagline {
            font-size: 9px;
          }

          .careon-nav-button {
            padding: 0 7px;
            font-size: 9px;
          }

        }

        /* =========================================
           REDUCED MOTION
        ========================================= */

        @media (prefers-reduced-motion: reduce) {

          .careon-tool-card,
          .careon-tool-icon,
          .careon-arrow,
          .careon-nav-button {
            transition: none;
          }

          html {
            scroll-behavior: auto;
          }

        }
      `}</style>

      <div className="careon-home">

        {/* HEADER */}

        <header className="careon-home-header">

          <div className="careon-header-inner">

            {/* BRAND */}

            <div className="careon-brand-wrap">

              <div className="careon-logo">
                C
              </div>

              <div>

                <h1 className="careon-brand-name">
                  Care<span>On</span> Health Tools
                </h1>

                <p className="careon-brand-tagline">
                  Caring Beyond Treatment
                </p>

              </div>

            </div>

            {/* NAVIGATION */}

            <nav className="careon-header-nav">

              <button
                type="button"
                className="careon-nav-button primary"
                onClick={() => navigate("/history")}
              >
                <span className="careon-nav-icon">
                  ◷
                </span>

                History
              </button>

              <button
                type="button"
                className="careon-nav-button"
                onClick={() => navigate("/reports")}
              >
                <span className="careon-nav-icon">
                  ▣
                </span>

                Reports
              </button>

            </nav>

          </div>

        </header>

        {/* MAIN */}

        <main className="careon-main">

          {/* HERO */}

          <section className="careon-hero">

            <div className="careon-eyebrow">

              <span className="careon-eyebrow-dot" />

              Trusted Health Tools

            </div>

            <h2>
              Your Simple Health Companion
            </h2>

            <p>
              Check your health measurements, understand your
              numbers, track your progress, and keep your
              important health records in one place.
            </p>

          </section>

          {/* HEALTH TOOLS */}

          <section className="careon-section">

            <div className="careon-section-header">

              <h3 className="careon-section-title">
                Health Tools
              </h3>

              <span className="careon-section-badge">
                8 tools
              </span>

            </div>

            <div className="careon-tools-grid">

              {tools.map((tool) => (

                <button
                  key={tool.id}
                  type="button"
                  className="careon-tool-card"
                  onClick={() => handleToolClick(tool.id)}
                >

                  {/* 3D REALISTIC ICON */}

                  <div className="careon-tool-icon">

                    <img
                      src={tool.icon}
                      alt=""
                      draggable={false}
                    />

                  </div>

                  {/* TOOL NAME */}

                  <h4 className="careon-tool-name">
                    {tool.name}
                  </h4>

                  {/* DESCRIPTION */}

                  <p className="careon-tool-description">
                    {tool.description}
                  </p>

                  {/* ACTION */}

                  <div className="careon-tool-action">

                    <span>
                      {tool.action}
                    </span>

                    <span className="careon-arrow">

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >

                        <path
                          d="M5 12H19M13 6L19 12L13 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                      </svg>

                    </span>

                  </div>

                </button>

              ))}

            </div>

          </section>

          {/* FOOTER */}

          <div className="careon-footer-note">

            <strong>
              CareOn Health Tools
            </strong>

            <br />

            For general health assessment and personal tracking.

            <br />

            This tool does not replace professional medical advice.

          </div>

        </main>

      </div>
    </>
  );
};

export default Home;
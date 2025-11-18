import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaChartBar, FaTools, FaBook } from "react-icons/fa";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import Footbar from "./components/Footbar";

gsap.registerPlugin(ScrollTrigger);

/* ───────── Styled Components ───────── */

const Page = styled.div`
  background: white;
  min-height: 100vh;
`;

const Hero = styled.section`
  padding: 120px 16px 80px;
  max-width: 1200px;
  margin: auto;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 100px 16px 60px;
  }
`;

const Badge = styled.span`
  background: #f0f4ff;
  color: #4f46e5;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-right: 12px;
  
  @media (max-width: 768px) {
    display: block;
    margin: 0 0 8px 0;
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.15;
  margin: 32px 0;
  color: #111827;
  
  @media (max-width: 768px) {
    margin: 24px 0;
    line-height: 1.2;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto 48px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin: 0 auto 32px;
    padding: 0 8px;
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    
    button {
      width: 100%;
      max-width: 280px;
    }
  }
`;

const PrimaryButton = styled.button`
  background: #4f46e5;
  color: white;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    transform: translateY(-2px);
    background: #4338ca;
  }
  
  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 15px;
  }
`;

const OutlineButton = styled.button`
  background: transparent;
  color: #4f46e5;
  border: 1px solid #d1d5db;
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
  
  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 15px;
  }
`;

const FeaturesSection = styled.section`
  background: #1e293b;
  color: white;
  padding: 120px 24px;
  
  @media (max-width: 768px) {
    padding: 80px 16px;
  }
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  @media (max-width: 768px) {
    gap: 40px;
  }
`;

const FeatureBlock = styled.div`
  display: flex;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const FeatureIcon = styled.div`
  background: #4f46e5;
  border-radius: 8px;
  padding: 10px;
  margin-right: 14px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CodeBox = styled.div`
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 32px;
  font-family: monospace;
  font-size: 15px;
  line-height: 1.4;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    padding: 20px;
    font-size: 13px;
    border-radius: 12px;
  }
`;

/* ───────── COMPONENT ───────── */

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const heroRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () =>
    navigate(isAuthenticated ? "/dashboard" : "/signup");

  useEffect(() => {
    if (!heroRef.current) return;

    gsap.from(heroRef.current.children, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.15,
      ease: "power3.out",
    });

    if (featureRef.current) {
      gsap.from(featureRef.current.children, {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: featureRef.current,
          start: "top 80%",
        },
      });
    }
  }, []);

  return (
    <Page>
      {/* ───────── HERO ───────── */}
      <Hero ref={heroRef}>
        <Badge>What’s new</Badge>
        <span style={{ color: "#6b7280" }}>Real-time market integration →</span>

        <HeroTitle>
          Revolutionizing <span style={{ color: "#4f46e5" }}>Financial Markets</span>{" "}
          one trade at a time.
        </HeroTitle>

        <HeroSubtitle>
          At Finport, modern investors deserve better tools — we’re here to deliver.
        </HeroSubtitle>

        <ButtonsRow>
          <PrimaryButton onClick={handleGetStarted}>Start Trading</PrimaryButton>
          <OutlineButton onClick={() => window.open("https://docs.finport.com")}>
            View API Docs →
          </OutlineButton>
        </ButtonsRow>
      </Hero>

      {/* ───────── FEATURES ───────── */}
      <FeaturesSection ref={featureRef}>
        <FeaturesGrid>
          <div>
            <h2 style={{ 
              fontSize: "clamp(1.8rem, 5vw, 2.3rem)", 
              marginBottom: 32,
              lineHeight: 1.2 
            }}>
              Built for traders, developers and innovators
            </h2>

            {[
              {
                icon: <FaChartBar size={22} />,
                title: "Real-time Market Data",
                desc: "Streaming price feeds & analytics updated every millisecond.",
              },
              {
                icon: <FaTools size={22} />,
                title: "Developer APIs",
                desc: "REST + WebSockets designed for automated & algo trading.",
              },
              {
                icon: <FaBook size={22} />,
                title: "Educational Resources",
                desc: "Guides, tutorials and insights for all levels.",
              },
            ].map((f, i) => (
              <FeatureBlock key={i}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <div>
                  <h3>{f.title}</h3>
                  <p style={{ color: "#94a3b8" }}>{f.desc}</p>
                </div>
              </FeatureBlock>
            ))}
          </div>

          <CodeBox>
            <span style={{ color: "#ef4444" }}>from finport import TradingClient</span>
            <br />
            <span style={{ color: "#94a3b8" }}>client = TradingClient("API_KEY")</span>
            <br />
            <br />
            <span style={{ color: "#ef4444" }}>for p in </span>
            <span style={{ color: "#94a3b8" }}>client.positions():</span>
            <br />
            <span style={{ color: "#fbbf24", marginLeft: 16 }}>
              print(p.symbol, p.value())
            </span>
          </CodeBox>
        </FeaturesGrid>
      </FeaturesSection>

      <Footbar />
    </Page>
  );
};

export default Home;

import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ───────────────── FOOTER WRAPPER ───────────────── */

const FooterWrapper = styled.footer`
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 80px 24px 32px;
  opacity: 0;              /* REQUIRED for animation */
  transform: translateY(40px);
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 64px;
`;

/* ───────────────── GRID ───────────────── */

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 48px;
`;

const BrandColumn = styled.div`
  grid-column: span 2;
  max-width: 420px;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const Column = styled.div``;

/* ───────────────── TEXT ───────────────── */

const Brand = styled.div`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #111827;
  margin-bottom: 16px;
`;

const InfoText = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 28px;
  font-size: 14.5px;
`;

const FooterTitle = styled.h3`
  color: #111827;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const FooterLink = styled.a`
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  transition: 0.25s;

  &:hover {
    color: #4f46e5;
    transform: translateX(3px);
  }
`;

const CopyText = styled.p`
  color: #9ca3af;
  font-size: 12px;
`;

/* ───────────────── EMAIL INPUT ───────────────── */

const EmailRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #4f46e5;
  }
`;

const SubscribeButton = styled.button`
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background: #4338ca;
  }
`;

/* ───────────────── SOCIAL ICONS ───────────────── */

const SocialRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 18px;
`;

const SocialIcon = styled.a`
  color: #9ca3af;
  font-size: 22px;
  transition: 0.25s;

  &:hover {
    color: #4f46e5;
    transform: translateY(-3px);
  }
`;

/* ───────────────── COMPONENT ───────────────── */

const Footbar: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    gsap.to(footerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 85%",
      },
    });
  }, []);

  return (
    <FooterWrapper ref={footerRef}>
      <FooterContainer>
        <FooterGrid>
          <BrandColumn>
            <Brand>📈 FINPORT</Brand>
            <InfoText>
              Subscribe for market reports, platform updates, and exclusive insights.
            </InfoText>

            <EmailRow>
              <EmailInput placeholder="Enter your email" />
              <SubscribeButton>Subscribe</SubscribeButton>
            </EmailRow>

            <CopyText>© Finport Trading Platform, Inc.</CopyText>
          </BrandColumn>

          <Column>
            <FooterTitle>Products</FooterTitle>
            <FooterLink href="/stocks">Stocks</FooterLink>
            <FooterLink href="/crypto">Crypto</FooterLink>
            <FooterLink href="/forex">Forex</FooterLink>
            <FooterLink href="/commodities">Commodities</FooterLink>
            <FooterLink href="/indices">Indices</FooterLink>
          </Column>

          <Column>
            <FooterTitle>Docs</FooterTitle>
            <FooterLink href="/documentation">Documentation</FooterLink>
            <FooterLink href="/tutorials">Tutorials</FooterLink>
            <FooterLink href="/api-reference">API Reference</FooterLink>
            <FooterLink href="/status">System Status</FooterLink>
          </Column>

          <Column>
            <FooterTitle>Company</FooterTitle>
            <FooterLink href="/about">About Finport</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/careers">Careers</FooterLink>
            <FooterLink href="/roadmap">Product Roadmap</FooterLink>
          </Column>

          <Column>
            <FooterTitle>Legal</FooterTitle>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/risk-disclosure">Risk Disclosure</FooterLink>
          </Column>
        </FooterGrid>

        <SocialRow>
          <SocialIcon><FaFacebookF /></SocialIcon>
          <SocialIcon><FaInstagram /></SocialIcon>
          <SocialIcon><FaTwitter /></SocialIcon>
          <SocialIcon><FaLinkedinIn /></SocialIcon>
          <SocialIcon><FaYoutube /></SocialIcon>
        </SocialRow>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footbar;

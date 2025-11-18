import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PageWrapper = styled.div`
  background: #fff;
  min-height: 100vh;
  padding: 110px 24px 40px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
  
  @media (max-width: 768px) {
    padding: 100px 16px 40px;
  }
`;

const Card = styled.div`
  max-width: 520px;
  margin: 0 auto;
  padding: 60px 48px;
  background: white;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
  
  @media (max-width: 768px) {
    padding: 40px 24px;
    margin: 0 16px;
    border-radius: 12px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 6px;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #6b7280;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

const Alert = styled.div<{ success?: string }>`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 14px;
  font-size: 14px;
  background: ${(p) => (p.success === "true" ? "#e6f4ea" : "#ffebee")};
  color: ${(p) => (p.success === "true" ? "#2e7d32" : "#d32f2f")};
`;

const Label = styled.label`
  font-weight: 600;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-top: 6px;
  margin-bottom: 20px;
  border-radius: 10px;
  font-size: 15px;
  border: 1px solid #d1d5db;
  outline: none;
  transition: 0.2s;

  &:focus {
    border-color: #4f46e5;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 6px;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 19px;
  opacity: 0.7;
  cursor: pointer;
  user-select: none;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin: 14px 0 24px;
`;

const LinkText = styled.span`
  cursor: pointer;
  color: #4f46e5;
  text-decoration: underline;
`;

const SubmitBtn = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  font-weight: 700;
  border: 1px solid black;
  background: ${(p) => (p.disabled ? "#6b7280" : "#4f46e5")};
  color: white;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  transition: 0.2s;
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 24px;
  font-size: 15px;
`;

const StrongLink = styled.a`
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
`;

const SignIn: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return setError("Invalid email format");
    if (!password) return setError("Enter password");

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("https://finportbackend.onrender.com/api/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user);
        setMessage("Sign-in success! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 800);
      } else setError(data.error ?? "Invalid credentials.");
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  return (
    <PageWrapper>
      <Card>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your Finport account</Subtitle>

        {error && <Alert>{error}</Alert>}
        {message && <Alert success="true">{message}</Alert>}

        <form onSubmit={handleSignIn}>
          <Label>Email</Label>
          <Input
            type="email"
            required
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Label>Password</Label>
          <PasswordContainer>
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <EyeIcon onClick={() => setShowPassword((p) => !p)}>
              {showPassword ? "🙈" : "👁️"}
            </EyeIcon>
          </PasswordContainer>

          <Row>
            <label style={{ display: "flex", gap: 6 }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <LinkText>Forgot password?</LinkText>
          </Row>

          <SubmitBtn disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign In"}
          </SubmitBtn>
        </form>

        <FooterText>
          Don’t have an account?{" "}
          <StrongLink href="/signup">Sign Up</StrongLink>
        </FooterText>
      </Card>
    </PageWrapper>
  );
};

export default SignIn;
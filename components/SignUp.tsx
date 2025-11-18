import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Page = styled.div`
  background: #ffffff;
  min-height: 100vh;
  padding: 110px 24px 40px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto;
`;

const Card = styled.div`
  max-width: 520px;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  padding: 60px 48px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #6b7280;
  margin-bottom: 32px;
`;

const Alert = styled.div<{ success?: boolean }>`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 14px;
  font-size: 14px;
  background: ${(p) => (p.success ? "#e6f4ea" : "#ffebee")};
  color: ${(p) => (p.success ? "#2e7d32" : "#d32f2f")};
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
  border: 1px solid #d1d5db;
  font-size: 15px;
  outline: none;
  transition: 0.2s;

  &:focus {
    border-color: #4f46e5;
  }
`;

const PasswordBox = styled.div`
  width: 100%;
  position: relative;
  margin-top: 6px;
`;

const Eye = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 19px;
  opacity: 0.7;
  cursor: pointer;
  user-select: none;
`;

const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid black;
  background: ${(p) => (p.disabled ? "#7a7a7a" : "#4f46e5")};
  color: white;
  font-weight: 700;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  transition: 0.2s;
  margin-top: 5px;
`;

const LinkText = styled.a`
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
`;

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!resendCooldown) return;
    const timer = setInterval(() => {
      setResendCooldown((n) => (n <= 1 ? 0 : n - 1));
      if (resendCooldown === 1) setCanResend(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return setError("Name required");
    if (!validateEmail(email)) return setError("Invalid email");
    if (password.length < 8) return setError("Min 8 characters");
    if (password !== confirmPassword) return setError("Passwords mismatch");

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/user/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        setOtpRequested(true);
        setMessage("OTP sent to your email.");
        setResendCooldown(data.canResendAfter ?? 60);
      } else setError(data.error ?? "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return setError("Enter valid 6-digit OTP");

    setLoading(true);
    try {
      const res = await fetch("/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpVerified(true);
        setMessage("OTP Verified 🎉");
      } else setError(data.error ?? "Wrong OTP");
    } finally {
      setLoading(false);
    }
  };

  const completeSignup = async () => {
    setLoading(true);
    const res = await fetch("/api/user/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (res.ok) {
      setMessage("Account created! You can now Sign In.");
      setOtpVerified(false);
      setOtpRequested(false);
    }
    setLoading(false);
  };

  return (
    <Page>
      <Card>
        <Title>Create Account</Title>
        <Subtitle>Join Finport and start trading today</Subtitle>

        {error && <Alert>{error}</Alert>}
        {message && <Alert success>{message}</Alert>}

        {!otpRequested && (
          <form onSubmit={requestOtp}>
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />

            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} required />

            <Label>Password</Label>
            <PasswordBox>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <Eye onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? "🙈" : "👁️"}
              </Eye>
            </PasswordBox>

            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button disabled={loading}>{loading ? "Sending..." : "Send OTP"}</Button>
          </form>
        )}

        {otpRequested && !otpVerified && (
          <>
            <Label>Enter OTP</Label>
            <Input
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
            />

            <Button disabled={loading} onClick={verifyOtp}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button disabled={!canResend} onClick={() => setResendCooldown(60)}>
              {resendCooldown > 0 ? `Wait ${resendCooldown}s` : "Resend OTP"}
            </Button>

            <Button onClick={() => setOtpRequested(false)}>Change Email</Button>
          </>
        )}

        {otpVerified && (
          <>
            <h3 style={{ textAlign: "center", marginBottom: 20 }}>
              🎉 Email Verified Successfully!
            </h3>

            <Button onClick={completeSignup} disabled={loading}>
              {loading ? "Creating..." : "Complete Registration"}
            </Button>
          </>
        )}

        <p style={{ textAlign: "center", marginTop: 24 }}>
          Already have an account? <LinkText href="/signin">Sign In</LinkText>
        </p>
      </Card>
    </Page>
  );
}
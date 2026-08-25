"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Standard fetch for login
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      //   Successfull login
      if (response.ok) {
        window.location.href = "/createblog";
      } else {
        setError(data.message || "Login Failed");
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center py-26">
      <div className="w-full max-w-[345px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-mono text-text-primary mb-2 text-center text-3xl font-semibold">
            Welcome back
          </h1>
          <p className="text-text-muted text-center">
            Please enter your credentials to continue
          </p>
        </div>

        {/* Login Fields */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
          {error && (
            <div className="bg-danger/10 text-danger rounded-full px-4 py-3 text-sm">
              {error}
            </div>
          )}
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="text-text-muted mb-2 block text-sm font-medium"
            >
              Email address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                <Mail className="text-text-muted h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border-subtle bg-surface text-text-primary placeholder-text-muted focus:border-accent block w-full rounded-full border py-3 pr-3 pl-14 transition-colors focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="text-text-muted mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                <Lock className="text-text-muted h-5 w-5" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border-subtle bg-surface text-text-primary placeholder-text-muted focus:border-accent block w-full rounded-full border py-3 pr-10 pl-14 transition-colors focus:outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center pr-4"
              >
                {showPassword ? (
                  <EyeOff className="text-text-muted hover:text-text-primary h-5 w-5" />
                ) : (
                  <Eye className="text-text-muted hover:text-text-primary h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-text-primary text-surface flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 font-semibold transition-opacity hover:opacity-90 focus:outline-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

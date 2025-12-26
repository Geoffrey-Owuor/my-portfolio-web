"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import ThemeToggleCompact from "../Theme/ThemeToggleCompact";
import { tools } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
        router.push("/blogs/createblog");
        router.refresh(); //refresh server components
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
    <>
      {/* Fixed Elements */}
      <div className="fixed top-4 left-4 z-50 py-0.5">
        {/* Logo */}
        <Link
          href="/"
          className="font-roboto-mono text-xl font-semibold text-gray-900 dark:text-white"
        >
          <span>{"<Jeff/>"}</span>
        </Link>
      </div>

      <div className="fixed top-3 right-4 z-50 lg:top-4">
        {/* Right Side Icons (Theme Toggle + GitHub) */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Theme Toggle Button - Reserve space for it */}
          <div className="flex h-5 w-10 items-center justify-center border-r border-gray-400 pr-6 dark:border-gray-700">
            <ThemeToggleCompact />
          </div>

          {/* GitHub Link Mobile */}
          <a
            href="https://github.com/Geoffrey-Owuor"
            title="My Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <Image
              src={tools.githubLogo}
              alt="GitHub Logo"
              width={24}
              height={24}
              className="h-6 w-6 dark:invert"
            />
          </a>

          {/* GitHub Link Desktop */}
          <a
            href="https://github.com/Geoffrey-Owuor"
            aria-label="GitHub Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-[10px] bg-gray-950 px-3 py-1.5 text-sm text-white transition-colors hover:bg-gray-900 hover:text-gray-200 lg:flex dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:hover:text-gray-900"
          >
            <Image
              src={tools.githubLogo}
              alt="GitHub Logo"
              width={24}
              height={24}
              className="h-5 w-5 invert dark:invert-0"
            />
            My portfolio
          </a>
        </div>
      </div>

      <div className="flex min-h-screen transition-colors duration-200">
        {/* Left side - Image (hidden on mobile) */}
        <div className="auth-background relative hidden overflow-hidden lg:flex lg:w-1/2"></div>

        {/* Right side - Login Form */}
        <div className="flex flex-1 items-center justify-center border-l border-gray-300 p-6 sm:p-12 dark:border-gray-800">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-semibold text-gray-900 dark:text-white">
                Welcome back
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Please enter your credentials to continue
              </p>
            </div>

            {/* Login Fields */}
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-6"
            >
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-400 bg-white py-3 pr-3 pl-10 text-gray-900 placeholder-gray-400 transition-colors focus:border-transparent focus:ring focus:ring-gray-600 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-gray-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-400 bg-white py-3 pr-10 pl-10 text-gray-900 placeholder-gray-400 transition-colors focus:border-transparent focus:ring-1 focus:ring-gray-600 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-gray-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white ring-offset-2 transition-colors hover:bg-gray-800 focus:ring-1 focus:ring-gray-600 focus:outline-none disabled:opacity-50 dark:bg-white dark:text-gray-950 dark:ring-offset-gray-950 dark:hover:bg-gray-200 dark:focus:ring-gray-300"
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
      </div>

      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 sm:bottom-2">
        <span className="flex items-center gap-1 text-sm whitespace-nowrap">
          &copy;{" "}
          <span className="font-roboto-mono">
            {new Date().getFullYear()} Jeff. All Rights Reserved
          </span>
        </span>
      </div>
    </>
  );
}

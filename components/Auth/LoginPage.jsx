"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

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
        router.push("/createblog");
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
    <div className="flex min-h-screen items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 flex justify-center">
          <div>
            <h1 className="mb-2 text-3xl font-semibold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please enter your credentials to continue
            </p>
          </div>
        </div>

        {/* Login Fields */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
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
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-full border border-gray-400 bg-white py-3 pr-3 pl-14 text-gray-900 placeholder-gray-400 transition-colors focus:border-transparent focus:ring focus:ring-gray-600 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-gray-500"
                placeholder="you@example.com"
                required
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
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-full border border-gray-400 bg-white py-3 pr-10 pl-14 text-gray-900 placeholder-gray-400 transition-colors focus:border-transparent focus:ring-1 focus:ring-gray-600 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-gray-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center pr-4"
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
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-4 py-3 font-semibold text-white ring-offset-2 transition-colors hover:bg-gray-800 focus:ring-1 focus:ring-gray-600 focus:outline-none disabled:opacity-50 dark:bg-white dark:text-gray-950 dark:ring-offset-gray-950 dark:hover:bg-gray-200 dark:focus:ring-gray-300"
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

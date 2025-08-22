"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"



export default function Loginpage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-md py-16">
          <div className="bg-sky-300 rounded-lg p-8 shadow-lg ">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Login</h1>
              <p className="text-gray-700">Please enter your information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />

                <div className="text-right mt-2">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Forget Passwords
                  </a>
                </div>
              </div>

            <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 rounded-full text-lg mt-8">
                Login
          </Button>
        <div className="text-center mt-6">
          <p className="text-black">Already have an account?{" "}
             <Link href="/login" className="text-red-600 hover:text-blue-400 underline">
                    Sign up
              </Link>
          </p>
        </div>
            </form>

            
          </div>
        </div>
      </div>
         
    </div>
  )
}

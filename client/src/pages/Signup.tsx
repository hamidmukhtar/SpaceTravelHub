
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add signup logic here
    console.log("Signup data:", formData);
  };

  return (
    <div className="min-h-screen bg-space-blue flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-space-blue-light/20 p-8 rounded-2xl backdrop-blur-lg">
        <div className="text-center">
          <h2 className="font-orbitron text-3xl font-bold text-lunar-white">Create Account</h2>
          <p className="mt-2 text-lunar-white/70">Join the space travel revolution</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                required
                className="bg-space-blue-light/30 border-cosmic-purple/20"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                className="bg-space-blue-light/30 border-cosmic-purple/20"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="bg-space-blue-light/30 border-cosmic-purple/20"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                className="bg-space-blue-light/30 border-cosmic-purple/20"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-cosmic-purple hover:bg-cosmic-purple/80"
          >
            Sign Up
          </Button>

          <div className="text-center text-sm">
            <span className="text-lunar-white/70">Already have an account? </span>
            <button
              type="button"
              onClick={() => setLocation("/dashboard")}
              className="text-aurora-teal hover:text-aurora-teal/80"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

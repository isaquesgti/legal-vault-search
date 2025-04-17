
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const mockAuthenticate = (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // First, check if the user exists in the users array
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: {email: string, password: string}) => 
        u.email === email && u.password === password
      );
      
      if (user) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        
        if (user.isAdmin) {
          localStorage.setItem("isAdmin", "true");
        } else {
          localStorage.removeItem("isAdmin");
        }
        
        resolve(true);
      } else if ((email === "admin" && password === "admin") || (email.trim() && password.trim())) {
        // Fallback for demo purposes
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        
        if (email === "admin" && password === "admin") {
          localStorage.setItem("isAdmin", "true");
        }
        
        resolve(true);
      } else {
        resolve(false);
      }
    }, 1000);
  });
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isAuthenticated = await mockAuthenticate(email, password);
      
      if (isAuthenticated) {
        toast({
          title: "Login successful",
          description: "Welcome to JuriFinder",
        });
        
        if (email === "admin" && password === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Acesse seu repositório JuriFinder
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-sm text-legal-primary hover:text-legal-accent"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-legal-primary hover:bg-legal-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
            className="text-legal-primary hover:text-legal-accent"
          >
            Create one
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

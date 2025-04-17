import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// This is a mock registration function. In a real app, this would connect to your backend
const mockRegister = (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulating API call
    setTimeout(() => {
      // For demo purposes, accept any combination except empty fields
      if (email.trim() && password.trim()) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        
        // Check if user is admin
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

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for admin user on component mount
  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    
    // If admin user doesn't exist, create it
    if (!existingUsers.some((user: {email: string}) => user.email === "admin")) {
      const adminUser = {
        email: "admin",
        password: "admin",
        isAdmin: true
      };
      
      localStorage.setItem("users", JSON.stringify([...existingUsers, adminUser]));
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const isRegistered = await mockRegister(email, password);
      
      if (isRegistered) {
        toast({
          title: "Registration successful",
          description: "Welcome to Legal Vault Search",
        });
        
        // Store user in users array
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const newUser = { email, password, isAdmin: email === "admin" && password === "admin" };
        localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
        
        if (email === "admin" && password === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast({
          title: "Registration failed",
          description: "Please try again with valid information",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration error",
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
        <CardTitle className="text-2xl text-center">Criar uma Conta</CardTitle>
        <CardDescription className="text-center">
          Junte-se ao JuriFinder hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-legal-primary hover:bg-legal-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            className="text-legal-primary hover:text-legal-accent"
          >
            Login
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;

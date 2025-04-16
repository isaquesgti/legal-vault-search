
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Database, Lock, Search } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="flex-1 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-legal-dark mb-6">
            Legal Vault <span className="text-legal-primary">Search</span>
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mb-10">
            Store, organize, and instantly search all your legal documents with intelligent features designed for legal professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-legal-primary hover:bg-legal-secondary"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <Database className="w-8 h-8 text-legal-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Storage</h3>
              <p className="text-gray-600">
                Store all your legal documents securely with enterprise-grade encryption and access controls.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <Search className="w-8 h-8 text-legal-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Intelligent Search</h3>
              <p className="text-gray-600">
                Instantly find any document with powerful full-text search across all your documents.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <Lock className="w-8 h-8 text-legal-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Privacy Focused</h3>
              <p className="text-gray-600">
                Your documents remain private and secure with strict access controls and compliance features.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-legal-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of legal professionals who trust Legal Vault Search with their documents.
          </p>
          <Button 
            size="lg" 
            className="bg-legal-primary hover:bg-legal-secondary"
            onClick={() => navigate("/signup")}
          >
            Create Your Account
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-bold">Legal Vault Search</p>
              <p className="text-gray-400 text-sm">Secure document management for legal professionals</p>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Legal Vault Search. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

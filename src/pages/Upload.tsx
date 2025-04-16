
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import DocumentUploader from "@/components/documents/DocumentUploader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Document } from "@/components/documents/DocumentList";

const Upload = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  const handleUploadComplete = (document: Document) => {
    // In a real app, the document would be added to the database
    // and the user would be redirected to the document page or the dashboard
    
    // For this demo, we'll just redirect to the dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to dashboard</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Upload Documents</h1>
            <p className="text-muted-foreground">
              Add new documents to your vault
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <DocumentUploader onUploadComplete={handleUploadComplete} />
          
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Document Security Information
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Documents are securely stored and encrypted at rest</li>
              <li>• Only you have access to your uploaded documents</li>
              <li>• Text extraction is performed securely</li>
              <li>• Document contents are indexed for fast searching</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;

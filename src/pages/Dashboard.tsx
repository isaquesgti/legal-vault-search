
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/search/SearchBar";
import DocumentList, { Document } from "@/components/documents/DocumentList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Users, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");
  const { toast } = useToast();

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    // Simulating API call to get documents
    const fetchDocuments = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const storedDocuments = localStorage.getItem("documents");
          if (storedDocuments) {
            setDocuments(JSON.parse(storedDocuments));
          }
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load documents",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDocuments();
    }
  }, [isAuthenticated, toast]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDocumentDelete = (id: string) => {
    // Remove document from state
    const updatedDocuments = documents.filter((doc) => doc.id !== id);
    setDocuments(updatedDocuments);
    
    // Update localStorage
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
    
    toast({
      title: "Document deleted",
      description: "The document has been successfully deleted",
    });
  };

  // Filter documents by type if filter is selected
  const filteredDocuments = documentTypeFilter !== "all"
    ? documents.filter((doc) => doc.type === documentTypeFilter)
    : documents;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Document Dashboard</h1>
          <p className="text-muted-foreground">
            Search, view, and manage your legal documents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-legal-primary mr-2" />
                <span className="text-2xl font-bold">{documents.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Client Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-legal-primary mr-2" />
                <span className="text-2xl font-bold">
                  {new Set(documents.map(doc => doc.clientName).filter(name => name)).size}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Filter by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All document types" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All document types</SelectItem>
                  <SelectItem value="petition">Petitions</SelectItem>
                  <SelectItem value="contract">Contracts</SelectItem>
                  <SelectItem value="decision">Court Decisions</SelectItem>
                  <SelectItem value="correspondence">Correspondence</SelectItem>
                  <SelectItem value="evidence">Evidence</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <DocumentList
          documents={filteredDocuments}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onDocumentDelete={handleDocumentDelete}
        />
      </main>
    </div>
  );
};

export default Dashboard;

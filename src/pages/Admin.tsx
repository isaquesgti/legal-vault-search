import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  Search, 
  Trash2, 
  Plus, 
  Upload, 
  Filter,
  Download,
  Eye
} from "lucide-react";
import { Document } from "@/components/documents/DocumentList";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/components/auth/AuthProvider";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    // If using hardcoded admin login, check localStorage
    const localIsAdmin = localStorage.getItem("isAdmin") === "true";
    
    if (!isAdmin && !localIsAdmin) {
      navigate("/login");
      return;
    }
    
    // Load users and documents
    loadData();
  }, [isAdmin, navigate, toast]);

  const loadData = () => {
    setIsLoading(true);
    
    try {
      // Load users
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        // If no stored users, create a default admin user
        const defaultUsers = [
          { email: "admin", isAdmin: true }
        ];
        localStorage.setItem("users", JSON.stringify(defaultUsers));
        setUsers(defaultUsers);
      }
      
      // Load documents
      const storedDocuments = localStorage.getItem("documents");
      if (storedDocuments) {
        setDocuments(JSON.parse(storedDocuments));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    navigate("/signup");
  };

  const handleUploadDocument = () => {
    navigate("/upload");
  };

  const handleDeleteUser = (email: string) => {
    const updatedUsers = users.filter(user => user.email !== email);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    toast({
      title: "User deleted",
      description: `User ${email} has been removed`,
    });
  };

  const handleDeleteDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
    
    toast({
      title: "Document deleted",
      description: "The document has been successfully deleted",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users and documents
          </p>
        </div>

        <div className="mb-6 flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users or documents..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="ml-4 flex space-x-2">
            <Button onClick={() => navigate('/admin/users')}>
              <Users className="mr-1 h-4 w-4" /> Manage Users
            </Button>
            <Button onClick={() => navigate('/upload')}>
              <Upload className="mr-1 h-4 w-4" /> Upload Document
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-legal-primary mr-2" />
                <span className="text-2xl font-bold">{users.length}</span>
              </div>
            </CardContent>
          </Card>
          
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
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" /> Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.email}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.isAdmin ? "default" : "secondary"}>
                            {user.isAdmin ? "Admin" : "User"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/admin/users')}
                          >
                            Gerenciar Usuários
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;

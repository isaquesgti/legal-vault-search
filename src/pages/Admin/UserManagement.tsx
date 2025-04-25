
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";
import { UserProfile } from "@/types/auth";

const UserManagement = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // Verificar admin no localStorage (para desenvolvimento)
      const isAdmin = localStorage.getItem("isAdmin");
      if (!isAdmin) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive"
        });
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) {
        throw error;
      }

      console.log("Perfis obtidos:", data);
      setProfiles(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar perfis:", error);
      toast({
        title: "Erro ao buscar usuários",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-500 text-white";
      case "pendente":
        return "bg-yellow-500 text-white";
      case "bloqueado":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredProfiles = searchTerm 
    ? profiles.filter(profile => 
        profile.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.status?.toLowerCase().includes(searchTerm.toLowerCase()))
    : profiles;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.id}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(profile.status || "")}>
                      {profile.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      onClick={() => handleViewUser(profile.id || "")}
                    >
                      Ver detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagement;

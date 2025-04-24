
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }
    
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId, isAdmin, navigate]);

  const fetchUserDetails = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (profileError) throw profileError;
      
      // Get user auth data
      const { data: authData, error: authError } = await supabase.auth.admin.getUserById(id);
      
      if (authError) throw authError;
      
      const userData = {
        ...profile,
        email: authData?.user?.email || "Email não encontrado",
        created_at: authData?.user?.created_at || "Data não encontrada",
      };
      
      setUser(userData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados do usuário",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/users")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          
          <h1 className="text-2xl font-bold">Detalhes do Usuário</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Carregando dados do usuário...</p>
          </div>
        ) : !user ? (
          <div className="flex justify-center items-center h-40">
            <p>Usuário não encontrado</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{user.email}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium">ID</p>
                <p className="text-sm text-muted-foreground">{user.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground capitalize">{user.status}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Data de cadastro</p>
                <p className="text-sm text-muted-foreground">
                  {user.created_at ? new Date(user.created_at).toLocaleString() : "Data não disponível"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default UserDetails;

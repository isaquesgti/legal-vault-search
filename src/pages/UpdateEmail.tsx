
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";

const UpdateEmail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        throw new Error("Usuário não está autenticado");
      }

      // First, verify the user's password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || "",
        password,
      });

      if (signInError) {
        throw new Error("Senha incorreta");
      }

      // Then update the email
      const { error } = await supabase.auth.updateUser({ email });

      if (error) throw error;

      toast({
        title: "Solicitação enviada",
        description: "Verifique seu novo email para confirmar a alteração.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro na atualização",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Atualizar Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentEmail">Email atual</Label>
                  <Input
                    id="currentEmail"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newEmail">Novo email</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder="Digite seu novo email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Sua senha atual</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha atual para confirmar"
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
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    "Atualizar email"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                variant="link"
                onClick={() => navigate("/dashboard")}
                className="text-legal-primary hover:text-legal-accent"
              >
                Voltar para o Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UpdateEmail;

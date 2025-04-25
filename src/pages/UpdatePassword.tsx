
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "As senhas não coincidem",
        description: "Por favor, verifique suas senhas.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Obter token da URL
      const token = searchParams.get("token");
      
      if (!token) {
        throw new Error("Token de redefinição de senha não encontrado.");
      }

      // Verificar se o usuário está atualmente logado e tentando mudar sua senha
      const { data: { session } } = await supabase.auth.getSession();
      
      let result;
      
      if (session) {
        // Usuário está logado, use updateUser
        result = await supabase.auth.updateUser({
          password: password
        });
      } else {
        // Usuário não está logado, use redefinição de senha com token
        result = await supabase.auth.resetPasswordForEmail(searchParams.get("email") || "", {
          redirectTo: `${window.location.origin}/update-password`,
        });
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });

      navigate("/login");
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao atualizar sua senha.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 
            className="text-3xl font-bold text-legal-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            JuriFinder
          </h1>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Atualizar Senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua nova senha"
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
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  "Atualizar senha"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Lembrou sua senha?{" "}
              <Button
                variant="link"
                className="text-legal-primary hover:text-legal-accent"
                onClick={() => navigate("/login")}
              >
                Voltar para o login
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UpdatePassword;

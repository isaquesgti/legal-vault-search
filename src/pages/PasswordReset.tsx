
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        throw error;
      }

      setIsSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      console.error("Erro ao enviar email de redefinição:", error);
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Ocorreu um erro ao enviar o email de redefinição.",
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
            <CardTitle className="text-2xl text-center">Redefinir Senha</CardTitle>
          </CardHeader>
          <CardContent>
            {!isSent ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      Enviando...
                    </>
                  ) : (
                    "Enviar link de redefinição"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <p className="mb-4">
                  Um email de redefinição de senha foi enviado para {email}.
                  Por favor, verifique sua caixa de entrada.
                </p>
                <Button
                  onClick={() => setIsSent(false)}
                  variant="outline"
                  className="mr-2"
                >
                  Tentar novamente
                </Button>
              </div>
            )}
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

export default PasswordReset;

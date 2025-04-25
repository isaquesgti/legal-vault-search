
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Tentando fazer login com:", email);

      // Hardcoded admin login for testing/development
      if (email === "admin" && password === "admin") {
        console.log("Login administrativo especial detectado");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("isAdmin", "true");
        
        toast({
          title: "Login administrativo realizado",
          description: "Bem-vindo ao modo administrador",
        });
        
        navigate("/admin");
        return;
      }

      // Tentar login no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro de login:", error);
        throw error;
      }

      console.log("Login bem-sucedido:", data);
      
      if (!data.user) {
        throw new Error('Nenhum usuário retornado do login');
      }

      // Verificar status do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', data.user.id)
        .maybeSingle(); // Usando maybeSingle em vez de single para evitar o erro

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
        throw profileError;
      }

      console.log("Perfil do usuário:", profileData);

      if (!profileData) {
        // Se o perfil não existir, criar um perfil novo com status pendente
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: data.user.id, status: 'pendente' });
        
        if (insertError) {
          console.error("Erro ao criar perfil:", insertError);
          // Continuar mesmo com erro, mas logar o usuário
        }
        
        // Deslogar o usuário pois o perfil está pendente
        await supabase.auth.signOut();
        throw new Error('Sua conta está pendente de aprovação pelo administrador.');
      }

      if (profileData.status !== 'ativo') {
        // Se o usuário não estiver ativo, deslogar e mostrar mensagem
        await supabase.auth.signOut();
        throw new Error('Sua conta não está ativa. Entre em contato com o administrador.');
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao JuriFinder",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro completo:", error);
      toast({
        title: "Falha no login",
        description: error.message || "Ocorreu um erro durante o login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Entrar</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Button
                variant="link"
                className="text-sm text-legal-primary hover:text-legal-accent"
                onClick={() => navigate("/reset-password")}
              >
                Esqueceu sua senha?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
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
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Ainda não tem uma conta?{" "}
          <Button
            variant="link"
            className="text-legal-primary hover:text-legal-accent"
            onClick={() => navigate("/signup")}
          >
            Crie agora
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

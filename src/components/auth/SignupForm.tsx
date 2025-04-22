
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Agora todo usuário cadastrado será admin
const mockRegister = (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email.trim() && password.trim()) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isAdmin", "true");
        resolve(true);
      } else {
        resolve(false);
      }
    }, 1000);
  });
};

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (!existingUsers.some((user: {email: string}) => user.email === "admin")) {
      const adminUser = {
        email: "admin",
        password: "admin",
        isAdmin: true
      };
      localStorage.setItem("users", JSON.stringify([...existingUsers, adminUser]));
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
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
      const isRegistered = await mockRegister(email, password);
      if (isRegistered) {
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Bem-vindo ao JuriFinder",
        });
        // Todo usuário agora é admin ao se cadastrar
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const newUser = { email, password, isAdmin: true };
        localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
        navigate("/admin");
      } else {
        toast({
          title: "Falha no cadastro",
          description: "Preencha com informações válidas.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
        <CardDescription className="text-center">
          Junte-se ao JuriFinder
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
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
            {isLoading ? "Criando conta..." : "Cadastrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Já possui uma conta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            className="text-legal-primary hover:text-legal-accent"
          >
            Entrar
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;

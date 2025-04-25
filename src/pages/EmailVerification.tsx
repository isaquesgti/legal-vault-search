
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  
  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = searchParams.get("token");
        const type = searchParams.get("type");

        if (!token || type !== "signup") {
          setStatus("error");
          toast({
            title: "Erro na verificação",
            description: "Link de verificação inválido ou expirado.",
            variant: "destructive"
          });
          return;
        }

        // Confirm the signup
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        });

        if (error) {
          console.error("Erro na verificação:", error);
          setStatus("error");
          toast({
            title: "Erro na verificação",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        setStatus("success");
        toast({
          title: "Email verificado com sucesso",
          description: "Sua conta está ativa e você pode fazer login agora.",
        });
      } catch (error: any) {
        console.error("Erro na verificação:", error);
        setStatus("error");
        toast({
          title: "Erro na verificação",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    confirmEmail();
  }, [searchParams, toast]);

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
            <CardTitle className="text-2xl text-center">
              Verificação de Email
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-16 w-16 text-legal-primary animate-spin mb-4" />
                <p className="text-center text-gray-700">
                  Verificando seu email...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-center text-gray-700">
                  Email verificado com sucesso! Sua conta agora está ativa.
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <p className="text-center text-gray-700">
                  Ocorreu um erro ao verificar seu email. O link pode estar expirado ou ser inválido.
                </p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => navigate("/login")}
              className="bg-legal-primary hover:bg-legal-secondary"
            >
              {status === "success" ? "Ir para o Login" : "Voltar para o Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;

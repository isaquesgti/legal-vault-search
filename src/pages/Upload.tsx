
import { Navigate, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import DocumentUploader from "@/components/documents/DocumentUploader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Document } from "@/components/documents/DocumentList";
import { useToast } from "@/components/ui/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  const handleUploadComplete = (document: Document) => {
    toast({
      title: "Documento enviado com sucesso!",
      description: "Você será redirecionado para o painel",
    });
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Voltar para o painel</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Enviar Documentos</h1>
            <p className="text-muted-foreground">
              Adicione novos documentos ao seu repositório
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <DocumentUploader onUploadComplete={handleUploadComplete} />
          
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Informações de Segurança dos Documentos
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Os documentos são armazenados de forma segura e criptografados</li>
              <li>• Apenas você tem acesso aos seus documentos</li>
              <li>• A extração de texto é realizada com segurança</li>
              <li>• O conteúdo dos documentos é indexado para busca rápida</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;

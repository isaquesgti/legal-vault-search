import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Database, Lock, Search } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="flex-1 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-legal-dark mb-6">
            Juri<span className="text-legal-primary">Finder</span>
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mb-10">
            Armazene, organize e pesquise instantaneamente todos os seus documentos jurídicos com recursos inteligentes projetados para profissionais do direito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-legal-primary hover:bg-legal-secondary"
              onClick={() => navigate("/login")}
            >
              Entrar
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/signup")}
            >
              Cadastrar-se
            </Button>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <Database className="w-8 h-8 text-legal-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Armazenamento Seguro</h3>
              <p className="text-gray-600">
                Armazene todos os seus documentos jurídicos de forma segura com criptografia de nível empresarial e controles de acesso.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <Search className="w-8 h-8 text-legal-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Busca Inteligente</h3>
              <p className="text-gray-600">
                Encontre instantaneamente qualquer documento com busca de texto completo em todos os seus documentos.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <Lock className="w-8 h-8 text-legal-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Foco em Privacidade</h3>
              <p className="text-gray-600">
                Seus documentos permanecem privados e seguros com rígidos controles de acesso e recursos de conformidade.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-legal-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais jurídicos que confiam no Cofre Jurídico para gerenciar seus documentos.
          </p>
          <Button 
            size="lg" 
            className="bg-legal-primary hover:bg-legal-secondary"
            onClick={() => navigate("/signup")}
          >
            Crie sua Conta
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-bold">JuriFinder</p>
              <p className="text-gray-400 text-sm">Gerenciamento de documentos seguro para profissionais jurídicos</p>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} JuriFinder. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

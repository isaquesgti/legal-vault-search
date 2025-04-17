
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const userEmail = localStorage.getItem("userEmail") || "usuario@exemplo.com";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    
    toast({
      title: "Deslogado",
      description: "Você foi desconectado com sucesso",
    });
    
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-legal-primary">Cofre Jurídico</span>
          </Link>

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Alternar menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <span className="text-lg font-bold">Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Fechar menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col space-y-4">
                  <Link 
                    to="/dashboard" 
                    className="px-4 py-2 rounded-md hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    Painel
                  </Link>
                  <Link 
                    to="/upload" 
                    className="px-4 py-2 rounded-md hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    Enviar Documentos
                  </Link>
                </nav>
                <div className="mt-auto pt-4 border-t">
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    Logado como {userEmail}
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full mt-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className="text-foreground hover:text-legal-primary font-medium"
            >
              Painel
            </Link>
            <Link 
              to="/upload" 
              className="text-foreground hover:text-legal-primary font-medium"
            >
              Enviar Documentos
            </Link>
          </nav>

          {/* User menu - desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-legal-light text-legal-primary">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium hidden lg:inline-block">
                {userEmail}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

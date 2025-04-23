
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, UserRole } from "@/types/auth";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userStatus: string | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userStatus: null,
  isAdmin: false,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const checkUserRole = async (userId: string) => {
    try {
      console.log("Verificando função do usuário:", userId);
      const { data: role, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error("Erro ao verificar função:", error);
        return;
      }
      
      console.log("Função do usuário:", role);
      setIsAdmin(role?.role === 'admin');
    } catch (error) {
      console.error("Erro ao verificar função:", error);
    }
  };

  const checkUserStatus = async (userId: string) => {
    try {
      console.log("Verificando status do usuário:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Erro ao verificar status:", error);
        return null;
      }
      
      console.log("Status do usuário:", profile?.status);
      return profile?.status;
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      return null;
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      console.log("Configurando autenticação...");
      
      // Primeiro, configurar o listener para mudanças de estado de autenticação
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Evento de autenticação:", event, session?.user?.email);
          
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            const status = await checkUserStatus(session.user.id);
            console.log("Status obtido:", status);
            
            if (status !== 'ativo') {
              console.log("Usuário não está ativo, deslogando...");
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
              setUserStatus(null);
              setIsAdmin(false);
              
              if (status) { // Só mostrar mensagem se obtivemos um status válido
                toast({
                  title: "Acesso Negado",
                  description: "Sua conta não está ativa. Entre em contato com o administrador.",
                  variant: "destructive",
                });
              }
              return;
            }
            
            setUserStatus(status);
            await checkUserRole(session.user.id);
          } else {
            setUserStatus(null);
            setIsAdmin(false);
          }
        }
      );

      // Depois, verificar a sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Sessão atual:", session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const status = await checkUserStatus(session.user.id);
        console.log("Status inicial:", status);
        
        if (status !== 'ativo') {
          console.log("Usuário não está ativo na verificação inicial, deslogando...");
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          
          if (status) {
            toast({
              title: "Acesso Negado",
              description: "Sua conta não está ativa. Entre em contato com o administrador.",
              variant: "destructive",
            });
          }
          return;
        }
        
        setUserStatus(status);
        await checkUserRole(session.user.id);
      }

      console.log("Configuração de autenticação concluída");
      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, [toast]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setUserStatus(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, userStatus, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

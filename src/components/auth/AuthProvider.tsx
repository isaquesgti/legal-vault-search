
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
    const { data: role } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    setIsAdmin(role?.role === 'admin');
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('status')
            .eq('id', session.user.id)
            .single();

          if (!profile || profile.status !== 'ativo') {
            await supabase.auth.signOut();
            toast({
              title: "Acesso Negado",
              description: "Sua conta não está ativa. Entre em contato com o administrador.",
              variant: "destructive",
            });
            return;
          }
          
          setUserStatus(profile.status);
          await checkUserRole(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRole(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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

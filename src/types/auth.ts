
export interface UserProfile {
  id: string;
  status: 'pendente' | 'ativo' | 'bloqueado';
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

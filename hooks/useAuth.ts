import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, setUser } = useAuthStore();

  const login = (userData: any) => setUser(userData);
  const logout = () => setUser(null);

  return { user, login, logout };
};

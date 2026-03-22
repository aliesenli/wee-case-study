import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authClient } from "@/api/auth";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((res) => {
      setUser((res.data?.user as unknown as User) ?? null);
      setIsLoading(false);
    });
  }, []);

  async function signIn(email: string, password: string) {
    const res = await authClient.signIn.email({ email, password });
    if (res.error) throw new Error(res.error.message ?? "Sign in failed");
    setUser(res.data?.user as unknown as User ?? null);
  }

  async function signUp(name: string, email: string, password: string) {
    const res = await authClient.signUp.email({ name, email, password });
    if (res.error) throw new Error(res.error.message ?? "Sign up failed");
    setUser(res.data?.user as unknown as User ?? null);
  }

  async function signOut() {
    await authClient.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

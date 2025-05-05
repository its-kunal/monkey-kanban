"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";

interface AuthContenxtType {
  user?: User;
  loading: boolean;
}

const AuthContext = createContext<AuthContenxtType>({
  user: undefined,
  loading: true,
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthContenxtType["user"]>(undefined);
  const [loading, setLoading] = useState<AuthContenxtType["loading"]>(true);

  useEffect(() => {
    const authSubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user === null) setUser(undefined);
      else setUser(user);
      setLoading(false);
    });
    return () => {
      authSubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ loading, user }}>
      {children}
    </AuthContext.Provider>
  );
}

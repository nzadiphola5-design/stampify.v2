"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "./client";
import type { Database } from "./database.types";

export type Business = Database["public"]["Tables"]["businesses"]["Row"];

interface BusinessContextType {
  business: Business | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType>({
  business: null,
  loading: true,
  refresh: async () => {},
});

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBusiness = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setBusiness(data ?? null);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBusiness(); }, [fetchBusiness]);

  return (
    <BusinessContext.Provider value={{ business, loading, refresh: fetchBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}

export const useBusiness = () => useContext(BusinessContext);

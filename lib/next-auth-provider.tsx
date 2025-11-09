// @/lib/next-auth-provider.tsx
'use client'; // هذا السطر ضروري جداً

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';


export function NextAuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
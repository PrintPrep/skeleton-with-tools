

// app/layout.tsx
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { UserSyncProvider } from '@/components/providers/UserSyncProvider';

export const metadata = {
    title: "PrintPrev",
    description: "All-in-one PDF print preparation toolkit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <UserSyncProvider>
            {children}
          </UserSyncProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
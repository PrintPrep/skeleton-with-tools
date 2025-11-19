

// app/layout.tsx
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';


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
        <html lang="en">
        {/* Add margin/padding reset to body */}
        <body className="antialiased bg-white text-gray-900 m-0 p-0">
            <ClerkProvider>
                {children}
            </ClerkProvider>
        </body>
        </html>
    );
}
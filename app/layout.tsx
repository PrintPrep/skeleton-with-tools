// app/layout.tsx
import "./globals.css";

export const metadata = {
    title: "PrintPrep",
    description: "All-in-one PDF print preparation toolkit",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="antialiased bg-white text-gray-900">
        {children}
        </body>
        </html>
    );
}

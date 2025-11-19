import { DashboardNav } from "@/components/dashboard/DashboardNav";

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
        <div className="bg-gray-50 text-gray-900 min-h-screen">

            {/* Fixed / Sticky Dashboard Navigation */}
            <DashboardNav />

            {/* Page Content Wrapper */}
            <main className="pt-20 px-4 md:px-8">
                {children}
            </main>

        </div>
    );
}

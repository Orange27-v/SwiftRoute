import { Navbar } from "@/components/shared/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 p-4">
        {children}
      </main>
    </div>
  );
}

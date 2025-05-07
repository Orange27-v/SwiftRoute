
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar is now part of individual login/register pages to avoid redundancy */}
      <main className="flex flex-1 flex-col"> {/* Removed items-center and justify-center to allow pages to control their layout */}
        {children}
      </main>
    </div>
  );
}

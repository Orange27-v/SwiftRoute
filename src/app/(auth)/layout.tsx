
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 p-4">
      {children}
    </div>
  );
}

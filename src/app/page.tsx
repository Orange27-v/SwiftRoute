import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Truck, Users } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    SwiftRoute: Secure Logistics, Simplified.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect with verified logistics partners and manage your deliveries with confidence. Our escrow payment system ensures peace of mind for every transaction.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register?type=business">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      Ship as a Business
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/register?type=logistics">
                    <Button size="lg" variant="outline">
                      Offer Delivery Services
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/logistics-hero/600/400"
                width={600}
                height={400}
                alt="Logistics network illustration"
                data-ai-hint="logistics network"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need for seamless logistics</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From order creation to secure payments, SwiftRoute offers a comprehensive suite of tools for businesses and logistics providers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Truck className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Effortless Order Creation</CardTitle>
                  <CardDescription>Businesses can easily create delivery orders with detailed pickup/dropoff info and pricing.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Verified Logistics Network</CardTitle>
                  <CardDescription>Access a curated list of verified and reliable logistics companies for your delivery needs.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Secure Escrow Payments</CardTitle>
                  <CardDescription>Payments are held securely in escrow and released only upon successful delivery confirmation.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
         <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to streamline your logistics?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join SwiftRoute today and experience a new era of efficiency and trust in delivery management.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex gap-2 justify-center">
                 <Link href="/register">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Get Started Now</Button>
                  </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} SwiftRoute. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4 text-muted-foreground">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4 text-muted-foreground">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </>
  );
}

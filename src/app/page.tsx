import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Users, CheckCircle } from 'lucide-react';
import Logo from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-foreground">
              Simple, Secure Lending.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Lenda helps you manage loans for individuals and groups with ease and trust. Built for communities, stokvels, and personal lending.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center font-headline text-foreground">Why Lenda?</h2>
            <p className="text-muted-foreground text-center mt-2 mb-12 max-w-xl mx-auto">
              A platform built on trust, security, and community principles.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Landmark className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Context-Aware Roles</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Manage permissions seamlessly whether you're a solo lender or part of a group.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Group Lending</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Perfect for stokvels and community finance groups, with transparent tracking.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Append-Only Ledger</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Your financial records are immutable, ensuring integrity and auditability.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lenda. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

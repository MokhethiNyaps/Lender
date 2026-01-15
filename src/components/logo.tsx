import Link from 'next/link';
import { DollarSign } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Lenda Home">
        <div className="p-2 bg-primary rounded-lg">
            <DollarSign className="h-6 w-6 text-primary-foreground" />
        </div>
      <span className="text-2xl font-bold font-headline text-foreground">Lenda</span>
    </Link>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BookingSuccess() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-green-100 p-4 rounded-full mb-4">
        <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
      <p className="mb-6 text-muted-foreground max-w-md">
        Your booking has been confirmed. A confirmation email has been sent to you.
      </p>
      <Link href="/properties">
        <Button>Browse More Properties</Button>
      </Link>
    </div>
  );
}


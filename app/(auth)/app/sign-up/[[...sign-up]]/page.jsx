import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="w-full min-h-[calc(100vh-73px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground">Join RealEstate Listing Viewer to find your perfect property</p>
        </div>
        
        <div className="bg-background shadow-sm p-6 sm:p-8">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                footerActionLink: 'text-primary hover:text-primary/90',
                card: 'shadow-none',
                headerSubtitle: 'hidden'
              }
            }}
            signInUrl="/app/sign-in"
          />
        </div>
        
        <div className="mt-8 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/app/sign-in" className="font-medium text-primary hover:text-primary/90">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
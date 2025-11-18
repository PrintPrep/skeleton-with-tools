// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <SignUp 
        redirectUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none border-0",
            headerTitle: "text-2xl font-bold text-gray-900",
            headerSubtitle: "text-gray-600",
            socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
            formButtonPrimary: "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600",
            footerActionLink: "text-teal-600 hover:text-teal-700"
          }
        }}
      />
    </div>
  );
}
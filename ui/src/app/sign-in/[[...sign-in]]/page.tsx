import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0))]" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back to <span className="text-cyan-400">dash.build</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Sign in to access your dashboards and continue building
          </p>
        </div>
        
        <div className="mt-8 flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl',
                headerTitle: 'text-white',
                headerSubtitle: 'text-gray-300',
                socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
                formFieldInput: 'bg-white/10 border-white/20 text-white placeholder:text-gray-400',
                formButtonPrimary: 'bg-cyan-600 hover:bg-cyan-700',
                footerActionLink: 'text-cyan-400 hover:text-cyan-300',
                identityPreviewText: 'text-white',
                formFieldLabel: 'text-gray-300'
              }
            }}
            afterSignInUrl="/dashboards"
            signUpUrl="/sign-up"
          />
        </div>
        
        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <a href="/sign-up" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign up for free
            </a>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
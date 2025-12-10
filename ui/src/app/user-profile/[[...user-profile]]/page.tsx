import { UserProfile } from '@clerk/nextjs';

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0))]" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">User Profile</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>
          
          <div className="flex justify-center">
            <UserProfile 
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
                  formFieldLabel: 'text-gray-300',
                  profileSectionPrimaryButton: 'bg-cyan-600 hover:bg-cyan-700',
                  accordionTriggerButton: 'text-white hover:bg-white/10',
                  accordionContent: 'bg-white/5',
                  profilePage: 'bg-transparent',
                  profileSectionContent: 'bg-white/5 border-white/20'
                }
              }}
              routing="path"
              path="/user-profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
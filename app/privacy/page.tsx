import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | FundyLogic',
  description: 'Privacy Policy and Data Handling details for FundyLogic.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last Updated: March 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>When you submit an inquiry through our website, we collect personal information necessary to assess your technical requirements and contact you. This may include your name, email address, phone number, company name, and project specifications.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use the information collected solely to respond to your inquiries, assess project eligibility, formulate technical specifications, and deliver our services. We do not sell, rent, or lease your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Data Transfers</h2>
            <p>FundyLogic utilizes secure third-party infrastructure (such as Google Workspace and Vercel) to process and store communications. Your information may be transferred to and processed on servers located in the United States or other jurisdictions outside of Canada. These third parties conform to strict global security standards to ensure the protection of your personal information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Compliance with Provincial Laws</h2>
            <p>While we primarily operate in New Brunswick, we respect the privacy rights of all Canadian residents, including those in Quebec under Law 25. You have the right to request access to your personal information, request corrections, or request deletion from our systems by contacting us at info@fundylogic.com.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. AI Agent Data Handling</h2>
            <p>Our AI agents process conversations in real-time to provide helpful responses. Conversation data may be used to improve agent performance. We do not store personally identifiable information from chat interactions beyond what is necessary for lead follow-up (name, phone number, email) that you voluntarily provide during conversation.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Cookies and Analytics</h2>
            <p>We use Vercel Analytics to understand how visitors use our site. This collects anonymized usage data. We do not use advertising cookies or third-party tracking scripts.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Data Security</h2>
            <p>We implement industry-standard security measures including HTTPS encryption, secure authentication, and access controls. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Contact</h2>
            <p>For privacy-related inquiries, contact us at:</p>
            <p className="mt-2">FundyLogic Inc.<br />Quispamsis, New Brunswick, Canada<br />info@fundylogic.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}

import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-blue-600 transition-colors font-black text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <h1 className="text-5xl font-black tracking-tight text-neutral-900 dark:text-white uppercase italic">
            Privacy <span className="text-blue-600 underline">Policy</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-bold max-w-2xl text-lg">
            Effective Date: May 3, 2024
          </p>
        </div>

        {/* Main Content */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-[32px] p-8 md:p-12 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-12"
        >
          <div className="space-y-10 text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
            
            <section className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full font-black text-[10px] uppercase tracking-widest">
                <Shield className="w-3 h-3" />
                Data Sovereignty
              </div>
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">1. Local-First Architecture</h2>
              <p>
                DocBit is engineered as a client-side application. This means that all document processing, including PDF manipulation, image conversion, and data restructuring, occurs locally within your web browser sessions. Your files are not uploaded to, processed on, or stored by DocBit servers. While the application interface is loaded from our hosting infrastructure, the logic executes on your hardware.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">2. Information Collection & Use</h2>
              <p>
                <strong>Personal Data:</strong> By design, DocBit does not require or support user authentication. We do not collect names, email addresses, phone numbers, or any personally identifiable information (PII). There is no database of users.
              </p>
              <p>
                <strong>Technical Logs:</strong> Like most web services, our hosting infrastructure may automatically log standard technical data such as IP addresses, browser types, and access times. This data is used solely for security monitoring and infrastructure optimization and is handled according to our hosting provider's data retention policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">3. Analytics & Telemetry</h2>
              <p>
                We may use minimal, privacy-focused analytics tools to monitor overall application performance and tool usage frequency. This data is aggregated and anonymized, contains no personal identifiers, and is used to prioritize feature updates and performance improvements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">4. Third-Party Integration & Cookies</h2>
              <p>
                <strong>Affiliate Participation:</strong> DocBit participates in the Amazon Services LLC Associates Program. When you click on an Amazon affiliate link provided on this platform, Amazon may use cookies to track clicks for the purpose of attributing commissions. These cookies are subject to Amazon's own privacy policies.
              </p>
              <p>
                <strong>Browser Storage:</strong> We may use local storage or session storage to maintain your preferences (such as dark mode settings) and temporary tool state within a single session.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">5. Data Retention</h2>
              <p>
                Because we do not store your files on our servers, there is no "data" to delete regarding your documents. Once you terminate your browser session or refresh the application, any temporary data cached for processing is cleared from your browser's memory.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">6. User Rights</h2>
              <p>
                Since we do not hold identifiable user data, the standard rights of access, carry, or deletion (such as those under GDPR or CCPA) generally do not apply because there is no data to link to you. However, we maintain this architecture specifically to respect and preserve those fundamental privacy rights by default.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">7. Policy Modifications</h2>
              <p>
                We reserve the right to update this Privacy Policy to reflect changes in our tools or legal requirements. Continued use of the application following any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">8. Contact Information</h2>
              <p>
                For inquiries regarding this Privacy Policy or our privacy practices, please contact us at: [Contact Email / Interface Placeholder].
              </p>
            </section>
          </div>
        </motion.section>

        <div className="text-center pb-12">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">&copy; 2024 DocBit PRIVACY MODULE. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

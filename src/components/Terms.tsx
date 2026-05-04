import React from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
          <h1 className="text-5xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
            Terms of <span className="text-blue-600 italic underline">Service</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-bold max-w-2xl text-lg">
            Last Updated: May 3, 2024
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
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white rounded-full font-black text-[10px] uppercase tracking-widest">
                <FileText className="w-3 h-3" />
                Agreement
              </div>
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">1. Description of Service</h2>
              <p>
                DocBit provides browser-based, local-first tools for the manipulation of PDF files and image assets. By accessing or using our application, you signify that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">2. No Warranties; "As-Is" Usage</h2>
              <p>
                DocBit is provided on an "as-is" and "as-available" basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or completeness of the tools. We do not guarantee that the application will be uninterrupted, timely, secure, or error-free.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">3. User Responsibilities & Data Integrity</h2>
              <p>
                As a client-side application, processing performance is entirely dependent on your local system resources and browser capabilities. You are responsible for ensuring that you have backups of any original documents before using our tools.
              </p>
              <p>
                <strong>Risk of Data Loss:</strong> Use of DocBit is at your own risk. We are not responsible for any document corruption, data loss, or system instability that may occur during the local processing of files.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">4. Acceptable Conduct</h2>
              <p>
                You agree not to use DocBit for any unlawful purposes, including the processing of content that violates third-party intellectual property, privacy rights, or public order. Attempting to disrupt the application’s infrastructure or circumvent technical limitations is strictly prohibited.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">5. Affiliate Disclaimer</h2>
              <p>
                DocBit is a participant in the Amazon Services LLC Associates Program. We may include affiliate links to Amazon.com within the application. If you make a purchase through these links, we may receive a commission at no additional cost to you. We are not responsible for product fulfillment, quality, or customer service related to third-party purchases.
              </p>
            </section>

            <section className="space-y-4 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                6. Limitation of Liability
              </h2>
              <p className="text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL DOCBIT OR ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF DATA, FILE CORRUPTION, OR LOSS OF REVENUE) ARISING FROM THE USE OR INABILITY TO USE OUR TOOLS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">7. Service Availability</h2>
              <p>
                We do not guarantee 100% uptime. Access to the tool may be suspended temporarily and without notice in the case of system failure, maintenance, or reasons beyond our control.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">8. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of **India**, without regard to its conflict of law provisions. Any legal action or proceeding related to DocBit shall be brought exclusively in the courts of [Your City/State, India].
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">9. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at: [Contact Email Placeholder].
              </p>
            </section>
          </div>
        </motion.section>

        <div className="text-center pb-12">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">&copy; 2024 DocBit TERMS MODULE. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

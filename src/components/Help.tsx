import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ShieldCheck, Zap, Globe, FileQuestion, BookOpen, Layers } from 'lucide-react';
import { SEO } from './SEO';
import { SEO_CONFIG, APP_DOMAIN } from '../seo/seoConfig';
import { getBreadcrumbSchema, getFAQSchema } from '../seo/structuredData';

export default function Help() {
  const categories = [
    {
      title: "Privacy & Security",
      icon: <ShieldCheck className="w-5 h-5" />,
      faqs: [
        { q: "Is my data safe?", a: "Yes, 100%. DocBit uses client-side WebAssembly technology. Your files are processed entirely within your browser's memory. They are never uploaded to any server, making data breaches impossible on our end." },
        { q: "Do you keep logs of my files?", a: "No. Since the processing happens on your device, we have no access to the content of your files, their names, or any metadata." },
        { q: "Is DocBit open source?", a: "We are currently moving towards a semi-open source model where our core processing logic (WASM modules) will be available for audit." }
      ]
    },
    {
      title: "Usage & Limits",
      icon: <Layers className="w-5 h-5" />,
      faqs: [
        { q: "What is the maximum file size?", a: "The limit is generally determined by your device's RAM. Most modern browsers can handle up to 300MB-500MB PDFs without issues." },
        { q: "Is there a daily limit?", a: "No. Since you are using your own computer's power to process the files, we don't need to limit your usage to save server costs." },
        { q: "Why is it free?", a: "DocBit costs very little to run because we don't pay for massive processing servers. This allows us to keep the basic tools free for everyone." }
      ]
    },
    {
      title: "Supported Formats",
      icon: <BookOpen className="w-5 h-5" />,
      faqs: [
        { q: "Which image formats work with 'Img to PDF'?", a: "We support high-quality JPG, JPEG, PNG, and modern WebP formats." },
        { q: "Can I convert scanned PDFs?", a: "Yes. Our engines can manipulate scanned documents just as easily as digital ones, although we don't currently support OCR (text recognition)." },
        { q: "Do you support Password Protected PDFs?", a: "Currently, you must unlock your PDF before using our tools. We do not bypass owner passwords for security reasons." }
      ]
    }
  ];

  const allFaqs = categories.flatMap(cat => cat.faqs);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black py-20 px-4">
      <SEO 
        {...SEO_CONFIG.help} 
        schema={[
          getBreadcrumbSchema([
            { name: 'Home', item: APP_DOMAIN },
            { name: 'Help', item: SEO_CONFIG.help.canonical }
          ]),
          getFAQSchema(allFaqs)
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-20">
        <header className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HelpCircle className="w-12 h-12 text-blue-600 mx-auto" />
          </motion.div>
          <h1 className="text-4xl font-black dark:text-white uppercase italic tracking-tight">Help Center</h1>
          <p className="text-neutral-500 font-medium">Quick answers and detailed explanations for your DocBit experience.</p>
        </header>

        <div className="space-y-16">
          {categories.map((category, idx) => (
            <section key={idx} className="space-y-8">
              <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl w-fit shadow-sm">
                <div className="text-blue-600">{category.icon}</div>
                <h2 className="text-xs font-black uppercase tracking-widest dark:text-white">{category.title}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {category.faqs.map((faq, fIdx) => (
                  <details 
                    key={fIdx} 
                    className="group bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <summary className="flex items-center justify-between p-7 cursor-pointer list-none font-black text-sm uppercase tracking-tight dark:text-white">
                      {faq.q}
                      <span className="text-blue-600 group-open:rotate-180 transition-transform bg-blue-50 dark:bg-blue-900/20 w-8 h-8 rounded-full flex items-center justify-center">
                        <FileQuestion className="w-4 h-4" />
                      </span>
                    </summary>
                    <div className="px-7 pb-7 text-neutral-500 text-sm font-medium leading-relaxed max-w-3xl">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still Need Help? */}
        <section className="bg-blue-600 rounded-[48px] p-12 text-center space-y-6 text-white shadow-2xl shadow-blue-500/30">
          <h2 className="text-3xl font-black italic uppercase tracking-tight">Still have questions?</h2>
          <p className="text-blue-100 font-medium max-w-md mx-auto opacity-80 uppercase text-[10px] tracking-widest leading-loose">
            Can't find the answer you're looking for? Please chat with our friendly team.
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="/contact" 
              className="inline-block px-10 py-5 bg-white text-blue-600 font-black rounded-2xl shadow-xl shadow-black/10 text-xs tracking-widest"
            >
              CONTACT SUPPORT
            </a>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

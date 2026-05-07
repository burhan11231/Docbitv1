import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Settings2, 
  Zap, 
  ShieldCheck, 
  Globe,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFTool } from '../constants/tools';

interface ToolInfoProps {
  title: string;
  steps: { title: string; desc: string }[];
  benefits: { title: string; desc: string; icon: React.ReactNode }[];
  faqs: { q: string; a: string }[];
  relatedTools?: PDFTool[];
  seoContent?: {
    title: string;
    content: string;
  };
}

export const ToolInfo: React.FC<ToolInfoProps> = ({ 
  title, 
  steps, 
  benefits, 
  faqs,
  relatedTools,
  seoContent
}) => {
  return (
    <div className="mt-24 space-y-32">
      {/* SEO Content Section */}
      {seoContent && (
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="p-8 rounded-[32px] bg-blue-50/50 dark:bg-blue-900/5 border border-blue-100 dark:border-blue-900/20">
            <h2 className="text-2xl font-black tracking-tight dark:text-white mb-4">{seoContent.title}</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-500 font-medium leading-relaxed">
              {seoContent.content}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black tracking-tight dark:text-white">How it works</h2>
          <p className="text-neutral-500 font-medium">Simple 3-step process to get your {title} ready.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
                {idx + 1}
              </div>
              <h3 className="text-lg font-black dark:text-white mb-2 mt-2">{step.title}</h3>
              <p className="text-neutral-500 text-sm font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black tracking-tight dark:text-white">Why use DocBit?</h2>
          <p className="text-neutral-500 font-medium">Experience the next generation of PDF management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-black dark:text-white">{benefit.title}</h3>
              <p className="text-neutral-500 text-sm font-medium leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto space-y-12 pb-20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black tracking-tight dark:text-white flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details 
              key={idx} 
              className="group bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-black text-sm uppercase tracking-tight dark:text-white">
                {faq.q}
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  <Settings2 className="w-4 h-4" />
                </span>
              </summary>
              <div className="px-6 pb-6 text-neutral-500 text-sm font-medium leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      {relatedTools && relatedTools.length > 0 && (
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Explore more tools</h2>
            <p className="text-neutral-500 font-medium">Continue your PDF workflow with our other free utilities.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTools.map((tool) => (
              <Link 
                key={tool.id}
                to={tool.href}
                className="group p-6 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:border-blue-500 transition-all text-left space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-800 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                  {tool.icon}
                </div>
                <div>
                  <h3 className="font-black dark:text-white flex items-center gap-2">
                    {tool.name}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-sm text-neutral-500 font-medium line-clamp-1">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

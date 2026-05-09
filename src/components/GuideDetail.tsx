
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Clock, Calendar } from 'lucide-react';
import { SEO } from './SEO';
import { GUIDES } from '../constants/guides';
import { APP_DOMAIN } from '../seo/seoConfig';
import { getBreadcrumbSchema } from '../seo/structuredData';
import { getFAQSchema } from '../utils/schema/faqSchema';

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const guide = GUIDES.find(g => g.slug === `/guides/${slug}`);

  if (!guide) {
    return <Navigate to="/help" replace />;
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: APP_DOMAIN },
    { name: 'Help & Guides', item: `${APP_DOMAIN}/help` },
    { name: guide.title, item: `${APP_DOMAIN}${guide.slug}` }
  ]);

  const faqSchema = guide.faqs ? getFAQSchema(guide.faqs) : null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <SEO 
        title={guide.title}
        description={guide.description}
        canonical={`${APP_DOMAIN}${guide.slug}`}
        schema={[breadcrumbs, faqSchema].filter(Boolean)}
      />

      <Link 
        to="/help" 
        className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-blue-600 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Help & Guides
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
              {guide.category}
            </span>
            <div className="flex items-center text-neutral-400 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>5 min read</span>
            </div>
            <div className="flex items-center text-neutral-400 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Oct 2026</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-6 leading-tight">
            {guide.title}
          </h1>
          
          <p className="text-xl text-neutral-500 leading-relaxed max-w-3xl">
            {guide.description}
          </p>
        </header>

        <div className="aspect-video w-full bg-neutral-100 rounded-3xl mb-12 flex items-center justify-center overflow-hidden border border-neutral-200">
          <div className="p-8 bg-white rounded-2xl shadow-xl border border-neutral-100">
            {guide.icon}
          </div>
        </div>

        <div className="prose prose-neutral prose-lg max-w-none mb-16 dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: guide.content }} />
        </div>

        {guide.steps && (
          <div className="bg-neutral-50 rounded-3xl p-8 mb-16 border border-neutral-200">
            <h2 className="text-2xl font-black text-neutral-900 mb-8">How to do it</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {guide.steps.map((step, idx) => (
                <div key={idx} className="relative pl-12">
                  <span className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </span>
                  <h3 className="font-black text-neutral-900 mb-2">{step.name}</h3>
                  <p className="text-neutral-500 text-sm">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {guide.faqs && (
          <section className="mb-16">
            <h2 className="text-2xl font-black text-neutral-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {guide.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                  <h3 className="font-bold text-neutral-900 mb-2">{faq.q}</h3>
                  <p className="text-neutral-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="pt-12 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              DB
            </div>
            <div>
              <p className="font-bold text-neutral-900">DocBit Editorial Team</p>
              <p className="text-sm text-neutral-500">Expertise in PDF workflow automation.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-colors">
            <Share2 className="w-4 h-4" />
            Share this Guide
          </button>
        </footer>
      </motion.article>

      <section className="mt-24 pt-24 border-t border-neutral-100">
        <h2 className="text-3xl font-black text-neutral-900 mb-12 text-center">Ready to try it?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link 
            to="/tools/merge-pdf"
            className="p-6 rounded-3xl bg-blue-600 text-white hover:bg-blue-700 transition-all group"
          >
            <h3 className="font-black text-xl mb-2">Merge PDF</h3>
            <p className="text-blue-100 text-sm">Combine documents now safely on your device.</p>
          </Link>
          <Link 
            to="/tools/image-to-pdf"
            className="p-6 rounded-3xl bg-neutral-900 text-white hover:bg-neutral-800 transition-all"
          >
            <h3 className="font-black text-xl mb-2">Image to PDF</h3>
            <p className="text-neutral-400 text-sm">Convert photos to PDF locally instantly.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Globe, Heart, Files, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from './SEO';
import { SEO_CONFIG, APP_DOMAIN } from '../seo/seoConfig';
import { getBreadcrumbSchema } from '../seo/structuredData';

export default function About() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black py-20 px-4">
      <SEO 
        {...SEO_CONFIG.about} 
        schema={getBreadcrumbSchema([
          { name: 'Home', item: APP_DOMAIN },
          { name: 'About', item: SEO_CONFIG.about.canonical }
        ])}
      />
      
      <div className="max-w-4xl mx-auto space-y-24">
        {/* Hero Section */}
        <header className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Local Processing First</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black tracking-tight dark:text-white uppercase italic"
          >
            We're Fixing <span className="text-blue-600 underline">PDF Tools</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-neutral-500 font-bold max-w-2xl mx-auto leading-relaxed italic"
          >
            DocBit was started because we believe you shouldn't have to sacrifice your privacy for a simple document task.
          </motion.p>
        </header>

        {/* The Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-black dark:text-white flex items-center gap-3 uppercase italic tracking-tighter">
              <EyeOff className="w-6 h-6 text-red-500" />
              The Standard Way
            </h2>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-8 rounded-[32px] space-y-4 shadow-sm">
              <p className="text-neutral-500 font-medium leading-relaxed">
                Most online PDF editors work by sending your files to their servers. Even if they tell you they delete them, your data still travels across the internet and sits on a computer you don't control.
              </p>
              <ul className="space-y-3">
                {['Files Uploaded to Servers', 'Privacy Risks', 'Slow Upload Speeds', 'Subscription Required'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-black uppercase text-neutral-400 italic">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black dark:text-white flex items-center gap-3 uppercase italic tracking-tighter">
              <Zap className="w-6 h-6 text-blue-600" />
              The DocBit Way
            </h2>
            <div className="bg-blue-600 border border-blue-500 p-8 rounded-[32px] space-y-4 text-white shadow-xl shadow-blue-500/10">
              <p className="text-blue-50 font-medium leading-relaxed">
                We do things differently. DocBit uses your browser to process your documents locally. This means your files never leave your device, and the processing is nearly instant.
              </p>
              <ul className="space-y-3">
                {['100% Private & Local', 'No File Uploads', 'Faster Processing', 'Free & Unrestricted'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-black uppercase text-white italic">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Our Approach */}
        <section className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[48px] p-12 space-y-12 shadow-sm">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black dark:text-white italic uppercase italic tracking-tighter underline">How It Works</h2>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Simple tools, modern technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "On-Device Processing", desc: "Your computer's processor does the work, so you don't have to wait for uploads or downloads.", icon: <Zap className="w-6 h-6" /> },
              { title: "Absolute Privacy", desc: "Since everything happens in your browser's memory, we never see your documents. Period.", icon: <ShieldCheck className="w-6 h-6" /> },
              { title: "Zero Barriers", desc: "No sign-ups, no limits, and no constant prompts to upgrade to a premium plan.", icon: <Globe className="w-6 h-6" /> }
            ].map((tech, i) => (
              <div key={i} className="space-y-4 p-8 rounded-[40px] bg-neutral-50 dark:bg-neutral-800 transition-all hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black flex items-center justify-center text-blue-600 shadow-sm border border-neutral-100 dark:border-neutral-700">
                  {tech.icon}
                </div>
                <h3 className="font-black dark:text-white uppercase tracking-tight text-sm">{tech.title}</h3>
                <p className="text-neutral-500 text-[12px] leading-relaxed font-bold">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Capabilities */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black dark:text-white uppercase italic tracking-tighter italic">Our Toolkit</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Merge PDF', path: '/tools/merge-pdf' },
              { name: 'Split PDF', path: '/tools/split-pdf' },
              { name: 'Image to PDF', path: '/tools/image-to-pdf' },
              { name: 'PDF to Image', path: '/tools/pdf-to-images' },
            ].map((tool) => (
              <Link 
                key={tool.name}
                to={tool.path}
                className="p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center font-black uppercase text-xs tracking-widest hover:border-blue-500 transition-colors"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="text-center space-y-12 pb-20">
          <div className="space-y-4">
            <Heart className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-4xl font-black dark:text-white uppercase italic tracking-tight">Trust is earned.</h2>
            <p className="text-neutral-500 font-bold max-w-xl mx-auto text-lg italic">
              DocBit is a project born out of necessity. We believe high-quality tools should exist without compromising a user's fundamental right to digital privacy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Globe, Heart, Files, EyeOff } from 'lucide-react';
import { SEO } from './SEO';

export default function About() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black py-20 px-4">
      <SEO 
        title="Our Mission - The Privacy-First PDF Suite" 
        description="Learn why DocBit was built: to provide high-performance PDF tools that respect your privacy by processing everything locally."
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
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Our Mission</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight dark:text-white"
          >
            Your Documents are <span className="text-blue-600">Private property</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            We built DocBit to challenge the industry standard of uploading personal documents to remote servers for simple processing tasks.
          </motion.p>
        </header>

        {/* The Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-black dark:text-white flex items-center gap-3 italic">
              <EyeOff className="w-6 h-6 text-red-500" />
              The Status Quo
            </h2>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-8 rounded-[32px] space-y-4">
              <p className="text-neutral-500 font-medium leading-relaxed">
                Most online PDF tools require you to upload your files to their servers. This creates logs, exposes your data to potential breaches, and wastes bandwidth. 
              </p>
              <ul className="space-y-3">
                {['Remote Log Generation', 'Privacy Vulnerabilities', 'Upload/Download Delays', 'Subscription Paywalls'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-black uppercase text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black dark:text-white flex items-center gap-3 italic">
              <Zap className="w-6 h-6 text-blue-600" />
              The DocBit Way
            </h2>
            <div className="bg-blue-600 border border-blue-500 p-8 rounded-[32px] space-y-4 text-white">
              <p className="text-blue-50 font-medium leading-relaxed">
                We use WebAssembly (WASM) to run heavy-duty PDF processing directly inside your browser. Your CPU does the work, not our server.
              </p>
              <ul className="space-y-3">
                {['Zero Server Uploads', 'Instant Local Processing', 'Industry-Grade Security', 'Forever Free for Basic Use'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-black uppercase text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Our Approach */}
        <section className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[48px] p-12 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black dark:text-white italic uppercase italic tracking-tighter">Technology Stack</h2>
            <p className="text-neutral-500 font-medium">Built with the fastest and most secure web technologies available.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Rust & WASM", desc: "Low-level performance for high-speed PDF manipulation.", icon: <Zap className="w-6 h-6" /> },
              { title: "Local Logic", desc: "Your data stays in your browser's memory, nowhere else.", icon: <ShieldCheck className="w-6 h-6" /> },
              { title: "Transparency", desc: "Open about our processing methods and privacy standards.", icon: <Globe className="w-6 h-6" /> }
            ].map((tech, i) => (
              <div key={i} className="space-y-4 p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-800">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black flex items-center justify-center text-blue-600 shadow-sm">
                  {tech.icon}
                </div>
                <h3 className="font-black dark:text-white uppercase tracking-tight text-sm">{tech.title}</h3>
                <p className="text-neutral-500 text-[11px] leading-relaxed font-bold">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="text-center space-y-12 pb-20">
          <div className="space-y-4">
            <Heart className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-3xl font-black dark:text-white">People over Profits</h2>
            <p className="text-neutral-500 font-medium max-w-xl mx-auto">
              DocBit is a labor of love. We believe everyone deserves high-quality digital tools that don't compromise their human right to privacy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

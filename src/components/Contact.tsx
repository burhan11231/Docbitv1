import React from 'react';
import { motion } from 'motion/react';
import { Mail, Instagram, MessageSquare } from 'lucide-react';
import { SEO } from './SEO';

export default function Contact() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black py-20 px-4">
      <SEO 
        title="Contact Us - Let's Talk Docs" 
        description="Have questions or feedback? Reach out to the DocBit team at docbit.app@gmail.com or find us on Instagram."
      />
      
      <div className="max-w-4xl mx-auto space-y-20">
        <header className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/20"
          >
            <MessageSquare className="w-8 h-8" />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight dark:text-white uppercase italic">Get in Touch</h1>
            <p className="text-neutral-500 font-medium max-w-lg mx-auto leading-relaxed text-sm">
              Whether you encountered a bug, have a feature request, or just want to say hi, our inbox is always open.
            </p>
          </div>
        </header>

        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[32px] p-8 space-y-6 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Direct Connect</h4>
              <div className="space-y-4">
                 <a href="mailto:docbit.app@gmail.com" className="flex items-center gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50">
                    <Mail className="w-6 h-6 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Email Us</span>
                       <span className="text-xs font-black dark:text-neutral-300">docbit.app@gmail.com</span>
                    </div>
                 </a>
                 <a href="https://www.instagram.com/docbit.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50">
                    <Instagram className="w-6 h-6 text-neutral-400 group-hover:text-pink-500 transition-colors" />
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Follow Us</span>
                       <span className="text-xs font-black dark:text-neutral-300">@docbit.app</span>
                    </div>
                 </a>
              </div>
           </div>

           <div className="bg-blue-600 rounded-[32px] p-8 text-white space-y-6 shadow-xl shadow-blue-500/20 flex flex-col justify-center">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-100 opacity-60">Avg Response Time</h4>
                <p className="text-3xl font-black italic tracking-tighter">Under 24 Hours</p>
              </div>
              <p className="text-[11px] font-bold text-blue-50 leading-relaxed uppercase tracking-tight">
                We value your input and try to read every single message. Your feedback directly shapes the future of DocBit.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest">Support Active</span>
              </div>
           </div>
        </div>

        <div className="text-center pt-20">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">DocBit HQ • Purely Digital</p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { TOOLS } from '../constants/tools';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Layers, 
  Cpu, 
  Lock,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export function Home() {
  const mainCategories = [
    { 
      id: 'organize', 
      title: 'Structural Control', 
      description: 'The foundation of your document workflow. Precision tools for structural adjustment.',
      items: TOOLS.filter(t => t.category === 'organize' || t.category === 'edit').slice(0, 4)
    },
    { 
      id: 'optimize', 
      title: 'High-Performance Optimization', 
      description: 'Compress, resize, and prepare your files for enterprise-grade distribution.',
      items: TOOLS.filter(t => t.category === 'optimize' || t.category === 'convert').slice(0, 4)
    },
  ];

  const features = [
    { icon: <ShieldCheck />, title: 'Privacy First', desc: 'No files ever leave your device. All processing is 100% client-side.' },
    { icon: <Zap />, title: 'Instant Speed', desc: 'No server queues. No upload/download wait times. Real-time rendering.' },
    { icon: <Globe />, title: 'Anywhere Access', desc: 'Progressive Web App technology. Works offline once loaded.' },
    { icon: <Cpu />, title: 'Powerful Engine', desc: 'Built on industry-standard PDF.js with hyper-optimized local rendering.' },
  ];

  const steps = [
    { number: '01', title: 'Upload', desc: 'Drag and drop your PDF files into our secure workbench.' },
    { number: '02', title: 'Edit', desc: 'Instant preview and lossless structural modifications.' },
    { number: '03', title: 'Secure', desc: 'Download your polished document instantly. Privacy guaranteed.' },
  ];

  return (
    <div className="space-y-32 pb-40 px-4 md:px-0">
      {/* Hero Section - The "Slide" Impression */}
      <section className="relative pt-12 overflow-hidden">
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[11px] font-black uppercase tracking-[0.3em] border border-blue-100 dark:border-blue-800 shadow-xl shadow-blue-500/5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Engineering the Future of PDF
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.85] text-neutral-900 dark:text-white"
            >
              DocBit
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              The industry's most advanced <span className="text-neutral-900 dark:text-neutral-100">client-side</span> PDF workbench. 
              Zero uploads. Total security. Instant results.
            </motion.p>
          </div>
        </div>

        {/* Abstract "Slide" Visual */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      </section>

      {/* Visual Component: "Live Engine" Preview */}
      <section className="relative px-4">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto rounded-[40px] border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl p-4 shadow-2xl shadow-black/5"
        >
          <div className="bg-neutral-50 dark:bg-neutral-950 rounded-[32px] overflow-hidden border border-neutral-100 dark:border-neutral-800 h-[300px] md:h-[500px] flex items-center justify-center relative group">
             {/* Mock UI Elements */}
             <div className="absolute inset-0 grid grid-cols-12 gap-4 p-8 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-1000">
               {Array.from({ length: 24 }).map((_, i) => (
                 <div key={i} className="h-32 bg-blue-500/20 rounded-xl" />
               ))}
             </div>
             <div className="relative z-10 text-center space-y-4">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 mx-auto transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <Layers className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">DocBit Engine</h3>
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Secure Document Processing</p>
             </div>
             {/* Decorative tags */}
             <div className="absolute top-6 left-6 p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/20">STATUS: ACTIVE</div>
          </div>
        </motion.div>
      </section>

      {/* Categorized Tools (The Pro Marketplace) */}
      <div className="space-y-32">
        {mainCategories.map((cat, idx) => (
          <section key={cat.id} className="space-y-12">
            <div className={`flex flex-col md:flex-row items-end justify-between gap-6 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="max-w-xl space-y-4">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none">{cat.title}</h2>
                <p className="text-lg text-neutral-500 dark:text-neutral-400 font-medium">{cat.description}</p>
              </div>
              <div className="flex items-center gap-2 pb-2">
                <div className="w-12 h-1 bg-blue-600 rounded-full" />
                <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Section 0{idx + 1}</span>
              </div>
            </div>

            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {cat.items.map((tool) => (
                <motion.div key={tool.id} variants={item}>
                  <Link 
                    to={tool.href}
                    className="group block p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-300 h-full relative"
                  >
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 mb-6">
                      {React.cloneElement(tool.icon as React.ReactElement, { className: "w-6 h-6" })}
                    </div>
                    <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">{tool.description}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        ))}
      </div>

      {/* Platform Features Grid */}
      <section className="bg-neutral-900 dark:bg-blue-600 py-24 rounded-[60px] text-white overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
           <Cpu className="absolute top-0 right-0 w-[400px] h-[400px] translate-x-1/2 -translate-y-1/2 rotate-45" />
           <Lock className="absolute bottom-0 left-0 w-[300px] h-[300px] -translate-x-1/4 translate-y-1/4 -rotate-12" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 space-y-20 relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">The Modern Standard</h2>
            <p className="text-blue-100 dark:text-white/80 max-w-2xl mx-auto font-medium">Why thousands of professionals trust DocBit for their daily workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((f, i) => (
              <div key={i} className="space-y-4 group">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-neutral-900 transition-all duration-300">
                  {React.cloneElement(f.icon as React.ReactElement, { className: "w-7 h-7" })}
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Vertical Timeline */}
      <section className="max-w-4xl mx-auto space-y-20">
        <div className="text-center space-y-4">
           <h2 className="text-4xl md:text-5xl font-black tracking-tight">Workflow Logic</h2>
           <p className="text-neutral-500 font-medium uppercase tracking-[0.2em] text-xs">Simplicity by design</p>
        </div>

        <div className="space-y-2 px-6">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 font-black tracking-tighter shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {s.number}
                </div>
                {i !== steps.length - 1 && <div className="w-0.5 h-24 bg-neutral-200 dark:bg-neutral-800 mt-2" />}
              </div>
              <div className="pt-2 space-y-2">
                <h3 className="text-2xl font-black tracking-tight">{s.title}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 font-medium max-w-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Testimonials (Visual Proof) */}
      <section className="text-center space-y-16">
        <div className="space-y-4">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Enterprise Verified</p>
           <h2 className="text-4xl font-black tracking-tight">Powered by Modern Web Engines</h2>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           {['PDF.js', 'WebAssembly', 'Engine Standard', 'Secure Workflows'].map(engine => (
             <span key={engine} className="text-2xl font-black tracking-tighter italic select-none">{engine}</span>
           ))}
        </div>
      </section>

      {/* Privacy Section (Revised Trust Footer) */}
      <section className="bg-blue-600 rounded-[60px] p-8 md:p-20 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">Privacy by Architecture</h2>
            <p className="text-blue-50 text-lg md:text-xl font-medium opacity-90 leading-relaxed">
              Unlike other online PDF tools, DocBit processes everything locally in your browser. 
              Your documents never touch our servers. Privacy isn't a promise—it's how the engine works.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <div className="px-4 py-2 bg-white/10 rounded-full flex items-center gap-2 border border-white/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">TLS 1.3 Local</span>
               </div>
               <div className="px-4 py-2 bg-white/10 rounded-full flex items-center gap-2 border border-white/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">WASM SANDBOX</span>
               </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.4em] opacity-60">Verified Engine</span>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4" />
      </section>

      {/* Bottom CTA Section */}
      <section className="relative group px-2">
         <div className="absolute inset-0 bg-blue-600 rounded-[60px] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
         <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[60px] p-12 md:p-24 text-center space-y-10 overflow-hidden shadow-xl">
            <div className="space-y-4 relative z-10">
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Optimize your <span className="text-blue-600">PDF Workflow.</span></h2>
               <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium max-w-2xl mx-auto">Join thousands of users processing documents monthly, entirely on-device.</p>
            </div>
            
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full" />
         </div>
      </section>
    </div>
  );
}

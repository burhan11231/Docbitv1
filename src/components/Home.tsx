import React from 'react';
import { motion, Variants } from 'motion/react';
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  ArrowRight, 
  ChevronRight,
  Globe,
  UploadCloud,
  FileCheck,
  MousePointer2,
  HardDrive
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants/tools';
import { cn } from '../lib/utils';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "circOut" }
  }
};

export function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-500 overflow-x-hidden">
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] dark:bg-blue-600/5" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] dark:bg-purple-600/5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-18">
        {/* HERO SECTION */}
        <section className="text-center space-y-8 py-12 md:py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest"
          >
            <ShieldCheck className="w-4 h-4" />
            100% Client-Side Engine
          </motion.div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-neutral-900 dark:text-white"
            >
              The Private <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">PDF Engine</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-neutral-500 dark:text-neutral-400 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              Professional PDF tools that run entirely in your browser. <br className="hidden md:block" />
              <span className="text-neutral-900 dark:text-white font-bold">Files never leave your device.</span> Pro-grade privacy is here.
            </motion.p>
          </div>

          
        </section>

        {/* TRUST BAR */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Globe className="w-5 h-5" />, label: "No Server Uploads" },
            { icon: <Lock className="w-5 h-5" />, label: "Private by Design" },
            { icon: <HardDrive className="w-5 h-5" />, label: "Local Processing" },
            { icon: <Zap className="w-5 h-5" />, label: "Zero Account Needed" }
          ].map((trust, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-center gap-3 px-6 py-8 rounded-[32px] bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800/50"
            >
              <div className="text-blue-600 dark:text-blue-400">{trust.icon}</div>
              <span className="text-xs font-black uppercase tracking-tighter text-neutral-900 dark:text-neutral-300">
                {trust.label}
              </span>
            </motion.div>
          ))}
        </section>

        {/* TOOLS BENTO GRID */}
        <section id="tools" className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter text-neutral-900 dark:text-white">Swiss-Army Tools</h2>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium">Focused engines for specific PDF workflows.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
              <div className="w-12 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
              Production Ready
              <div className="w-12 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-6 gap-4"
          >
            {/* Featured Item: Organizer */}
            <motion.div variants={itemVariants} className="md:col-span-4 group h-[400px]">
              <Link 
                to="/tool/organize" 
                className="block h-full relative overflow-hidden rounded-[40px] bg-blue-600 dark:bg-blue-600 p-10 group-hover:scale-[1.01] transition-all duration-500 shadow-2xl shadow-blue-500/20"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative h-full flex flex-col justify-between">
                  <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white">
                    <Zap className="w-8 h-8 fill-white" />
                  </div>
                  
                  <div className="space-y-4 max-w-md">
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-100">Most Powerful</div>
                    <h3 className="text-4xl font-black tracking-tighter text-white">Visual PDF Organizer</h3>
                    <p className="text-blue-100/80 font-medium leading-relaxed">
                      The ultimate page-management tool. Reorder, rotate, and duplicate pages with a high-fidelity live preview.
                    </p>
                    <div className="inline-flex items-center gap-2 text-white font-bold text-sm">
                      Get Started <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Other Tools as Cards */}
            {TOOLS.filter(t => t.id !== 'organize').map((tool, idx) => (
              <motion.div 
                key={tool.id}
                variants={itemVariants}
                className={cn(
                  "md:col-span-2 group",
                  idx === 0 ? "md:col-span-2" : "md:col-span-2"
                )}
              >
                <Link 
                  to={tool.href}
                  className="block h-full p-8 rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 group"
                >
                  <div className="flex flex-col h-full justify-between gap-12">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      {tool.icon}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase italic">{tool.name}</h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black tracking-tighter text-neutral-900 dark:text-white">Three Steps to Done</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Simplifying the complex, without the data risk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[25%] left-0 right-0 h-[2px] bg-neutral-100 dark:bg-neutral-800 -z-10" />
            
            {[
              { icon: <MousePointer2 className="w-8 h-8" />, title: "Choose Tool", desc: "Select from our specialized tools organized by workflow." },
              { icon: <UploadCloud className="w-8 h-8" />, title: "Select Files", desc: "Drag and drop your documents. They stay on your disk." },
              { icon: <FileCheck className="w-8 h-8" />, title: "Export", desc: "Download the processed result instantly. Local and fast." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-[24px] bg-white dark:bg-neutral-950 border-4 border-neutral-100 dark:border-neutral-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xl">
                  {step.icon}
                </div>
                <div className="space-y-2 px-4">
                  <h5 className="font-black tracking-tighter uppercase text-neutral-900 dark:text-white">{step.title}</h5>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECURITY SECTION */}
        <section className="relative p-12 md:p-20 rounded-[48px] bg-neutral-950 overflow-hidden isolate">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent)]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-xs font-black uppercase tracking-widest text-blue-500">Security Architecture</div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
                  Your Data Deserves <br />
                  <span className="text-blue-500">Zero Trust</span>
                </h2>
                <p className="text-neutral-400 font-medium leading-relaxed text-lg max-w-sm">
                  Traditional PDF tools upload your sensitive files to remote servers. We don't.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex-shrink-0 flex items-center justify-center text-blue-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-white">Browser-Bound</div>
                    <p className="text-sm text-neutral-500 font-medium">All PDF manipulation logic runs inside your browser sandbox.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex-shrink-0 flex items-center justify-center text-purple-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-white">Zero Persistence</div>
                    <p className="text-sm text-neutral-500 font-medium">Once you close the tab, all traces of your documents vanish.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <span className="text-xs font-black uppercase tracking-tighter text-white">Privacy Report</span>
                <span className="text-[10px] px-2 py-1 rounded bg-green-500/10 text-green-500 font-bold uppercase tracking-widest">Active</span>
              </div>
              <ul className="space-y-4">
                {[
                  "Server Logs: 0% Captured",
                  "File Transfers: blocked",
                  "Tracking: Disabled",
                  "Auth Requirement: None",
                  "GDPR / CCPA Status: Native Compliance"
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span>{item}</span>
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                  </li>
                ))}
              </ul>
              <div className="pt-4 mt-4 border-t border-neutral-800 text-[10px] text-neutral-600 font-medium leading-relaxed italic">
                Verified: DocBit uses standard browser APIs and WASM for processing. No external dependencies are used for file handling.
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-28 border-t border-neutral-100 dark:border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-8 pb-8">
          <div className="flex items-center gap-2">
             <span className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white">DocBit</span>
             <span className="text-[10px] font-bold text-neutral-400">v0.1.0</span>
          </div>
          
          <div className="flex items-center gap-8">
             <Link to="/" className="text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">Twitter</Link>
             <Link to="/" className="text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">GitHub</Link>
             <Link to="/" className="text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="text-xs text-neutral-400 font-medium">
             © {new Date().getFullYear()} DocBit. Built for the Private Web.
          </div>
        </footer>
      </div>
    </div>
  );
}


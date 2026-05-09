
import React from 'react';
import { Shield, Zap, Globe, Lock, Cpu, Star, CheckCircle2 } from 'lucide-react';

interface ToolContentProps {
  toolName: string;
  toolType: string; // 'Merge', 'Split', etc.
  description: string;
}

export const ToolContent: React.FC<ToolContentProps> = ({ toolName, toolType, description }) => {
  return (
    <div className="mt-24 max-w-5xl mx-auto space-y-24 pb-24 px-4 overflow-hidden">
      {/* 1. Benefits Grid */}
      <section>
        <h2 className="text-3xl font-black text-neutral-900 mb-12 text-center">Why use DocBit for {toolName}?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Privacy by Design",
              desc: "Unlike other tools, your files are never uploaded to a server. Everything happens on your device.",
              icon: <Shield className="w-10 h-10 text-blue-600" />
            },
            {
              title: "Blazing Fast",
              desc: "Bypass slow upload/download speeds. Process documents instantly using your hardware power.",
              icon: <Zap className="w-10 h-10 text-amber-500" />
            },
            {
              title: "Privacy First",
              desc: "Files are processed directly in your browser tab. We never see your data, and nothing is uploaded.",
              icon: <Lock className="w-10 h-10 text-emerald-500" />
            }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:shadow-xl transition-shadow group">
              <div className="mb-6 transform group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-xl font-black text-neutral-900 mb-4">{item.title}</h3>
              <p className="text-neutral-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Feature Highlights (Bento style) */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 p-12 rounded-[2.5rem] bg-neutral-900 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-4xl font-black mb-6">Advanced {toolType} Technology</h3>
              <p className="text-neutral-400 text-lg leading-relaxed max-w-xl">
                DocBit utilizes modern browser APIs and WebAssembly (WASM) to provide desktop-class PDF manipulation features directly on your device. Our engine handles complex document structures without compromising quality or metadata integrity.
              </p>
            </div>
            <Cpu className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5 group-hover:text-blue-500/10 transition-colors" />
          </div>
          <div className="md:col-span-4 p-12 rounded-[2.5rem] bg-blue-600 text-white flex flex-col justify-between">
            <Star className="w-12 h-12 mb-8 fill-white/20" />
            <div>
              <h3 className="text-2xl font-black mb-4">Unlimited Usage</h3>
              <p className="text-blue-100 italic">"No paywalls, no limits, no server uploads. Just free, high-performance tools for everyone."</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Use Cases */}
      <section className="prose prose-neutral prose-lg max-w-none dark:prose-invert">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 leading-tight">Professional Use Cases for {toolType}</h2>
            <p className="text-neutral-500 mt-6">
              Modern workplaces demand efficiency and security. Whether you are a legal professional handling sensitive contracts or a student organizing research papers, our {toolName} tool provides the perfect balance of ease and data privacy.
            </p>
            <ul className="mt-8 space-y-4 list-none p-0">
              {[
                "Organizing bank statements and financial reports.",
                "Merging design portfolios for client presentations.",
                "Splitting large government forms for easy sharing.",
                "Creating multi-page PDFs from smartphone camera scans."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <span className="text-neutral-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-neutral-100 rounded-[2.5rem] p-4 flex items-center justify-center border border-neutral-200">
             <div className="p-8 bg-white rounded-3xl shadow-lg w-full">
                <Lock className="w-12 h-12 text-blue-600 mb-6" />
                <h4 className="text-xl font-bold text-neutral-900 mb-2">Zero-Trust Processing</h4>
                <p className="text-neutral-500 text-sm">
                  We believe your documents should remain yours. By eliminating the 'upload' step entirely, we remove the primary security risk associated with online PDF tools. DocBit represents a zero-trust model for browser-based document management.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Technical Comparison */}
      <section className="bg-neutral-900 rounded-[2.5rem] p-12 text-white">
        <h2 className="text-3xl font-black mb-12 text-center text-white">DocBit vs. Traditional Online Tools</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 uppercase text-[10px] tracking-widest text-neutral-500 font-black">
                <th className="pb-6">Feature</th>
                <th className="pb-6">Traditional Tools</th>
                <th className="pb-6 text-blue-400">DocBit (Browser-Local)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { f: "Data Security", t: "Server Storage (Risk)", b: "On-Device (Absolute)" },
                { f: "Processing Speed", t: "Limited by Upload/Download", b: "Limited by RAM/CPU (Fast)" },
                { f: "Data Privacy", t: "Logs and Tracking", b: "Zero Server Uploads" },
                { f: "Privacy", t: "Cookies and Analytics", b: "Privacy-First Design" },
                { f: "Cost", t: "Pro/Premium Tiers", b: "100% Free Forever" },
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-white/5 transition-colors">
                  <td className="py-6 font-bold">{row.f}</td>
                  <td className="py-6 text-neutral-500 italic">{row.t}</td>
                  <td className="py-6 font-black text-blue-400">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Long-form FAQ Content */}
      <section>
        <h2 className="text-3xl font-black text-neutral-900 mb-12">Learn more about {toolType}</h2>
        <div className="space-y-8">
           <div className="max-w-3xl">
             <h3 className="text-xl font-bold text-neutral-900 mb-4">Is {toolType} better on desktop or mobile?</h3>
             <p className="text-neutral-500">
                While our {toolName} works excellently on both, desktop users often benefit from larger screens for manual file sorting. However, our mobile interface is specifically designed for touch control, making it incredibly intuitive for quick document management on the go.
             </p>
           </div>
           <div className="max-w-3xl">
             <h3 className="text-xl font-bold text-neutral-900 mb-4">How does browser-based processing work?</h3>
             <p className="text-neutral-500">
                DocBit uses the latest WebAssembly and JavaScript engines to run complex algorithms directly in your browser tab. This is similar to how modern games run in browsers. It allocates a small amount of your device's memory to perform the {toolType.toLowerCase()} operation, and then clears it immediately upon completion.
             </p>
           </div>
        </div>
      </section>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  RotateCcw, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Eye, 
  EyeOff, 
  Download, 
  ChevronRight, 
  ExternalLink, 
  Layout, 
  Type, 
  Palette, 
  Check, 
  Loader2, 
  Menu,
  X,
  PlusCircle,
  MoreVertical,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type IndustryType = 'Business' | 'Portfolio' | 'Ecommerce' | 'Blog';

interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
  light: string;
}

interface Section {
  id: string;
  type: 'hero' | 'about' | 'services' | 'testimonials' | 'gallery' | 'pricing' | 'contact';
  content: any;
  layoutVariant: number;
}

interface Page {
  sections: Section[];
}

interface SiteData {
  meta: {
    businessName: string;
    industry: IndustryType;
    colors: ColorTheme;
    fontStyle: 'modern' | 'classic' | 'playful' | 'tech';
  };
  pages: {
    home: Page;
    about: Page;
    services: Page;
    contact: Page;
  };
}

interface AppInput {
  businessName: string;
  industry: IndustryType;
  description: string;
}

// --- Generator Logic ---

const REGEN_CONTENT = {
  hero: [
    { title: "Transform Your Business with {{businessName}}", subtitle: "We provide industry-leading solutions tailored to your specific needs." },
    { title: "The Future of {{industry}} is Here", subtitle: "Experience the next generation of professional services with our expert team." },
    { title: "Elevate Your Brand Today", subtitle: "Strategic thinking meets creative execution for the modern enterprise." }
  ],
  about: [
    { title: "About Us", text: "Founded with a vision to redefine excellence in {{industry}}, {{businessName}} has grown into a trusted leader." },
    { title: "Our Story", text: "We started with a simple idea: to make professional {{industry}} services accessible and impactful for everyone." }
  ],
  services: [
    { 
      title: "Our Services", 
      items: [
        { name: "Strategic Planning", desc: "Long-term growth strategies." },
        { name: "Digital Solution", desc: "Modern tech for modern problems." },
        { name: "Consulting", desc: "Expert advice when you need it most." }
      ] 
    }
  ],
  contact: [
    { title: "Get In Touch", email: "hello@{{businessName}}.com", phone: "+1 (555) 000-0000", address: "123 Innovation Drive, Silicon Valley" }
  ]
};

const generateSection = (type: Section['type'], input: AppInput): Section => {
  const id = Math.random().toString(36).substr(2, 9);
  const variant = Math.floor(Math.random() * 2);
  
  let content = {};
  switch (type) {
    case 'hero':
      content = {
        title: `Welcome to ${input.businessName}`,
        subtitle: input.description || `Leading providers of ${input.industry} solutions.`,
        cta: "Get Started"
      };
      break;
    case 'about':
      content = {
        title: "Who We Are",
        text: `At ${input.businessName}, we specialize in ${input.industry}. Our mission is to deliver exceptional value through innovation and dedication.`
      };
      break;
    case 'services':
      content = {
        title: "What We Offer",
        items: [
          { icon: 'Zap', name: "Fast Delivery", desc: "Quick turnaround times for all projects." },
          { icon: 'Shield', name: "Secure Systems", desc: "Top-tier protection for your data." },
          { icon: 'Search', name: "Insightful Analysis", desc: "Data-driven decisions for better results." }
        ]
      };
      break;
    case 'contact':
      content = {
        title: "Contact Us",
        email: `contact@${input.businessName.toLowerCase().replace(/\s/g, '')}.com`,
        phone: "+1 (555) 123-4567"
      };
      break;
    default:
      content = { title: "Generic Section", text: "Coming soon." };
  }

  return { id, type, content, layoutVariant: variant };
};

const generateSiteData = (input: AppInput): SiteData => {
  const themes: ColorTheme[] = [
    { primary: '#3b82f6', secondary: '#1e40af', accent: '#60a5fa', dark: '#111827', light: '#f9fafb' }, // Blue
    { primary: '#8b5cf6', secondary: '#5b21b6', accent: '#a78bfa', dark: '#111827', light: '#f9fafb' }, // Purple
    { primary: '#10b981', secondary: '#065f46', accent: '#34d399', dark: '#111827', light: '#f3f4f6' }, // Green
    { primary: '#f43f5e', secondary: '#9f1239', accent: '#fb7185', dark: '#0f172a', light: '#ffffff' }, // Rose
  ];

  const theme = themes[Math.floor(Math.random() * themes.length)];
  const fonts: SiteData['meta']['fontStyle'][] = ['modern', 'classic', 'playful', 'tech'];

  return {
    meta: {
      businessName: input.businessName,
      industry: input.industry,
      colors: theme,
      fontStyle: fonts[Math.floor(Math.random() * fonts.length)]
    },
    pages: {
      home: {
        sections: [
          generateSection('hero', input),
          generateSection('about', input),
          generateSection('services', input),
          generateSection('contact', input)
        ]
      },
      about: {
        sections: [
          generateSection('hero', { ...input, businessName: `About ${input.businessName}` }),
          generateSection('about', input)
        ]
      },
      services: {
        sections: [
          generateSection('hero', { ...input, businessName: "Our Expertise" }),
          generateSection('services', input)
        ]
      },
      contact: {
        sections: [
          generateSection('hero', { ...input, businessName: "Work With Us" }),
          generateSection('contact', input)
        ]
      }
    }
  };
};

// --- Components ---

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    <motion.div 
      className="bg-blue-600 h-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5 }}
    />
  </div>
);

const SectionRenderer = ({ 
  section, 
  theme, 
  isEditMode, 
  onUpdateContent,
  onSectionAction,
  onRegenerate
}: { 
  section: Section; 
  theme: ColorTheme; 
  isEditMode: boolean;
  onUpdateContent: (id: string, path: string, value: string) => void;
  onSectionAction: (id: string, action: 'delete' | 'duplicate') => void;
  onRegenerate: (id: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const renderEditableText = (path: string, text: string, className: string = "", tag: 'h1'|'h2'|'h3'|'p'|'span'|'div' = 'p') => {
    if (!isEditMode) return React.createElement(tag, { className }, text);
    
    return React.createElement(tag, {
      className: `${className} outline-none focus:ring-2 focus:ring-[var(--accent)] rounded p-1 transition-all`,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: (e: any) => onUpdateContent(section.id, path, e.target.innerText),
    }, text);
  };

  const renderSectionControls = () => {
    if (!isEditMode) return null;
    return (
      <div className="absolute top-4 right-4 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
        <button onClick={() => onRegenerate(section.id)} className="p-2 bg-white shadow-lg border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all active:scale-95" title="Regenerate">
          <RotateCcw size={14} />
        </button>
        <button onClick={() => onSectionAction(section.id, 'duplicate')} className="p-2 bg-white shadow-lg border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all active:scale-95" title="Duplicate">
          <Copy size={14} />
        </button>
        <button onClick={() => onSectionAction(section.id, 'delete')} className="p-2 bg-white shadow-lg border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 transition-all active:scale-95" title="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    );
  };

  const sectionStyles: any = {
    '--primary': theme.primary,
    '--secondary': theme.secondary,
    '--accent': theme.accent,
    '--dark': theme.dark,
    '--light': theme.light,
  };

  switch (section.type) {
    case 'hero':
      return (
        <section 
          className="relative group py-24 md:py-32 overflow-hidden" 
          style={sectionStyles}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {renderSectionControls()}
          <div className="container mx-auto px-6 relative z-1">
            <div className={`max-w-3xl ${section.layoutVariant === 1 ? 'mx-auto text-center' : ''}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {renderEditableText('title', section.content.title, "text-4xl md:text-6xl font-bold mb-6 text-[var(--dark)]", 'h1')}
                {renderEditableText('subtitle', section.content.subtitle, "text-lg md:text-xl text-gray-600 mb-8 max-w-2xl", 'p')}
                <div className={`flex gap-4 ${section.layoutVariant === 1 ? 'justify-center' : ''}`}>
                  <button className="px-8 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-md">
                    {section.content.cta}
                  </button>
                  <button className="px-8 py-3 border-2 border-[var(--primary)] text-[var(--primary)] rounded-lg font-medium hover:bg-gray-50 transition-all">
                    Learn More
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 -z-1 opacity-10">
            <div className="w-96 h-96 bg-[var(--accent)] rounded-full blur-3xl -mr-48 -mt-48"></div>
          </div>
        </section>
      );

    case 'about':
      return (
        <section className="relative group py-20 bg-[var(--light)]" style={sectionStyles}>
          {renderSectionControls()}
          <div className="container mx-auto px-6">
            <div className={`grid md:grid-cols-2 gap-12 items-center ${section.layoutVariant === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  {renderEditableText('title', section.content.title, "text-3xl font-bold mb-6 text-[var(--dark)]", 'h2')}
                  {renderEditableText('text', section.content.text, "text-lg text-gray-600 leading-relaxed", 'p')}
                </motion.div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] rounded-2xl shadow-xl overflow-hidden opacity-20 flex items-center justify-center">
                  <Layout className="text-white opacity-40" size={64} />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--accent)] rounded-lg -z-1 opacity-20"></div>
              </div>
            </div>
          </div>
        </section>
      );

    case 'services':
      return (
        <section className="relative group py-20 bg-white" style={sectionStyles}>
          {renderSectionControls()}
          <div className="container mx-auto px-6 text-center">
            {renderEditableText('title', section.content.title, "text-3xl font-bold mb-16 text-[var(--dark)]", 'h2')}
            <div className="grid md:grid-cols-3 gap-8">
              {section.content.items.map((item: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-2xl bg-[var(--light)] hover:shadow-lg transition-all border border-transparent hover:border-[var(--accent)]/20"
                >
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center mb-6 mx-auto text-[var(--primary)]">
                    <Layout size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-[var(--dark)]">{item.name}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'contact':
      return (
        <section className="relative group py-20 bg-[var(--dark)] text-white" style={sectionStyles}>
          {renderSectionControls()}
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                {renderEditableText('title', section.content.title, "text-3xl font-bold mb-4", 'h2')}
                <p className="opacity-70">We respond to all inquiries within 24 hours.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Layout size={18} />
                    </div>
                    <div>
                      <p className="text-sm opacity-60">Email</p>
                      <p className="font-medium">{section.content.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Layout size={18} />
                    </div>
                    <div>
                      <p className="text-sm opacity-60">Phone</p>
                      <p className="font-medium">{section.content.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <input type="text" placeholder="Name" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"></textarea>
                    <button className="w-full py-3 bg-[var(--primary)] rounded-lg font-medium hover:opacity-90 transition-all">Send Message</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<'landing' | 'generating' | 'builder'>('landing');
  const [input, setInput] = useState<AppInput>({
    businessName: '',
    industry: 'Business',
    description: ''
  });
  const [genProgress, setGenProgress] = useState(0);
  const [genStepLabel, setGenStepLabel] = useState("");
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [currentPage, setCurrentPage] = useState<keyof SiteData['pages']>('home');
  const [isEditMode, setIsEditMode] = useState(true);
  const [responsiveMod, setResponsiveMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showExportModal, setShowExportModal] = useState(false);

  // Simulation of AI Generation
  const handleGenerate = async () => {
    if (!input.businessName) return;

    setStep('generating');
    const steps = [
      "Analyzing your brand...",
      "Generating strategic layout...",
      "Writing professional copy...",
      "Curating design system...",
      "Constructing full-site architecture...",
      "Optimizing for performance..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenStepLabel(steps[i]);
      setGenProgress(((i + 1) / steps.length) * 100);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
    }

    const generated = generateSiteData(input);
    setSiteData(generated);
    setStep('builder');
  };

  // Site Editing Logic
  const updateSectionContent = (sectionId: string, path: string, value: string) => {
    if (!siteData) return;
    const newData = { ...siteData };
    const pages = newData.pages;
    
    // Find section in any page
    Object.keys(pages).forEach((pageKey) => {
      const page = pages[pageKey as keyof typeof pages];
      const section = page.sections.find(s => s.id === sectionId);
      if (section) {
        section.content[path] = value;
      }
    });

    setSiteData(newData);
  };

  const handleSectionAction = (id: string, action: 'delete' | 'duplicate') => {
    if (!siteData) return;
    const newData = { ...siteData };
    const page = newData.pages[currentPage];
    const index = page.sections.findIndex(s => s.id === id);

    if (action === 'delete') {
      page.sections = page.sections.filter(s => s.id !== id);
    } else if (action === 'duplicate') {
      const copy = JSON.parse(JSON.stringify(page.sections[index]));
      copy.id = Math.random().toString(36).substr(2, 9);
      page.sections.splice(index + 1, 0, copy);
    }

    setSiteData(newData);
  };

  const handleRegenerateSection = (id: string) => {
    if (!siteData) return;
    const newData = { ...siteData };
    const page = newData.pages[currentPage];
    const sectionIndex = page.sections.findIndex(s => s.id === id);
    const section = page.sections[sectionIndex];
    
    // Generate new content based on type
    const types = REGEN_CONTENT[section.type as keyof typeof REGEN_CONTENT];
    if (types) {
      const randomContent = types[Math.floor(Math.random() * types.length)];
      section.content = { ...section.content, ...randomContent };
    }
    
    // Randomize layout variant
    section.layoutVariant = section.layoutVariant === 0 ? 1 : 0;
    
    setSiteData(newData);
  };

  const getExportCode = (format: 'react' | 'html') => {
    if (!siteData) return "";
    return JSON.stringify(siteData, null, 2); // Simple placeholder for full export logic
  };

  // --- Rendering Functions ---

  const renderLanding = () => (
    <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-[#161920] rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Layout size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white underline decoration-indigo-500/50 underline-offset-4">Astra AI <span className="text-indigo-400 font-medium">Build</span></h1>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 leading-tight">Elevate your digital vision.</h2>
          <p className="text-slate-400 mb-10">High-fidelity intelligence meets professional craftsmanship.</p>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Business Name</label>
              <input 
                type="text" 
                placeholder="e.g. Forge Digital"
                className="w-full px-4 py-3 bg-[#232731] rounded-xl border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all"
                value={input.businessName}
                onChange={(e) => setInput({...input, businessName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Industry</label>
              <div className="grid grid-cols-2 gap-3">
                {(['Business', 'Portfolio', 'Ecommerce', 'Blog'] as IndustryType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setInput({...input, industry: type})}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      input.industry === type 
                      ? 'bg-indigo-600 text-white shadow-lg border-indigo-500' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
              <textarea 
                placeholder="The core essence of your project..."
                rows={3}
                className="w-full px-4 py-3 bg-[#232731] rounded-xl border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all resize-none"
                value={input.description}
                onChange={(e) => setInput({...input, description: e.target.value})}
              />
            </div>

            <button 
              onClick={handleGenerate}
              className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
            >
              Generate Website 
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderGenerating = () => (
    <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-6 text-white text-center font-sans">
      <div className="max-w-md w-full">
        <div className="mb-12 relative inline-flex">
          <div className="w-24 h-24 bg-indigo-600/20 rounded-full animate-ping absolute inset-0"></div>
          <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center relative shadow-[0_0_50px_-10px_rgba(79,70,229,0.5)]">
            <Layout size={40} className="text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-4 tracking-tight">System Forging...</h2>
        <p className="text-slate-400 mb-8 h-6 text-sm">{genStepLabel}</p>

        <div className="space-y-4">
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
            <motion.div 
              className="bg-indigo-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${genProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Progress Status</span>
            <span>{Math.round(genProgress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBuilder = () => {
    if (!siteData) return null;
    
    return (
      <div className="h-screen bg-[#0F1115] flex flex-col overflow-hidden font-sans text-slate-200">
        {/* Top Bar */}
        <header className="h-14 bg-[#161920] border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-50 shadow-lg">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Layout size={18} className="text-white" />
              </div>
              <span className="font-bold tracking-tight text-white text-lg">ForgeAI <span className="text-indigo-400 font-medium">Builder</span></span>
            </div>

            <nav className="hidden md:flex items-center gap-1 bg-[#232731] p-1 rounded-lg border border-white/5">
              {Object.keys(siteData.pages).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as any)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    currentPage === p ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex border-r border-white/10 pr-4 gap-1">
              <button 
                onClick={() => setResponsiveMode('desktop')}
                className={`p-1.5 rounded transition-all ${responsiveMod === 'desktop' ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5'}`}
              >
                <Monitor size={18} />
              </button>
              <button 
                onClick={() => setResponsiveMode('tablet')}
                className={`p-1.5 rounded transition-all ${responsiveMod === 'tablet' ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5'}`}
              >
                <Tablet size={18} />
              </button>
              <button 
                onClick={() => setResponsiveMode('mobile')}
                className={`p-1.5 rounded transition-all ${responsiveMod === 'mobile' ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5'}`}
              >
                <Smartphone size={18} />
              </button>
            </div>

            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isEditMode ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
              }`}
            >
              {isEditMode ? <Eye size={16} /> : <EyeOff size={16} />}
              {isEditMode ? 'Editor' : 'Preview'}
            </button>

            <button 
              onClick={() => setShowExportModal(true)}
              className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg"
            >
              Export Project
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <aside className="w-64 bg-[#161920] border-r border-white/10 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Sections</h3>
            </div>
            <div className="flex-1 py-2 space-y-1">
              {siteData.pages[currentPage].sections.map((section, idx) => (
                <div key={section.id} className="px-3">
                  <div 
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer group ${
                      currentPage === 'home' && idx === 0 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <Layout size={16} className="shrink-0" />
                    <span className="text-sm font-medium capitalize">{section.type}</span>
                    {currentPage === 'home' && idx === 0 && <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]"></div>}
                    <button onClick={() => handleSectionAction(section.id, 'delete')} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400 p-1">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 mt-auto">
              <button className="w-full py-2.5 rounded-lg border border-dashed border-white/20 text-slate-400 text-xs font-medium hover:border-indigo-400/50 hover:text-indigo-300 transition-all">
                + Add Section
              </button>
            </div>
          </aside>

          {/* Main Preview Area */}
          <main className="flex-1 bg-[#0F1115] relative p-8 flex flex-col items-center overflow-hidden">
            <div 
              className={`
                bg-white rounded-t-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out origin-top border border-white/5
                ${responsiveMod === 'desktop' ? 'w-full max-w-5xl' : ''}
                ${responsiveMod === 'tablet' ? 'w-[768px]' : ''}
                ${responsiveMod === 'mobile' ? 'w-[375px]' : ''}
              `}
              style={{ minHeight: 'calc(100vh - 12rem)' }}
            >
              <div className="w-full h-full flex flex-col overflow-y-auto">
                {/* Website Header */}
                <nav className="px-10 h-20 flex items-center justify-between shrink-0 bg-white">
                  <div className="text-indigo-600 font-black text-xl tracking-tighter uppercase">{siteData.meta.businessName}</div>
                  <div className="flex gap-8 text-slate-600 text-sm font-semibold">
                    <span className="text-indigo-600">Home</span>
                    <span>About</span>
                    <span>Services</span>
                    <span>Contact</span>
                  </div>
                  <div className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-full">Get Started</div>
                </nav>

                {/* Rendered Sections */}
                {siteData.pages[currentPage].sections.map((section) => (
                  <SectionRenderer 
                    key={section.id} 
                    section={section} 
                    theme={siteData.meta.colors}
                    isEditMode={isEditMode}
                    onUpdateContent={updateSectionContent}
                    onSectionAction={handleSectionAction}
                    onRegenerate={handleRegenerateSection}
                  />
                ))}

                {/* Footer */}
                <footer className="py-20 px-10 bg-slate-50 border-t border-slate-100 mt-auto">
                  <div className="container mx-auto flex flex-col md:flex-row justify-between items-center opacity-30 grayscale gap-8">
                     <div className="text-slate-900 font-bold">{siteData.meta.businessName}</div>
                     <div className="flex gap-8 text-sm">
                       <span>Resources</span>
                       <span>Company</span>
                       <span>Support</span>
                     </div>
                  </div>
                </footer>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 bg-[#1E232E] border border-white/10 rounded-full shadow-2xl z-40">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Engine Ready</span>
              </div>
              <div className="h-4 w-px bg-white/10"></div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest cursor-pointer hover:text-indigo-300 transition-colors">Regenerate Palette</span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest cursor-pointer hover:text-indigo-300 transition-colors">Switch Font Stack</span>
              </div>
            </div>
          </main>

          {/* Right Toolbar */}
          <aside className="w-16 bg-[#161920] border-l border-white/10 flex flex-col items-center py-6 gap-6 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white/10 cursor-pointer transition-colors shadow-inner">
              <Palette size={18} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white/10 cursor-pointer transition-colors shadow-inner">
              <Type size={18} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white/10 cursor-pointer transition-colors shadow-inner">
              <Code size={18} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white/10 cursor-pointer transition-colors shadow-inner mt-auto">
              <RotateCcw size={18} />
            </div>
          </aside>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {step === 'builder' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed top-20 right-6 p-4 bg-indigo-600 text-white rounded-xl shadow-2xl border border-white/20 flex items-center gap-3 z-[60]"
            >
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Check size={20} />
              </div>
              <div>
                <div className="text-sm font-bold">Forge Complete</div>
                <div className="text-[10px] text-indigo-100 opacity-80 uppercase tracking-tight">Design & Copy optimized</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Logic remains similar but themed */}
        <AnimatePresence>
          {showExportModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setShowExportModal(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-4xl bg-[#161920] rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10"
              >
                <div className="flex h-[500px]">
                  <div className="w-1/3 bg-[#0F1115] p-8 border-r border-white/5 flex flex-col">
                    <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Export Build</h2>
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">Your site is ready for deployment. Choose your preferred format.</p>
                    
                    <div className="space-y-3">
                      <button className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-left hover:border-indigo-500/50 hover:bg-white/10 transition-all flex items-center justify-between group">
                        <div>
                          <p className="font-bold text-slate-200">Production Build</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Full React Project</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-600 group-hover:text-indigo-400" />
                      </button>
                    </div>

                    <div className="mt-auto">
                      <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 shadow-xl transition-all">
                        <Download size={18} />
                        Download Bundle
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 bg-black/50 p-0 flex flex-col">
                    <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <Code size={14} className="text-indigo-400" />
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold">manifest.json</span>
                      </div>
                    </div>
                    <pre className="flex-1 p-6 overflow-auto text-indigo-300 font-mono text-[11px] leading-relaxed">
                      {getExportCode('react')}
                    </pre>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="font-sans antialiased text-slate-900">
      {step === 'landing' && renderLanding()}
      {step === 'generating' && renderGenerating()}
      {step === 'builder' && renderBuilder()}
    </div>
  );
}

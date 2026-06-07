// import React from 'react';
// import { Mail, Github, Linkedin } from 'lucide-react';

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="w-full bg-[#060B18] border-t border-white/5 pt-10 pb-8 mt-auto relative z-10">
//       <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        
//         {/* Brand & Copyright */}
//         <div className="flex flex-col items-center md:items-start gap-2">
//           <div className="flex items-center gap-[8px] font-syne text-[18px] font-[800] text-[#EDF2FF]">
//             <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full shadow-[0_0_10px_#00E5FF]"></div>
//             <span>Interv<span className="text-[#00E5FF]">IQa</span></span>
//           </div>
//           <p className="text-[#4A5A80] text-sm font-medium tracking-wide">
//             © {currentYear} IntervIQa. All rights reserved.
//           </p>
//         </div>

//         {/* Developer Social Links */}
//         <div className="flex items-center gap-4">
//           <a
//             href="mailto:shuvambiswal123@gmail.com"
//             className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[#8899BB] hover:text-[#00E5FF] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 transition-all group shadow-sm"
//             aria-label="Email"
//           >
//             <Mail size={18} className="group-hover:scale-110 transition-transform" />
//           </a>
          
//           <a
//             href="https://github.com/shuvambiswal" 
//             target="_blank"
//             rel="noopener noreferrer"
//             className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[#8899BB] hover:text-white hover:border-white/30 hover:bg-white/10 transition-all group shadow-sm"
//             aria-label="GitHub"
//           >
//             <Github size={18} className="group-hover:scale-110 transition-transform" />
//           </a>
          
//           <a
//             href="https://linkedin.com/in/shuvambiswal" 
//             target="_blank"
//             rel="noopener noreferrer"
//             className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[#8899BB] hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/10 transition-all group shadow-sm"
//             aria-label="LinkedIn"
//           >
//             <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
//           </a>
//         </div>

//         {/* Legal Links */}
//         <div className="flex gap-6 text-[#4A5A80] text-sm font-medium">
//           <a href="#" className="hover:text-[#00E5FF] transition-colors">Privacy</a>
//           <a href="#" className="hover:text-[#00E5FF] transition-colors">Terms</a>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;




import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

// ----------------------------------------------------------------------
// CONFIGURATION (In production, this might live in a constants.js file)
// ----------------------------------------------------------------------
const FOOTER_LINKS = {
  product: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Progress', href: '/progress' },
    { name: 'Features', href: '/#features' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
  socials: [
    { 
      name: 'Email', 
      icon: Mail, 
      href: 'mailto:shuvambiswal123@gmail.com',
      hoverClass: 'hover:text-[#00E5FF] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5'
    },
    { 
      name: 'GitHub', 
      icon: Github, 
      href: 'https://github.com/shuvam012', 
      hoverClass: 'hover:text-white hover:border-white/30 hover:bg-white/10'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/in/shuvam-biswal-43ab99215/', // Update with your actual LinkedIn slug if different
      hoverClass: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/10'
    }
  ]
};

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#060B18] border-t border-white/5 pt-16 pb-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* TOP SECTION: Brand & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column (Spans 5 columns on large screens) */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col items-start gap-4">
            <Link to="/" className="flex items-center gap-[10px] font-syne text-[22px] font-[800] text-[#EDF2FF] no-underline group">
              <div className="relative w-2.5 h-2.5 bg-[#00E5FF] rounded-full shadow-[0_0_12px_#00E5FF]">
                <div className="absolute inset-0 w-full h-full bg-[#00E5FF] rounded-full blur-[4px] animate-pulse"></div>
              </div>
              <span>Interv<span className="text-[#00E5FF]">IQa</span></span>
            </Link>
            
            <p className="text-[#4A5A80] text-sm leading-relaxed max-w-sm mt-2">
              The ultimate MERN stack interview preparation engine. Stop practicing blindly, start performing.
            </p>
            
            {/* Dynamic Social Links */}
            <div className="flex items-center gap-3 mt-4">
              {FOOTER_LINKS.socials.map((social) => {
                const Icon = social.icon;
                const isExternal = social.name !== 'Email';
                
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={`p-2.5 rounded-xl bg-white/5 border border-white/5 text-[#8899BB] transition-all duration-300 group shadow-sm ${social.hoverClass}`}
                    aria-label={social.name}
                    title={social.name}
                  >
                    <Icon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns (Spans 7 columns on large screens) */}
          <div className="md:col-span-6 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Column 1: Product */}
            <div>
              <h3 className="font-syne font-bold text-white text-sm uppercase tracking-widest mb-6">Product</h3>
              <ul className="space-y-4">
                {FOOTER_LINKS.product.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className="text-[#4A5A80] hover:text-[#00E5FF] text-sm font-medium transition-colors">
                        {link.name}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-[#4A5A80] hover:text-[#00E5FF] text-sm font-medium transition-colors">
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Legal */}
            <div>
              <h3 className="font-syne font-bold text-white text-sm uppercase tracking-widest mb-6">Legal</h3>
              <ul className="space-y-4">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[#4A5A80] hover:text-[#00E5FF] text-sm font-medium transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: System Status (Premium SaaS Detail) */}
            <div>
              <h3 className="font-syne font-bold text-white text-sm uppercase tracking-widest mb-6">System</h3>
              <div className="flex items-center gap-2 text-sm font-medium text-[#4A5A80] hover:text-[#EDF2FF] transition-colors cursor-default">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10F4A0] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10F4A0]"></span>
                </div>
                All systems operational
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: Copyright & Developer Credit */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#4A5A80] text-sm font-medium tracking-wide">
            © {currentYear} IntervIQa. All rights reserved.
          </p>
          
          <p className="text-[#4A5A80] text-sm flex items-center gap-1.5 font-mono">
            Developed by 
            <a 
              href="https://github.com/shuvam012" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#8899BB] hover:text-[#00E5FF] font-bold transition-colors inline-flex items-center gap-1 group"
            >
              Shuvam Biswal 
              <ExternalLink size={12} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-blue text-white pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/logo.png" 
                alt="Desire Job Hub Logo" 
                width={150} 
                height={50} 
                className="h-12 w-auto bg-white rounded-xl p-2 shadow-sm"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Nepal&apos;s trusted job portal connecting talented professionals with top companies across the country.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Twitter, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href}
                  className="w-10 h-10 glass-dark rounded-xl flex items-center justify-center text-white/70 hover:text-brand-orange hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-6 tracking-wide text-white">Company</h4>
            <ul className="space-y-4">
              {[
                { label: 'Browse Jobs', href: '/#jobs' },
                { label: 'How It Works', href: '/#how-it-works' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'CV Builder', href: '/cv-builder' },
                { label: 'Admin Login', href: '/admin/login' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/50 hover:text-white text-sm transition-all flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-brand-orange rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h4 className="font-bold text-sm mb-4 tracking-wide">Top Categories</h4>
            <ul className="space-y-2.5">
              {['Technology', 'Marketing', 'Finance', 'Engineering', 'Education', 'Healthcare'].map((cat) => (
                <li key={cat}>
                  <Link href="/#jobs" className="text-white/60 hover:text-brand-orange text-sm transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm mb-4 tracking-wide">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0" />
                Kathmandu, Nepal
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-brand-orange flex-shrink-0" />
                info@desirejobhub.com
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" />
                +977 9800000000
              </li>
            </ul>

            <div className="mt-5 p-3 glass rounded-xl text-center">
              <p className="text-xs text-white/70">Payment via</p>
              <p className="text-sm font-bold text-green-400 mt-0.5">eSewa</p>
              <p className="text-xs text-white/50">NPR 500 / 3 Unlocks</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2025 Desire Job Hub. All rights reserved. Made with ❤️ for Nepal</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

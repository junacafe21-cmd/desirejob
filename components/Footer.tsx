import Link from 'next/link';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-blue text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Desire Job Hub Logo" className="h-10 w-auto bg-white rounded-lg p-1.5 object-contain" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Nepal&apos;s trusted job portal connecting talented professionals with top companies across the country.
            </p>
            <div className="flex gap-3">
              {['f', 'in', 't'].map((icon) => (
                <div key={icon} className="w-8 h-8 glass rounded-lg flex items-center justify-center text-xs font-bold text-white/70 hover:bg-white/20 cursor-pointer transition">
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm mb-4 tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Browse Jobs', href: '/#jobs' },
                { label: 'How It Works', href: '/#how-it-works' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'CV Builder', href: '/cv-builder' },
                { label: 'Admin Login', href: '/admin/login' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-brand-orange text-sm transition-colors">
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
                  <a href="/#jobs" className="text-white/60 hover:text-brand-orange text-sm transition-colors">
                    {cat}
                  </a>
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
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

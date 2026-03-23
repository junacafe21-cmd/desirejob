import { Check, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PricingSection() {
  const features = [
    'Apply to any job posting',
    'Upload your CV / Resume',
    '3 job detail credits (contact info)',
    'Admin manually verifies payment',
    'Full job details sent to your email',
    'Valid until all 3 credits are used',
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="badge bg-brand-orange/10 text-brand-orange text-sm mb-3">Transparent Pricing</span>
          <h2 className="section-title mb-3">Simple & Affordable</h2>
          <p className="section-subtitle">No hidden fees. Pay once, unlock 3 jobs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Free card */}
          <div className="card p-6 flex flex-col">
            <div className="mb-4">
              <span className="badge bg-gray-100 text-gray-600 text-xs mb-3">Free</span>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-black text-gray-800">NPR 0</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Browse without limits</p>
            </div>

            <ul className="flex-1 space-y-3 mb-6">
              {['Browse all job listings', 'View job title & company', 'View location & salary range', 'Search & filter jobs'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/#jobs" className="btn-outline text-sm py-2.5 text-center justify-center">
              Browse Jobs
            </Link>
          </div>

          {/* Paid card (featured) */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            {/* Popular badge */}
            <div className="bg-brand-orange text-white text-xs font-bold text-center py-2 tracking-wider">
              ⭐ MOST POPULAR
            </div>
            <div className="bg-brand-blue p-6 text-white flex flex-col h-full">
              <div className="mb-4">
                <span className="badge glass text-white/80 text-xs mb-3">
                  <Zap className="w-3 h-3" /> Job Seeker Plan
                </span>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black">NPR 500</span>
                </div>
                <p className="text-white/60 text-sm mt-1">One-time payment</p>
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-brand-orange flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/#jobs" className="btn-primary text-sm py-3 text-center justify-center">
                Apply Now — NPR 500
              </Link>
            </div>
          </div>

          {/* Trust card */}
          <div className="card p-6 flex flex-col">
            <div className="mb-4">
              <span className="badge bg-green-50 text-green-600 text-xs mb-3">
                <Shield className="w-3 h-3 inline mr-1" /> Secure & Trusted
              </span>
              <h3 className="text-lg font-bold text-brand-blue">Why Choose Us?</h3>
            </div>

            <ul className="flex-1 space-y-4 mb-6">
              {[
                { title: 'Verified Jobs', desc: 'All listings manually reviewed' },
                { title: 'eSewa Payment', desc: 'Secure QR-based payment' },
                { title: 'Quick Verification', desc: 'Admin approval within 24 hrs' },
                { title: 'Email Delivery', desc: 'Details sent to your inbox' },
                { title: 'Nepal Focused', desc: 'Jobs from across Nepal' },
              ].map((i) => (
                <li key={i.title} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{i.title}</p>
                    <p className="text-xs text-gray-500">{i.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="text-center text-xs text-gray-400">
              🔒 Your data is safe & secure
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

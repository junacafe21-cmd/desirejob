import { CheckCircle, CreditCard, Mail, Unlock } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <CheckCircle className="w-7 h-7 text-white" />,
      step: '01',
      title: 'Browse Jobs',
      desc: 'Search and filter through hundreds of verified job listings across Nepal. View basic job info for free.',
      color: 'from-blue-500 to-brand-blue',
    },
    {
      icon: <CreditCard className="w-7 h-7 text-white" />,
      step: '02',
      title: 'Pay NPR 500',
      desc: 'Fill out the application form, scan the eSewa QR code, pay NPR 500, and upload your payment screenshot.',
      color: 'from-brand-orange to-orange-400',
    },
    {
      icon: <Unlock className="w-7 h-7 text-white" />,
      step: '03',
      title: 'Get Verified',
      desc: 'Our admin team reviews your payment within 24 hours. Once approved, you get 3 job detail credits.',
      color: 'from-purple-500 to-purple-700',
    },
    {
      icon: <Mail className="w-7 h-7 text-white" />,
      step: '04',
      title: 'Receive Details',
      desc: 'Full job contact information and application instructions are sent directly to your email inbox.',
      color: 'from-green-500 to-emerald-700',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="badge bg-brand-orange/10 text-brand-orange text-sm mb-3">Simple Process</span>
          <h2 className="section-title mb-3">How Desire Job Hub Works</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Get connected with your dream employer in just 4 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-orange-200 to-green-200 z-0" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10">
              {/* Icon circle */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center mb-5`}>
                {step.icon}
              </div>

              {/* Step number */}
              <span className="text-xs font-bold text-gray-400 tracking-widest mb-2">STEP {step.step}</span>

              <h3 className="text-lg font-bold text-brand-blue mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-14 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl p-6 text-center">
          <p className="text-brand-blue font-semibold text-sm">
            💡 1 payment (NPR 500) = 3 job detail unlocks. Apply to multiple jobs with a single payment!
          </p>
        </div>
      </div>
    </section>
  );
}

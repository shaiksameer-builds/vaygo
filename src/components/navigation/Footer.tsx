import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, MessageCircle, AtSign, Play, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../common/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#000000] text-white border-t border-white/12 textured-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand with new stylized V logo */}
          <div>
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6 font-normal">
              India's premier peer-to-peer vehicle rental marketplace. Your ride. Your rules. Rent bikes, scooters and cars directly from verified hosts.
            </p>
            <div className="flex gap-3">
              {[Share2, MessageCircle, AtSign, Play].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl glass-card flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-widest text-[#A1A1AA] mb-5">Explore</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Browse Bikes & Scooters', href: '/vehicles?category=bike' },
                { label: 'Browse Cars & SUVs', href: '/vehicles?category=car' },
                { label: 'Partner with Us (List Vehicle)', href: '/owner' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-[#A1A1AA] hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & FAQ */}
          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-widest text-[#A1A1AA] mb-5">Help & FAQ</h4>
            <ul className="flex flex-col gap-3">
              {[
                'Zero Security Deposit Policy',
                'Insurance & Roadside Assistance',
                'Cancellation & Refund Terms',
                'Owner Verification Process',
                'Terms of Service',
                'Privacy Policy',
              ].map((item) => (
                <li key={item}>
                  <a href="#faq-section" className="text-[#A1A1AA] hover:text-white text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact-section">
            <h4 className="font-extrabold text-xs uppercase tracking-widest text-[#A1A1AA] mb-5">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-white mt-0.5 shrink-0" />
                <span className="text-[#A1A1AA] text-sm">Forum Mall Hub, Koramangala, Bangalore 560034</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-white shrink-0" />
                <span className="text-[#A1A1AA] text-sm">+91 98765 43210 (24x7 Helpdesk)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-white shrink-0" />
                <span className="text-[#A1A1AA] text-sm">support@vaygo.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#A1A1AA] text-xs">
            © {new Date().getFullYear()} VAYGO Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#A1A1AA] hover:text-white text-xs transition-colors">Terms</a>
            <a href="#" className="text-[#A1A1AA] hover:text-white text-xs transition-colors">Privacy</a>
            <a href="#" className="text-[#A1A1AA] hover:text-white text-xs transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

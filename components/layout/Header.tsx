'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Header Component
 * RTL navigation with logo, menu links, and mobile hamburger
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'בית' },
    { href: '/menu', label: 'תפריט' },
    { href: '/restaurant', label: 'מסעדה' },
    { href: '/catering', label: 'מגשי אירוח' },
    { href: '/events', label: 'אירועים' },
    { href: '/about', label: 'אודות' },
  ];

  return (
    <>
      <header className="fixed top-4 left-4 right-4 md:left-8 md:right-8 z-[100]">
        <nav className="relative bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-lg px-6 py-2.5 transition-all duration-300 hover:shadow-xl">
          {/* Crystal shine effect overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img
                  src="https://pub-e7a678d37a4b4de2b823a798b342edd3.r2.dev/logo.png"
                  alt="ביס מרוקאי"
                  className="h-12 w-auto"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-brand-black font-medium hover:text-brand-red transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-brand-red group-hover:w-full transition-all duration-300 origin-right" />
                </Link>
              ))}

              {/* CTA Button */}
              <Link
                href="/restaurant"
                className="px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-brand-red to-brand-orange hover:shadow-lg transition-all duration-300"
              >
                הזמנת שולחן
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="תפריט"
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-brand-black block"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-brand-black block"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-brand-black block"
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-[72px] left-4 right-4 bottom-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-xl z-[90] md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col p-6 gap-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-2xl font-bold text-brand-black hover:text-brand-red transition-colors py-3 border-b border-border-light"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-4"
              >
                <Link
                  href="/restaurant"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-6 py-4 rounded-lg font-bold text-white bg-gradient-to-r from-brand-red to-brand-orange shadow-md"
                >
                  הזמנת שולחן
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Menu, X, ChevronDown, User } from 'lucide-react';

const zones = [
  { name: '북클럽', href: '/bookclub' },
  { name: '낭독', href: '/narration' },
  { name: '듣기', href: '/listening' },
  { name: '필사', href: '/writing' },
  { name: '서평', href: '/review' },
];

const navItems = [
  { name: '홈', href: '/' },
  { name: '존', href: '/zone', hasDropdown: true },
  { name: '랭킹', href: '/ranking' },
  { name: '오거서 몰', href: '/mall' },
  { name: '마이페이지', href: '/mypage' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
  const [mobileZoneOpen, setMobileZoneOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setZoneDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-header-bg text-header-text">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <BookOpen className="h-7 w-7 text-amber-400" />
            <span className="text-xl font-bold tracking-tight">오거서</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setZoneDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {item.name}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        zoneDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {zoneDropdownOpen && (
                    <div
                      className="absolute left-0 top-full mt-1 w-40 overflow-hidden rounded-xl bg-white py-1"
                      style={{ boxShadow: 'var(--shadow-lg)' }}
                    >
                      {zones.map((zone) => (
                        <Link
                          key={zone.href}
                          href={zone.href}
                          className="block px-4 py-2.5 text-sm font-medium text-warm-gray-700 transition-colors hover:bg-green-50 hover:text-primary"
                          onClick={() => setZoneDropdownOpen(false)}
                        >
                          {zone.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Right Side: Login + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Login Link (Desktop) */}
            <Link
              href="/login"
              className="hidden items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white md:flex"
            >
              <User className="h-4 w-4" />
              로그인
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="rounded-lg p-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white md:hidden"
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-green-900 md:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-3">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <div key={item.name}>
                  <button
                    type="button"
                    onClick={() => setMobileZoneOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {item.name}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        mobileZoneOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileZoneOpen && (
                    <div className="ml-4 border-l border-white/10 pl-3">
                      {zones.map((zone) => (
                        <Link
                          key={zone.href}
                          href={zone.href}
                          className="block rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileZoneOpen(false);
                          }}
                        >
                          {zone.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}

            {/* Mobile Login Link */}
            <div className="mt-2 border-t border-white/10 pt-2">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                로그인
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

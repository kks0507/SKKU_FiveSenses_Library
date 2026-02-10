import Link from 'next/link';

const quickLinks = [
  { name: '홈', href: '/' },
  { name: '존 활동', href: '/zone' },
  { name: '랭킹', href: '/ranking' },
  { name: '오거서 몰', href: '/mall' },
  { name: '마이페이지', href: '/mypage' },
];

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-text">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Column 1: 학술정보관 정보 */}
          <div>
            <h3 className="mb-4 text-base font-bold text-white">
              성균관대학교 학술정보관
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>서울특별시 종로구 성균관로 25-2</li>
              <li>운영시간: 평일 09:00 - 22:00</li>
              <li>주말/공휴일: 09:00 - 17:00</li>
            </ul>
          </div>

          {/* Column 2: 바로가기 */}
          <div>
            <h3 className="mb-4 text-base font-bold text-white">바로가기</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: 문의 */}
          <div>
            <h3 className="mb-4 text-base font-bold text-white">문의</h3>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>
                이메일:{' '}
                <a
                  href="mailto:library@skku.edu"
                  className="transition-colors hover:text-white"
                >
                  library@skku.edu
                </a>
              </li>
              <li>
                전화:{' '}
                <a
                  href="tel:02-760-1234"
                  className="transition-colors hover:text-white"
                >
                  02-760-1234
                </a>
              </li>
              <li>
                <Link
                  href="https://library.skku.edu"
                  className="transition-colors hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  학술정보관 홈페이지
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-10 border-t border-warm-gray-700 pt-6 text-center text-xs text-warm-gray-500">
          &copy; {new Date().getFullYear()} 성균관대학교 학술정보관 &middot;
          오거서 독서진흥 플랫폼. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

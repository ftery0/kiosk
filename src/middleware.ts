import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // 지원하는 언어 목록
  locales: ['ko', 'en'],
  
  // 기본 언어
  defaultLocale: 'ko',
  
  // 관리자 페이지는 다국어 지원에서 제외
  localePrefix: 'as-needed'
});

export const config = {
  // 모든 경로에 대해 미들웨어 적용
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 
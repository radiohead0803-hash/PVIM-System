import type { Metadata } from "next";
import Link from 'next/link';
import {
  LayoutDashboard,
  Inbox,
  PlusCircle,
  Search,
  Grid3X3,
  FileText,
  Database,
  Settings,
  User
} from 'lucide-react';
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "PVIM | 과거차 문제점 관리 시스템",
  description: "Apple 스타일의 전사적 과거차 품질 이슈 트래킹 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.brand}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #007AFF, #5856D6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 14
              }}>P</div>
              PVIM 시스템
            </div>

            <nav style={{ flex: 1 }}>
              <div className={styles.navSection}>
                <div className={styles.navTitle}>워크스페이스</div>
                <Link href="/" className={`${styles.navItem} ${styles.navItemActive}`}>
                  <LayoutDashboard size={18} /> 대시보드
                </Link>
                <Link href="#" className={styles.navItem}>
                  <Inbox size={18} /> 인박스
                </Link>
                <Link href="/issues/new" className={styles.navItem}>
                  <PlusCircle size={18} color="var(--system-blue)" /> 이슈 등록
                </Link>
              </div>

              <div className={styles.navSection}>
                <div className={styles.navTitle}>품질 관리</div>
                <Link href="#" className={styles.navItem}>
                  <Search size={18} /> 이슈 탐색기
                </Link>
                <Link href="#" className={styles.navItem}>
                  <Grid3X3 size={18} /> 수평전개 매트릭스
                </Link>
                <Link href="#" className={styles.navItem}>
                  <FileText size={18} /> 8D 보고서
                </Link>
              </div>

              <div className={styles.navSection}>
                <div className={styles.navTitle}>시스템 관리</div>
                <Link href="#" className={styles.navItem}>
                  <Database size={18} /> 마스터 데이터
                </Link>
                <Link href="#" className={styles.navItem}>
                  <Settings size={18} /> 설정
                </Link>
              </div>
            </nav>

            <div className={styles.userSection} style={{ borderTop: '1px solid var(--system-gray5)', paddingTop: 16 }}>
              <div className={styles.userBadge}>
                <div className={styles.avatar}><User size={16} /></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>관리자</span>
                  <span style={{ fontSize: 11, color: 'var(--system-gray)' }}>radiohead0803</span>
                </div>
              </div>
            </div>
          </aside>

          <main className={styles.main}>
            {/* Header removed from here to follow modern seamless look, or integrated into main content if needed */}
            <div className={styles.content}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

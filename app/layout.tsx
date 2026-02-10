import type { Metadata } from "next";
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
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--system-blue)' }}></div>
              PVIM System
            </div>
            
            <nav>
              <div className={styles.navSection}>
                <div className={styles.navTitle}>Workspace</div>
                <div className={`${styles.navItem} ${styles.navItemActive}`}>Dashboard</div>
                <div className={styles.navItem}>Inbox</div>
                <div className={styles.navItem}>My Issues</div>
              </div>
              
              <div className={styles.navSection}>
                <div className={styles.navTitle}>Quality Management</div>
                <div className={styles.navItem}>Issue Explorer</div>
                <div className={styles.navItem}>Horizontal Matrix</div>
                <div className={styles.navItem}>8D Reports</div>
              </div>

              <div className={styles.navSection}>
                <div className={styles.navTitle}>Admin</div>
                <div className={styles.navItem}>Master Data</div>
                <div className={styles.navItem}>Settings</div>
              </div>
            </nav>
          </aside>
          
          <main className={styles.main}>
            <header className={styles.header}>
              <div className={styles.userBadge}>
                <span>radiohead0803-hash</span>
                <div className={styles.avatar}>RH</div>
              </div>
            </header>
            <div className={styles.content}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

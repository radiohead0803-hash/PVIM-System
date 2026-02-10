import styles from "./page.module.css";
import { prisma } from "@/app/lib/prisma";

export default async function Home() {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const activeIssueCount = await prisma.issue.count({
    where: { status: { not: 'CLOSED' } }
  });

  return (
    <div className={styles.dashboard}>
      <header className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Dashboard</h1>
        <p className={styles.sectionSub}>품질 이슈 실시간 모니터링 및 요약</p>
      </header>

      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>진행 중인 이슈</div>
          <div className={styles.kpiValue}>{activeIssueCount}</div>
          <div className={`${styles.kpiTrend} ${styles.trendUp}`}>
            ▲ 실시간 연동 중
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>평균 해결 리드타임 (TTR)</div>
          <div className={styles.kpiValue}>4.2d</div>
          <div className={`${styles.kpiTrend} ${styles.trendDown}`}>
            ▼ 0.5d (목표 달성 중)
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>미결재 이슈</div>
          <div className={styles.kpiValue}>5</div>
          <div className={styles.kpiTrend} style={{ color: 'var(--system-gray)' }}>
            긴급(S/A) 2건 포함
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>수평전개 이행률</div>
          <div className={styles.kpiValue}>92%</div>
          <div className={`${styles.kpiTrend} ${styles.trendUp}`}>
            ▲ 2.4% (전월 대비)
          </div>
        </div>
      </section>

      <section className={styles.issueListSection}>
        <div className={styles.sectionHeader} style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>최근 품질 이슈</h2>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>심각도</th>
                <th>이슈 번호 / 제목</th>
                <th>차종</th>
                <th>상태</th>
                <th>발행일</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td>
                    <span className={`${styles.severity} ${styles[`severity${issue.severity}`]}`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>ISS-{issue.id.toString().padStart(4, '0')}</div>
                    <div style={{ fontSize: 13, color: 'var(--system-gray)' }}>{issue.title}</div>
                  </td>
                  <td>{issue.programId}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[issue.status.toLowerCase()]}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td>{new Date(issue.occurrenceDate).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--system-gray)' }}>
                    등록된 이슈가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Dashboard</h1>
        <p className={styles.sectionSub}>품질 이슈 실시간 모니터링 및 요약</p>
      </header>

      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>진행 중인 이슈</div>
          <div className={styles.kpiValue}>24</div>
          <div className={`${styles.kpiTrend} ${styles.trendUp}`}>
            ▲ 12% (지난주 대비)
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
              <tr>
                <td><span className={`${styles.severity} ${styles.severityS}`}>S</span></td>
                <td>
                  <div style={{ fontWeight: 600 }}>ISS-2024-001</div>
                  <div style={{ fontSize: 13, color: 'var(--system-gray)' }}>프론트 범퍼 도장 들뜸 현상</div>
                </td>
                <td>MQ4</td>
                <td><span className={`${styles.statusBadge} ${styles.analysis}`}>Analysis</span></td>
                <td>2024.02.10</td>
              </tr>
              <tr>
                <td><span className={`${styles.severity} ${styles.severityA}`}>A</span></td>
                <td>
                  <div style={{ fontWeight: 600 }}>ISS-2024-002</div>
                  <div style={{ fontSize: 13, color: 'var(--system-gray)' }}>리어 도어 실링 누수 (시사출)</div>
                </td>
                <td>SX2</td>
                <td><span className={`${styles.statusBadge} ${styles.draft}`}>Draft</span></td>
                <td>2024.02.09</td>
              </tr>
              <tr>
                <td><span className={`${styles.severity} ${styles.severityC}`}>C</span></td>
                <td>
                  <div style={{ fontWeight: 600 }}>ISS-2024-003</div>
                  <div style={{ fontSize: 13, color: 'var(--system-gray)' }}>클러스터 베젤 조립 유격</div>
                </td>
                <td>EV6</td>
                <td><span className={`${styles.statusBadge} ${styles.closed}`}>Closed</span></td>
                <td>2024.02.08</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

import styles from "./page.module.css";
import { prisma } from "@/app/lib/prisma";
import { QualityTrendChart, SeverityDistribution } from "./components/DashboardCharts";
import { AlertCircle, Clock, CheckCircle2, Share2, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
        <div>
          <h1 className={styles.sectionTitle}>종합 품질 대시보드</h1>
          <p className={styles.sectionSub}>실시간 품질 현황 및 주요 지표 분석</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className={styles.secondaryButton}>보고서 내보내기</button>
          <button className={styles.primaryButton}>신규 필터링</button>
        </div>
      </header>

      {/* KPI 카드 섹션 */}
      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)', color: '#007AFF' }}>
            <AlertCircle size={20} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>진행 중인 이슈</div>
            <div className={styles.kpiValue}>{activeIssueCount}</div>
            <div className={`${styles.kpiTrend} ${styles.trendUp}`}>
              <ArrowUpRight size={14} /> 12% 상승 (전주 대비)
            </div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34C759' }}>
            <Clock size={20} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>평균 해결 리드타임</div>
            <div className={styles.kpiValue}>4.2d</div>
            <div className={`${styles.kpiTrend} ${styles.trendDown}`}>
              <ArrowDownRight size={14} /> 0.5d 감소 (목표 달성)
            </div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(255, 149, 0, 0.1)', color: '#FF9500' }}>
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>미결재 이슈</div>
            <div className={styles.kpiValue}>5</div>
            <div className={styles.kpiTrend} style={{ color: 'var(--system-gray)' }}>
              긴급(S/A) 2건 포함
            </div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(88, 86, 214, 0.1)', color: '#5856D6' }}>
            <Share2 size={20} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>수평전개 이행률</div>
            <div className={styles.kpiValue}>92%</div>
            <div className={`${styles.kpiTrend} ${styles.trendUp}`}>
              <ArrowUpRight size={14} /> 2.4% 상승 (전월 대비)
            </div>
          </div>
        </div>
      </section>

      {/* 그래프 섹션 */}
      <div className={styles.chartGrid}>
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>품질 이슈 발생 트렌드</h2>
          <QualityTrendChart />
        </section>
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>심각도별 분포 현황</h2>
          <SeverityDistribution />
        </section>
      </div>

      {/* 리스트 섹션 */}
      <section className={styles.issueListSection}>
        <div className={styles.sectionHeader} style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>최근 품질 이슈 목록</h2>
          <span className={styles.viewAll}>전체 보기</span>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>심각도</th>
                <th>이슈 정보</th>
                <th>차종</th>
                <th>상태</th>
                <th>발행일</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td style={{ width: 80 }}>
                    <span className={`${styles.severity} ${styles[`severity${issue.severity}`]}`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>ISS-{issue.id.toString().padStart(4, '0')}</div>
                    <div style={{ fontSize: 13, color: 'var(--system-gray)', marginTop: 2 }}>{issue.title}</div>
                  </td>
                  <td>
                    <span className={styles.programBadge}>{issue.programId}</span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[issue.status.toLowerCase()]}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--system-gray)' }}>
                    {new Date(issue.occurrenceDate).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--system-gray)' }}>
                    등록된 데이터가 없습니다.
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

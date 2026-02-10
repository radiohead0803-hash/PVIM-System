import styles from "./page.module.css";
import { prisma } from "@/app/lib/prisma";
import { QualityTrendChart, SeverityDistribution } from "./components/DashboardCharts";
import { AlertCircle, Clock, CheckCircle2, Share2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from 'next/link';
import ExportButton from "./components/ExportButton";

interface HomeProps {
  searchParams: {
    program?: string;
    severity?: string;
    period?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const { program, severity, period } = searchParams;

  // 필터 조건 구성
  const where: any = {};
  if (program) where.programId = program;
  if (severity) where.severity = severity;
  if (period === '1m') {
    where.occurrenceDate = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
  } else if (period === '3m') {
    where.occurrenceDate = { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
  }

  const issues = await prisma.issue.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const allIssues = await prisma.issue.findMany({ where });

  // KPI 1: 진행 중인 이슈
  const activeIssueCount = await prisma.issue.count({
    where: { ...where, status: { not: 'CLOSED' } }
  });

  // KPI 2: 평균 해결 리드타임 (최근 30일 종결 건 기준)
  const recentlyClosed = await prisma.issue.findMany({
    where: { ...where, status: 'CLOSED', updatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    include: { history: true }
  });

  let avgLeadTime = 0;
  if (recentlyClosed.length > 0) {
    const totalDays = recentlyClosed.reduce((acc, issue) => {
      const closedEvent = issue.history.find(h => h.toStatus === 'CLOSED');
      const start = issue.occurrenceDate;
      const end = closedEvent ? closedEvent.createdAt : issue.updatedAt;
      return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    }, 0);
    avgLeadTime = totalDays / recentlyClosed.length;
  }

  // KPI 3: 분석 대기 이슈 (DRAFT 상태)
  const draftCount = await prisma.issue.count({
    where: { ...where, status: 'DRAFT' }
  });

  // KPI 4: 수평전개 필요 이슈 비율
  const analysisWithDeployment = await prisma.issueAnalysis.count({
    where: { horizontalDeploymentNeeded: true }
  });
  const totalAnalysis = await prisma.issueAnalysis.count();
  const deploymentRate = totalAnalysis > 0 ? (analysisWithDeployment / totalAnalysis * 100).toFixed(0) : 0;

  // 그래프 데이터 가공 (최근 7개월 트렌드)
  const now = new Date();
  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setMonth(now.getMonth() - i);
    const month = (d.getMonth() + 1) + '월';
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    const monthIssues = allIssues.filter(iss => {
      const occDate = new Date(iss.occurrenceDate);
      return occDate >= startOfMonth && occDate <= endOfMonth;
    });
    const monthResolved = allIssues.filter(iss => {
      return iss.status === 'CLOSED' && iss.updatedAt >= startOfMonth && iss.updatedAt <= endOfMonth;
    });

    trendData.push({ name: month, issues: monthIssues.length, resolved: monthResolved.length });
  }

  const severityData = [
    { name: 'S (치명)', count: allIssues.filter(i => i.severity === 'S').length, color: '#FF3B30' },
    { name: 'A (중대)', count: allIssues.filter(i => i.severity === 'A').length, color: '#FF9500' },
    { name: 'B (일반)', count: allIssues.filter(i => i.severity === 'B').length, color: '#FFCC00' },
    { name: 'C (경미)', count: allIssues.filter(i => i.severity === 'C').length, color: '#34C759' },
  ];

  const programs = await prisma.vehicleProgram.findMany();

  return (
    <div className={styles.dashboard}>
      <header className={styles.sectionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>종합 품질 대시보드</h1>
          <p className={styles.sectionSub}>실시간 품질 현황 및 주요 지표 분석</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <ExportButton data={allIssues} />
          <Link href="/issues/new" className={styles.primaryButton} style={{ textDecoration: 'none' }}>이슈 등록</Link>
        </div>
      </header>

      {/* 필터 바 추가 */}
      <section className={styles.filterBar}>
        <form style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select name="program" defaultValue={program || ""} className={styles.filterSelect}>
            <option value="">모든 차종</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.id}</option>
            ))}
          </select>
          <select name="severity" defaultValue={severity || ""} className={styles.filterSelect}>
            <option value="">모든 심각도</option>
            <option value="S">S (치명)</option>
            <option value="A">A (중대)</option>
            <option value="B">B (일반)</option>
            <option value="C">C (경미)</option>
          </select>
          <select name="period" defaultValue={period || ""} className={styles.filterSelect}>
            <option value="">전체 기간</option>
            <option value="1m">최근 1개월</option>
            <option value="3m">최근 3개월</option>
          </select>
          <button type="submit" className={styles.filterButton}>필터 적용</button>
          <Link href="/" className={styles.clearButton}>초기화</Link>
        </form>
      </section>

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
              <ArrowUpRight size={14} /> 실시간 업데이트
            </div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34C759' }}>
            <Clock size={20} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>평균 해결 리드타임</div>
            <div className={styles.kpiValue}>{avgLeadTime > 0 ? `${avgLeadTime.toFixed(1)}d` : '-'}</div>
            <div className={`${styles.kpiTrend} ${avgLeadTime < 5 ? styles.trendDown : styles.trendUp}`}>
              {avgLeadTime > 0 ? (avgLeadTime < 5 ? '목표 달성 중' : '관리 필요') : '데이터 부족'}
            </div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(255, 149, 0, 0.1)', color: '#FF9500' }}>
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>분석 대기 이슈</div>
            <div className={styles.kpiValue}>{draftCount}</div>
            <div className={styles.kpiTrend} style={{ color: 'var(--system-gray)' }}>
              신규 등록 건 포함
            </div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(88, 86, 214, 0.1)', color: '#5856D6' }}>
            <Share2 size={20} />
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>수평전개 검토율</div>
            <div className={styles.kpiValue}>{deploymentRate}%</div>
            <div className={`${styles.kpiTrend} ${styles.trendUp}`}>
              <ArrowUpRight size={14} /> 분석 완료 건 기준
            </div>
          </div>
        </div>
      </section>

      {/* 그래프 섹션 */}
      <div className={styles.chartGrid}>
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>품질 이슈 발생 트렌드 (최근 7개월)</h2>
          <QualityTrendChart data={trendData} />
        </section>
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>심각도별 분포 현황</h2>
          <SeverityDistribution data={severityData} />
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
                <tr key={issue.id} style={{ cursor: 'pointer' }}>
                  <td style={{ width: 80 }}>
                    <span className={`${styles.severity} ${styles[`severity${issue.severity}`]}`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td>
                    <Link href={`/issues/${issue.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>ISS-{issue.id.toString().padStart(4, '0')}</div>
                      <div className={styles.issueTitleHover} style={{ fontSize: 13, color: 'var(--system-gray)', marginTop: 2 }}>{issue.title}</div>
                    </Link>
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

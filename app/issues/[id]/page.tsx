import { prisma } from "@/app/lib/prisma";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import {
    Calendar,
    User,
    MapPin,
    History,
    FileDown,
    Printer,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { AnalysisStep, ApprovalWidget, FileUploadWidget } from "./IssueDetailClient";

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function IssueDetailPage({ params }: PageProps) {
    const { id } = await params;

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) },
        include: {
            analysis: true,
            history: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!issue) {
        notFound();
    }

    const steps = [
        { num: 'D1', title: '팀 구성 (Team Formation)', content: issue.reportedBy + ' 및 품질관리팀' },
        { num: 'D2', title: '문제 기술 (Problem Description)', content: issue.title },
        { num: 'D3', title: '임시 봉쇄 조치 (ICA)', content: issue.analysis?.symptomDetail, field: 'symptomDetail' },
        { num: 'D4', title: '근본 원인 분석 (Root Cause)', content: issue.analysis?.rootCauseDetail, field: 'rootCauseDetail' },
        { num: 'D5', title: '영구 대책 수립 (PCA)', content: issue.analysis?.countermeasure, field: 'countermeasure' },
        { num: 'D5-1', title: '조치 부서 및 담당자', content: (issue.analysis?.actionDept || '-') + ' / ' + (issue.analysis?.actionOwner || '-'), field: 'actionOwner' }, // Simplified for editing owner
        { num: 'D5-2', title: '개선반영일', content: issue.analysis?.improvementRefDate || '', field: 'improvementRefDate', type: 'date' as const },
        { num: 'D5-3', title: '조치 상태', content: issue.analysis?.actionStatus || '검토 중', field: 'actionStatus' },
        { num: 'D5-4', title: '조치 구분', content: issue.analysis?.actionCategory || '설계 변경 등', field: 'actionCategory' },
        { num: 'D6', title: '유효성 검증 (Validation)', content: issue.analysis?.verificationMethod, field: 'verificationMethod' },
        { num: 'D6-1', title: '검증 결과 및 완료일', content: (issue.analysis?.verificationResult || '-') + ' (' + (issue.analysis?.verifiedAt ? new Date(issue.analysis.verifiedAt).toLocaleDateString() : '-') + ')', field: 'verifiedAt', type: 'date' as const },
        {
            num: 'D7',
            title: '재발 방지 및 수평 전개 (Prevention)',
            content: !!issue.analysis?.horizontalDeploymentNeeded,
            field: 'horizontalDeploymentNeeded',
            type: 'checkbox' as const
        },
        { num: 'D8', title: '팀 격려 및 종결 (Closure)', content: issue.status === 'CLOSED' ? '종결 완료 (' + new Date(issue.updatedAt).toLocaleDateString() + ')' : '진행 중' },
    ];

    return (
        <div className={styles.container}>
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--system-gray)' }}>
                <Link href="/">대시보드</Link>
                <ChevronRight size={14} />
                <span>이슈 상세 분석 (8D)</span>
            </nav>

            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <div className={styles.issueId}>ISS-{issue.id.toString().padStart(4, '0')}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                        {issue.productFamily && <span className={styles.badge} style={{ backgroundColor: 'var(--system-blue)', color: 'white' }}>{issue.productFamily}</span>}
                        {issue.productGroup && <span className={styles.badge} style={{ backgroundColor: 'var(--system-green)', color: 'white' }}>{issue.productGroup}</span>}
                        {issue.occurrenceSource && <span className={styles.badge} style={{ backgroundColor: 'var(--system-indigo)', color: 'white' }}>{issue.occurrenceSource}</span>}
                        {issue.mgmtItem && <span className={styles.badge} style={{ backgroundColor: 'var(--system-pink)', color: 'white' }}>{issue.mgmtItem}</span>}
                    </div>
                    <h1 className={styles.title}>{issue.title}</h1>
                    <div className={styles.metaInfo}>
                        <div className={styles.metaItem}><User size={16} /> {issue.reportedBy}</div>
                        <div className={styles.metaItem}><Calendar size={16} /> {new Date(issue.occurrenceDate).toLocaleDateString()}</div>
                        <div className={styles.metaItem}><MapPin size={16} /> {issue.programId} / {issue.lineId}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        {issue.occurrenceType && <span className={styles.badge} style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34C759' }}>{issue.occurrenceType}</span>}
                        {issue.m4Type && <span className={styles.badge} style={{ backgroundColor: 'rgba(175, 82, 222, 0.1)', color: '#AF52DE' }}>{issue.m4Type}</span>}
                        {issue.problemType1 && <span className={styles.badge} style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)', color: '#007AFF' }}>{issue.problemType1}</span>}
                        {issue.problemType2 && <span className={styles.badge} style={{ backgroundColor: 'rgba(255, 149, 0, 0.1)', color: '#FF9500' }}>{issue.problemType2}</span>}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className={`${styles.button} ${styles.secondaryButton}`} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Printer size={18} /> 인쇄
                    </button>
                    <button className={`${styles.button} ${styles.primaryButton}`} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <FileDown size={18} /> 8D 보고서 (PDF)
                    </button>
                </div>
            </header>

            <div className={styles.contentGrid}>
                <div className={styles.mainContent}>
                    {/* 8D Steps - Each step can be interactive */}
                    {steps.map((step) => (
                        <AnalysisStep
                            key={step.num}
                            num={step.num}
                            title={step.title}
                            initialContent={step.content as any}
                            issueId={issue.id}
                            fieldName={step.field}
                            inputType={step.type}
                        />
                    ))}
                </div>

                <aside className={styles.sideContent}>
                    <div className={styles.sideCard}>
                        <h2 className={styles.sideTitle}>이슈 상태 및 승인</h2>
                        <div className={`${styles.badge} ${styles[issue.status.toLowerCase()]}`} style={{ textAlign: 'center', fontSize: 16, padding: '12px', marginBottom: 20 }}>
                            {issue.status}
                        </div>

                        <ApprovalWidget issueId={issue.id} status={issue.status} />

                        <div style={{ marginTop: 24 }}>
                            <h3 className={styles.fieldLabel} style={{ marginBottom: 12 }}>상세 정보</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {issue.importance && (
                                    <div className={styles.field}>
                                        <span className={styles.fieldLabel}>중요도</span>
                                        <span className={styles.badge} style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)', color: '#007AFF', fontSize: 11 }}>{issue.importance}</span>
                                    </div>
                                )}
                                <div className={styles.field}>
                                    <span className={styles.fieldLabel}>심각도</span>
                                    <span className={`${styles.severity} ${styles['severity' + issue.severity]}`} style={{ width: 'fit-content', padding: '2px 8px' }}>
                                        {issue.severity}
                                    </span>
                                </div>
                                <div className={styles.field}>
                                    <span className={styles.fieldLabel}>부품번호</span>
                                    <span className={styles.fieldValue}>{issue.partNo || '-'}</span>
                                </div>
                                <div className={styles.field}>
                                    <span className={styles.fieldLabel}>공정</span>
                                    <span className={styles.fieldValue}>{issue.processId}</span>
                                </div>
                            </div>

                            <h3 className={styles.fieldLabel} style={{ marginBottom: 12, marginTop: 24 }}>추적 및 비용</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div className={styles.field}>
                                    <span className={styles.fieldLabel}>C/No.</span>
                                    <span className={styles.fieldValue}>{issue.cNo || '-'}</span>
                                </div>
                                <div className={styles.field}>
                                    <span className={styles.fieldLabel}>BODY No.</span>
                                    <span className={styles.fieldValue}>{issue.bodyNo || '-'}</span>
                                </div>
                                <div className={styles.field}>
                                    <span className={styles.fieldLabel}>발생수량</span>
                                    <span className={styles.fieldValue}>{issue.occurrenceQty ?? '-'} 개</span>
                                </div>
                                <div className={styles.field}>
                                    <span className={styles.fieldLabel}>클레임 비용</span>
                                    <span className={styles.fieldValue}>{issue.claimCost ? issue.claimCost.toLocaleString() + ' 원' : '-'}</span>
                                </div>
                            </div>
                        </div>

                        <FileUploadWidget issueId={issue.id} />

                        <div style={{ marginTop: 24, borderTop: '1px solid var(--system-gray5)', paddingTop: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <History size={18} />
                                <h3 className={styles.sideTitle} style={{ fontSize: 15, margin: 0 }}>히스토리</h3>
                            </div>
                            <div className={styles.timeline}>
                                {issue.history.map((h, idx) => (
                                    <div key={h.id} className={styles.timelineItem}>
                                        <div className={styles.timelineDot} style={{ backgroundColor: idx === 0 ? 'var(--system-blue)' : undefined }}></div>
                                        {idx < issue.history.length - 1 && <div className={styles.timelineLine}></div>}
                                        <div className={styles.timelineContent}>
                                            <span className={styles.timelineDate}>{new Date(h.createdAt).toLocaleString()}</span>
                                            <span className={styles.timelineText}>{h.comment}</span>
                                            <span style={{ fontSize: 11, color: 'var(--system-gray)' }}>by {h.actorId}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

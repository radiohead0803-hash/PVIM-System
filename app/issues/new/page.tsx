import { prisma } from '@/app/lib/prisma'
import styles from './page.module.css'
import { createIssue } from '@/app/lib/actions'

export default async function NewIssuePage() {
    const programs = await prisma.vehicleProgram.findMany()
    const parts = await prisma.part.findMany()

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>과거차 이슈 등록</h1>
                <p style={{ color: 'var(--system-gray)', marginTop: 4 }}>
                    새로운 품질 문제점을 시스템에 등록하고 추적을 시작합니다.
                </p>
            </header>

            <div className={styles.formCard}>
                <form action={createIssue}>
                    {/* 분류 섹션 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>1. 기본 정보</h2>
                        <div className={styles.grid}>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>이슈 제목</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    placeholder="예: 프론트 범퍼 도장 들뜸 현상"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>프로젝트(차종)</label>
                                <select name="programId" required className={styles.select}>
                                    <option value="">차종 선택</option>
                                    {programs.map(p => (
                                        <option key={p.id} value={p.id}>{p.id} ({p.projectName})</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>부품번호</label>
                                <select name="partNo" required className={styles.select}>
                                    <option value="">부품 선택</option>
                                    {parts.map(p => (
                                        <option key={p.partNo} value={p.partNo}>{p.partNo} - {p.partName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 발생 상세 섹션 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>2. 발생 상세</h2>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>심각도</label>
                                <select name="severity" required className={styles.select}>
                                    <option value="S">S (치명 - 안전/법규)</option>
                                    <option value="A">A (중대 - 기능정지)</option>
                                    <option value="B">B (일반 - 품질불만)</option>
                                    <option value="C" selected>C (경미 - 외관/단차)</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>발생 단계</label>
                                <select name="occurrenceStep" required className={styles.select}>
                                    <option value="개발">개발 (DV/PV)</option>
                                    <option value="시사출">시사출 (T0~Tn)</option>
                                    <option value="양산승인">양산승인 (ISIR)</option>
                                    <option value="양산" selected>양산</option>
                                    <option value="서비스">서비스 (현장클레임)</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>발생 라인</label>
                                <input name="lineId" type="text" placeholder="예: LINE-A" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>발생 공정</label>
                                <input name="processId" type="text" placeholder="예: 도장/사출/조립" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>발생일</label>
                                <input
                                    name="occurrenceDate"
                                    type="date"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    required
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>보고자</label>
                                <input name="reportedBy" type="text" defaultValue="관리자" required className={styles.input} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonBar}>
                        <button type="button" className={`${styles.button} ${styles.buttonSecondary}`}>취소</button>
                        <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>이슈 등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

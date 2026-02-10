import { prisma } from '@/app/lib/prisma'
import styles from './page.module.css'
import { createIssue } from '@/app/lib/actions'
import Link from 'next/link'

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
                        <h2 className={styles.sectionTitle}>1. 기본 및 제품 정보</h2>
                        <div className={styles.grid}>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>이슈 제목</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    placeholder="예: QL 사이드브라켓 후크부 날카로움으로 범퍼 탈거시 전수 뜯김 발생"
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
                                <label className={styles.label}>제품군</label>
                                <input name="productFamily" type="text" placeholder="예: BUMPER" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>제품그룹</label>
                                <input name="productGroup" type="text" placeholder="예: RR" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>부품번호</label>
                                <select name="partNo" className={styles.select}>
                                    <option value="">부품 선택 (선택사항)</option>
                                    {parts.map(p => (
                                        <option key={p.partNo} value={p.partNo}>{p.partNo} - {p.partName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>관리항목</label>
                                <input name="mgmtItem" type="text" defaultValue="과거차" className={styles.input} />
                            </div>
                        </div>
                    </div>

                    {/* 발생 상세 섹션 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>2. 발생 및 유형 정보</h2>
                        <div className={styles.grid}>
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
                                <label className={styles.label}>발생 단계</label>
                                <select name="occurrenceStep" required className={styles.select}>
                                    <option value="양산" selected>양산</option>
                                    <option value="개발">개발 (DV/PV)</option>
                                    <option value="시사출">시사출 (T0~Tn)</option>
                                    <option value="양산승인">양산승인 (ISIR)</option>
                                    <option value="서비스">서비스 (현장클레임)</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>원인공정</label>
                                <input name="processId" type="text" placeholder="예: 조립(사내)" required className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>발생처</label>
                                <input name="occurrenceSource" type="text" placeholder="예: (주)캠스" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>발생유형</label>
                                <select name="occurrenceType" className={styles.select}>
                                    <option value="신규" selected>신규</option>
                                    <option value="재발">재발</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>4M유형</label>
                                <select name="m4Type" className={styles.select}>
                                    <option value="제품" selected>제품</option>
                                    <option value="공정">공정</option>
                                    <option value="사람">사람</option>
                                    <option value="설비">설비</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 문제분류 섹션 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>3. 문제 분류 및 중요도</h2>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>문제점유형(1단계)</label>
                                <input name="problemType1" type="text" placeholder="예: 내구성" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>문제점유형(2단계)</label>
                                <input name="problemType2" type="text" placeholder="예: 강성" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>중요도</label>
                                <input name="importance" type="text" placeholder="예: B(소음/외관관련문제점)" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>심각도</label>
                                <select name="severity" required className={styles.select}>
                                    <option value="S">S (치명 - 안전/법규)</option>
                                    <option value="A">A (중대 - 기능정지)</option>
                                    <option value="B">B (일반 - 품질불만)</option>
                                    <option value="C" selected>C (경미 - 외관/단차)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 추적 정보 섹션 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>4. 관리 및 추적 정보</h2>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>C/No.</label>
                                <input name="cNo" type="text" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>BODY No.</label>
                                <input name="bodyNo" type="text" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>발생수량</label>
                                <input name="occurrenceQty" type="number" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>클레임 비용</label>
                                <input name="claimCost" type="number" className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>보고자</label>
                                <input name="reportedBy" type="text" defaultValue="이승록" required className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>발생 라인</label>
                                <input name="lineId" type="text" placeholder="예: LINE-A" className={styles.input} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonBar}>
                        <Link href="/" className={`${styles.button} ${styles.buttonSecondary}`} style={{ textDecoration: 'none' }}>취소</Link>
                        <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>이슈 등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

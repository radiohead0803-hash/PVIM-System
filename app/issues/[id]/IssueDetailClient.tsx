'use client'

import { useState } from 'react'
import { updateIssueAnalysis, approveIssue } from '@/app/lib/actions'
import styles from './page.module.css'
import {
    Edit3,
    Check,
    X,
    UserCheck,
    FileUp,
    Paperclip,
    Trash2
} from 'lucide-react'

export function AnalysisStep({
    num,
    title,
    initialContent,
    issueId,
    fieldName
}: {
    num: string,
    title: string,
    initialContent: string,
    issueId: number,
    fieldName?: string
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(initialContent)
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        if (!fieldName) return
        setIsLoading(true)
        try {
            await updateIssueAnalysis(issueId, { [fieldName]: content })
            setIsEditing(false)
        } catch (error) {
            alert('저장에 실패했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                    <div className={styles.stepNumber}>{num}</div>
                    <h2 className={styles.stepTitle}>{title}</h2>
                </div>
                {fieldName && !isEditing && (
                    <button className={styles.iconButton} onClick={() => setIsEditing(true)}>
                        <Edit3 size={16} /> 수정
                    </button>
                )}
            </div>
            <div className={styles.stepBody}>
                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <textarea
                            className={styles.textarea}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                        />
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button
                                className={`${styles.button} ${styles.secondaryButton}`}
                                onClick={() => { setContent(initialContent); setIsEditing(false); }}
                                disabled={isLoading}
                            >
                                <X size={16} /> 취소
                            </button>
                            <button
                                className={`${styles.button} ${styles.primaryButton}`}
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                <Check size={16} /> {isLoading ? '저장 중...' : '저장'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.fieldValue}>{initialContent || '데이터가 없습니다.'}</div>
                )}
            </div>
        </div>
    )
}

export function ApprovalWidget({ issueId, status }: { issueId: number, status: string }) {
    const [showModal, setShowModal] = useState(false)
    const [comment, setComment] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    if (status === 'CLOSED') return null

    const handleApprove = async () => {
        setIsLoading(true)
        try {
            await approveIssue(issueId, comment)
            setShowModal(false)
        } catch (error) {
            alert('승인 처리에 실패했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                className={`${styles.button} ${styles.primaryButton}`}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8 }}
                onClick={() => setShowModal(true)}
            >
                <UserCheck size={18} /> 최종 승인 (전자서명)
            </button>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.sideTitle}>이슈 종결 및 최종 승인</h3>
                        <p style={{ fontSize: 13, color: 'var(--system-gray)', marginBottom: 16 }}>
                            승인 시 해당 이슈는 CLOSED 상태로 변경되며, 전자서명이 기록됩니다.
                        </p>
                        <textarea
                            className={styles.textarea}
                            placeholder="심사 의견을 입력하세요..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            style={{ marginBottom: 20 }}
                        />
                        <div className={styles.signaturePad}>
                            <div style={{ fontSize: 11, color: 'var(--system-gray)', marginBottom: 8 }}>전자서명 (Digital Signature Hash)</div>
                            <div style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--system-gray6)', padding: 10, borderRadius: 8 }}>
                                SHA-256: {Math.random().toString(16).slice(2)}...
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button
                                className={`${styles.button} ${styles.secondaryButton}`}
                                style={{ flex: 1 }}
                                onClick={() => setShowModal(false)}
                            >
                                취소
                            </button>
                            <button
                                className={`${styles.button} ${styles.primaryButton}`}
                                style={{ flex: 1 }}
                                onClick={handleApprove}
                                disabled={isLoading}
                            >
                                {isLoading ? '처리 중...' : '승인 및 날인'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export function FileUploadWidget({ issueId }: { issueId: number }) {
    return (
        <div className={styles.sideSection}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Paperclip size={18} />
                <h3 className={styles.sideTitle} style={{ fontSize: 15, margin: 0 }}>첨부 파일</h3>
            </div>
            <div className={styles.fileList}>
                <div style={{ fontSize: 13, color: 'var(--system-gray)', textAlign: 'center', padding: '12px 0', border: '1px dashed var(--system-gray4)', borderRadius: 10 }}>
                    등록된 파일이 없습니다.
                </div>
            </div>
            <label className={styles.uploadButton}>
                <input type="file" style={{ display: 'none' }} />
                <FileUp size={16} /> 파일 업로드
            </label>
        </div>
    )
}

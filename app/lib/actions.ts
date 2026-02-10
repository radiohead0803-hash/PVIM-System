'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createIssue(formData: FormData) {
    const title = formData.get('title') as string
    const programId = formData.get('programId') as string
    const partNo = formData.get('partNo') as string
    const lineId = formData.get('lineId') as string
    const processId = formData.get('processId') as string
    const severity = formData.get('severity') as string
    const occurrenceStep = formData.get('occurrenceStep') as string
    const reportedBy = formData.get('reportedBy') as string
    const occurrenceDate = new Date(formData.get('occurrenceDate') as string)

    try {
        const issue = await prisma.issue.create({
            data: {
                title,
                programId,
                partNo,
                lineId,
                processId,
                severity,
                occurrenceStep,
                reportedBy,
                occurrenceDate,
                status: 'DRAFT',
            },
        })

        // Also create initial history
        await prisma.issueStatusHistory.create({
            data: {
                issueId: issue.id,
                toStatus: 'DRAFT',
                comment: '이슈 최초 등록',
                actorId: reportedBy,
            }
        })

    } catch (error) {
        console.error('Failed to create issue:', error)
        // In a real app, you might want a more sophisticated error handling
        throw new Error('이슈 등록에 실패했습니다.')
    }

    revalidatePath('/')
    redirect('/')
}

export async function updateIssueAnalysis(issueId: number, data: any) {
    try {
        await prisma.issueAnalysis.upsert({
            where: { issueId },
            update: data,
            create: {
                issueId,
                ...data
            },
        })

        await prisma.issueStatusHistory.create({
            data: {
                issueId,
                toStatus: 'ANALYSIS',
                comment: '8D 분석 내용 수정됨',
                actorId: '관리자',
            }
        })

        revalidatePath(`/issues/${issueId}`)
    } catch (error) {
        console.error('Failed to update analysis:', error)
        throw new Error('분석 내용 수정에 실패했습니다.')
    }
}

export async function approveIssue(issueId: number, comment: string) {
    try {
        const issue = await prisma.issue.update({
            where: { id: issueId },
            data: { status: 'CLOSED' }
        })

        await prisma.issueStatusHistory.create({
            data: {
                issueId,
                toStatus: 'CLOSED',
                comment: comment || '최종 승인 완료',
                actorId: '상위관리자',
            }
        })

        revalidatePath(`/issues/${issueId}`)
        revalidatePath('/')
    } catch (error) {
        console.error('Failed to approve issue:', error)
        throw new Error('승인 처리에 실패했습니다.')
    }
}

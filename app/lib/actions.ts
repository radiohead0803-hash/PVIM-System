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

    // New Fields
    const productFamily = formData.get('productFamily') as string
    const productGroup = formData.get('productGroup') as string
    const occurrenceSource = formData.get('occurrenceSource') as string
    const occurrenceType = formData.get('occurrenceType') as string
    const m4Type = formData.get('m4Type') as string
    const problemType1 = formData.get('problemType1') as string
    const problemType2 = formData.get('problemType2') as string
    const importance = formData.get('importance') as string
    const cNo = formData.get('cNo') as string
    const bodyNo = formData.get('bodyNo') as string
    const mgmtItem = formData.get('mgmtItem') as string

    const occurrenceQtyStr = formData.get('occurrenceQty') as string
    const occurrenceQty = occurrenceQtyStr ? parseInt(occurrenceQtyStr) : null

    const claimCostStr = formData.get('claimCost') as string
    const claimCost = claimCostStr ? parseInt(claimCostStr) : null

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
                productFamily,
                productGroup,
                occurrenceSource,
                occurrenceType,
                m4Type,
                problemType1,
                problemType2,
                importance,
                cNo,
                bodyNo,
                occurrenceQty,
                claimCost,
                mgmtItem,
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

        revalidatePath('/')
        redirect(`/issues/${issue.id}`)

    } catch (error) {
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error;
        console.error('Failed to create issue:', error)
        throw new Error('이슈 등록에 실패했습니다.')
    }
}

export async function updateIssueAnalysis(issueId: number, data: any) {
    try {
        // 특정 필드 타입 변환 (예: boolean)
        if (data.horizontalDeploymentNeeded !== undefined) {
            data.horizontalDeploymentNeeded = data.horizontalDeploymentNeeded === 'true' || data.horizontalDeploymentNeeded === true;
        }

        // 날짜 필드 변환
        if (data.improvementRefDate) {
            data.improvementRefDate = new Date(data.improvementRefDate);
        }
        if (data.verifiedAt) {
            data.verifiedAt = new Date(data.verifiedAt);
        }

        await prisma.issueAnalysis.upsert({
            where: { issueId },
            update: data,
            create: {
                issueId,
                ...data
            },
        })

        // 상태를 ANALYSIS로 업데이트 (DRAFT인 경우)
        const issue = await prisma.issue.findUnique({ where: { id: issueId } });
        if (issue && issue.status === 'DRAFT') {
            await prisma.issue.update({
                where: { id: issueId },
                data: { status: 'ANALYSIS' }
            });
        }

        await prisma.issueStatusHistory.create({
            data: {
                issueId,
                toStatus: 'ANALYSIS',
                comment: '8D 분석내용 업데이트',
                actorId: '정품질(관리자)',
            }
        })

        revalidatePath(`/issues/${issueId}`)
        revalidatePath('/')
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

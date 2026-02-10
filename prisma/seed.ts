import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Start seeding...')

    // 1. Vehicle Programs
    await prisma.vehicleProgram.upsert({
        where: { id: 'MQ4' },
        update: {},
        create: {
            id: 'MQ4',
            projectName: 'Sorento',
            segment: 'SUV',
            sopDate: new Date('2020-03-01'),
        },
    })
    await prisma.vehicleProgram.upsert({
        where: { id: 'SX2' },
        update: {},
        create: {
            id: 'SX2',
            projectName: 'Kona',
            segment: 'SUV',
            sopDate: new Date('2023-01-01'),
        },
    })
    await prisma.vehicleProgram.upsert({
        where: { id: 'EV6' },
        update: {},
        create: {
            id: 'EV6',
            projectName: 'EV6',
            segment: 'EV',
            sopDate: new Date('2021-08-01'),
        },
    })

    // 2. Parts
    await prisma.part.upsert({
        where: { partNo: '82110-D1000' },
        update: {},
        create: {
            partNo: '82110-D1000',
            partName: 'Front Bumper Assembly',
            category: 'Exterior',
            supplierId: 'SUP-001',
        },
    })
    await prisma.part.upsert({
        where: { partNo: '84710-P2000' },
        update: {},
        create: {
            partNo: '84710-P2000',
            partName: 'Cluster Bezel',
            category: 'Interior',
            supplierId: 'SUP-002',
        },
    })

    // 3. Issues
    await prisma.issue.deleteMany({})
    await prisma.issueStatusHistory.deleteMany({})
    await prisma.issueAnalysis.deleteMany({})

    const issuesData = [
        {
            title: '프론트 범퍼 도장 들뜸 현상',
            programId: 'MQ4',
            partNo: '82110-D1000',
            lineId: 'LINE-A',
            processId: 'PAINT',
            severity: 'S',
            status: 'ANALYSIS',
            occurrenceStep: 'Mass Production',
            reportedBy: 'K. Kim',
            occurrenceDate: new Date('2024-02-10'),
        },
        {
            title: '클러스터 베젤 조립 유격',
            programId: 'EV6',
            partNo: '84710-P2000',
            lineId: 'LINE-B',
            processId: 'ASSEMBLY',
            severity: 'C',
            status: 'CLOSED',
            occurrenceStep: 'Mass Production',
            reportedBy: 'S. Lee',
            occurrenceDate: new Date('2024-02-05'),
        },
        {
            title: '도어 트림 가죽 들뜸',
            programId: 'MQ4',
            partNo: '84710-P2000',
            lineId: 'LINE-C',
            processId: 'ASSEMBLY',
            severity: 'B',
            status: 'DRAFT',
            occurrenceStep: 'Development',
            reportedBy: 'J. Park',
            occurrenceDate: new Date('2024-02-09'),
        },
        {
            title: '헤드램프 습기 유입',
            programId: 'EV6',
            partNo: '82110-D1000',
            lineId: 'LINE-A',
            processId: 'INSPECTION',
            severity: 'A',
            status: 'ANALYSIS',
            occurrenceStep: 'Mass Production',
            reportedBy: 'M. Choi',
            occurrenceDate: new Date('2024-01-25'),
        }
    ];

    for (const data of issuesData) {
        const issue = await prisma.issue.create({ data });

        // Initial History
        await prisma.issueStatusHistory.create({
            data: {
                issueId: issue.id,
                toStatus: 'DRAFT',
                comment: '이슈 최초 등록',
                actorId: data.reportedBy,
                createdAt: data.occurrenceDate
            }
        });

        if (issue.status !== 'DRAFT') {
            await prisma.issueStatusHistory.create({
                data: {
                    issueId: issue.id,
                    fromStatus: 'DRAFT',
                    toStatus: issue.status,
                    comment: '상태 변경: ' + issue.status,
                    actorId: 'System',
                    createdAt: new Date(data.occurrenceDate.getTime() + 1000 * 60 * 60 * 24) // +1 day
                }
            });
        }

        if (issue.status === 'ANALYSIS') {
            await prisma.issueAnalysis.create({
                data: {
                    issueId: issue.id,
                    symptomDetail: '초기 증상 분석 완료',
                    rootCauseDetail: '공정 산포 관리 미흡',
                    horizontalDeploymentNeeded: true
                }
            });
        }
    }

    console.log('✅ Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

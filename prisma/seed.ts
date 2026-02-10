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
    // Clean up existing issues to avoid duplicates if re-seeded
    await prisma.issue.deleteMany({})

    await prisma.issue.create({
        data: {
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
    })

    await prisma.issue.create({
        data: {
            title: '클러스터 베젤 조립 유격',
            programId: 'EV6',
            partNo: '84710-P2000',
            lineId: 'LINE-B',
            processId: 'ASSEMBLY',
            severity: 'C',
            status: 'CLOSED',
            occurrenceStep: 'Mass Production',
            reportedBy: 'S. Lee',
            occurrenceDate: new Date('2024-02-08'),
        }
    })

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

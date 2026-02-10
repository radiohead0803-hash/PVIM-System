'use client'

import * as XLSX from 'xlsx';
import { FileDown } from 'lucide-react';
import styles from '../page.module.css';

interface ExportButtonProps {
    data: any[];
}

export default function ExportButton({ data }: ExportButtonProps) {
    const handleExport = () => {
        // 엑셀에 맞게 데이터 가공
        const exportData = data.map(issue => ({
            '이슈 번호': `ISS-${issue.id.toString().padStart(4, '0')}`,
            '제목': issue.title,
            '차종': issue.programId,
            '부품번호': issue.partNo,
            '심각도': issue.severity,
            '상태': issue.status,
            '발생단계': issue.occurrenceStep,
            '발행일': new Date(issue.occurrenceDate).toLocaleDateString('ko-KR'),
            '보고자': issue.reportedBy
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Issues");

        // 컬럼 너비 조정
        const wscols = [
            { wch: 12 }, { wch: 40 }, { wch: 10 }, { wch: 15 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 12 }
        ];
        worksheet['!cols'] = wscols;

        XLSX.writeFile(workbook, `PVIM_이슈리스트_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <button
            onClick={handleExport}
            className={styles.secondaryButton}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
            <FileDown size={18} /> 보고서 내보내기 (Excel)
        </button>
    );
}

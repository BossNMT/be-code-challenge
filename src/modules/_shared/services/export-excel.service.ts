// excel.service.ts

import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ExcelService {
  async exportToExcel(data: any[], filename: string): Promise<string> {
    const exportDirectory = path.join(__dirname, '..', 'exports');

    // Tạo thư mục nếu nó không tồn tại
    if (!fs.existsSync(exportDirectory)) {
      fs.mkdirSync(exportDirectory);
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Thêm dữ liệu vào sheet
    data.forEach(row => {
      worksheet.addRow(row);
    });

    // Lưu workbook vào file Excel
    const filePath = path.join(exportDirectory, 'List-User.xlsx');
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }

  async deleteFile(filePath: string): Promise<void> {
    await fs.promises.unlink(filePath);
  }
}

import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateReportDto} from './dto/create-report.dto';
import {UpdateReportDto} from './dto/update-report.dto';
import * as xlsx from 'excel4node'
import {Request, Response} from "express";
import {User} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import * as fs from "fs";
import * as ExcelJS from 'exceljs';
import {FileInterceptor} from '@nestjs/platform-express';
import {createReadStream} from 'fs';
import * as path from "path";

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) {
    }

    async create(dto: CreateReportDto, res: Response, user: User) {
        console.log(dto.fields);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Активности');
        const titles = ["Активность", "Уделенные часы", "Дата"]

        worksheet.addRow(titles, "width: 100%");
        dto.fields.forEach((row) => {
            console.log(row);
            worksheet.addRow(Object.values(row))
        });

        worksheet.columns.forEach((column) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const columnLength = cell.value ? cell.value.toString().length : 0;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength;
        });

        const fileName = `./uploads/reports/${dto.file_name}`;

        const result = await workbook.xlsx.writeFile(fileName);
        console.log(result);
        await this.prisma.report.create({
            data: {
                user_id: user?.id,
                file_name: dto.file_name,
                file_url: `http://localhost:3000/uploads/reports/${dto.file_name}`,
                file_size: '34mb'
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        first_name: true,
                        second_name: true,
                        email: true,
                        role: true,
                    }
                }
            }
        })
        console.log(user?.first_name)
        return 'This action adds a new report';
    }

    findAll(req: Request) {
        var wb = new xlsx.Workbook({
            jszip: {
                compression: 'DEFLATE',
            },
        });

// Add Worksheets to the workbook
        var ws = wb.addWorksheet('Sheet 1');
        var ws2 = wb.addWorksheet('Sheet 2');

// Create a reusable style
        var style = wb.createStyle({
            font: {
                color: '#FF0800',
                size: 12,
            },
        });

// Set value of cell A1 to 100 as a number type styled with paramaters of style
        ws.cell(1, 1)
            .number(100)
            .style(style);

// Set value of cell B1 to 200 as a number type styled with paramaters of style
        ws.cell(1, 2)
            .number(200)
            .style(style);

// Set value of cell C1 to a formula styled with paramaters of style
        ws.cell(1, 3)
            .formula('A1 + B1')
            .style(style);

// Set value of cell A2 to 'string' styled with paramaters of style
        ws.cell(2, 1)
            .string('string')
            .style(style);

// Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
        ws.cell(3, 1)
            .bool(true)
            .style(style)
            .style({font: {size: 14}});

        wb.write('./uploads/reports/Excel.xlsx');
        console.log(req.user)
        return `This action returns all reports`;
    }

    findOne(id: number) {
        return `This action returns a #${id} report`;
    }

    update(id: number, updateReportDto: UpdateReportDto) {
        return `This action updates a #${id} report`;
    }

    async remove(id: string, res: Response, req: User) {
        try {
            const report = await this.prisma.report.findFirst({
                where: {
                    id
                },
            })
            if (report) {
                if (req.id === report.user_id) {
                    await this.prisma.report.delete({
                        where: {
                            id: report.id
                        }
                    })
                    await fs.unlink(`./uploads/reports/${report.file_name}`, err => {
                        console.log(err);
                    })
                    return res.status(200).json({
                        statusCode: 200,
                        message: "Отчёт успешно удален"
                    })
                }
                return res.status(403).json({
                    statusCode: 403,
                    message: "Отказано в доступе"
                })
            }
            return res.status(404).json({
                statusCode: 404,
                message: "Произошла ошибка при удалении отчёта"
            })
        } catch (e) {
            console.log(e);
            throw new HttpException("Внутренняя ошибка сервера", HttpStatus.BAD_GATEWAY)
        }
    }
}

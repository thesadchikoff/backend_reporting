import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req, UseGuards
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { UpdateReportDto } from './dto/update-report.dto';
import {CreateReportDto} from "./dto/create-report.dto";
import {Response} from "express";
import {JwtAuthGuard} from "../guards/jwt.guard";
import {User} from "@prisma/client";
import {AuthGuard} from "@nestjs/passport";

type RequestWithUser = Request & { user: User };
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  uploadReport(@Body() dto: CreateReportDto, @Res({passthrough: true}) res: Response, @Req() req: RequestWithUser) {
    return this.reportsService.create(dto, res, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.reportsService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response, @Req() req: RequestWithUser) {
    return this.reportsService.remove(id, res, req.user);
  }
}

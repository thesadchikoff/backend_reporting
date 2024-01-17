interface Fields {
    date_for_excel: string,
    busy_time_for_excel: string,
    description: string
}

export class CreateReportDto {
    file_name: string
    fields: Fields[]
}

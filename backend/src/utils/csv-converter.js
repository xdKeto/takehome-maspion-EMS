const cleanData = (data) => {
  if (data === null || data === undefined) return ""

  const text = data instanceof Date ? data.toISOString().slice(0, 10) : String(data)

  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`

  return text
}

function convertToCSV(rows) {
  const columns = [
    { header: "ID", getValue: (row) => row.id },
    { header: "Nama", getValue: (row) => row.nama },
    { header: "Email", getValue: (row) => row.email },
    { header: "No. Telepon", getValue: (row) => row.no_telp },
    { header: "Jabatan", getValue: (row) => row.jabatan },
    { header: "Status", getValue: (row) => row.status },
    { header: "Tanggal Masuk", getValue: (row) => row.tanggal_masuk },
    { header: "Department ID", getValue: (row) => row.department_id },
    {
      header: "Department",
      getValue: (row) => row.department?.nama
    }
  ]
  
  const headers = columns.map(({ header }) => cleanData(header)).join(",")

  const body = rows.map((row) => {
    return columns.map(({ getValue }) => cleanData(getValue(row))).join(",")
  })

  const csvData = [headers, ...body].join("\r\n")

  return csvData
}

export { convertToCSV, cleanData }

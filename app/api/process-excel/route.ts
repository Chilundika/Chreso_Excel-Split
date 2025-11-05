import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: "array" })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][]

    if (data.length === 0) {
      return NextResponse.json({ error: "Excel file is empty" }, { status: 400 })
    }

    const headers = data[0] as string[]
    const studentColIndex = headers.findIndex((h) => h?.toString().toLowerCase() === "student")
    if (studentColIndex === -1) {
      return NextResponse.json({ error: 'No "Student" column found' }, { status: 400 })
    }

    const processed = data.map((row, idx) => {
      if (idx === 0) {
        const newRow = [...row]
        newRow.splice(studentColIndex, 1, "Name", "Student Number")
        return newRow
      }
      const original = row[studentColIndex] as string | undefined
      if (original && typeof original === "string") {
        // Preferred regex from spec extracting name before '(' and number inside '()'
        const nameMatch = original.match(/^(.*?)\s*\(/)
        const numberMatch = original.match(/\((.*?)\)/)
        const name = nameMatch?.[1]?.trim()
        const num = numberMatch?.[1]?.trim()

        if (name || num) {
          const newRow = [...row]
          newRow.splice(studentColIndex, 1, name ?? "", num ?? "")
          return newRow
        }
        // Fallback: try "John Doe 12345"
        const fallback = original.match(/^(.+?)\s+(\d+)$/)
        if (fallback) {
          const [, n, sn] = fallback
          const newRow = [...row]
          newRow.splice(studentColIndex, 1, n.trim(), sn)
          return newRow
        }
      }
      return row
    })

    const outSheet = XLSX.utils.aoa_to_sheet(processed)
    const outWb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(outWb, outSheet, "Processed Data")

    const out = XLSX.write(outWb, { type: "array", bookType: "xlsx" }) as ArrayBuffer

    return new NextResponse(Buffer.from(out), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="processed_cleaned.xlsx"`,
      },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to process file"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}



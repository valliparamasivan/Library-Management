"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { useBulkImportBooks } from "@/store/hooks/InventoryHooks";
import { downloadBulkImportTemplate } from "@/store/services/InventoryServices";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, Trash2, Plus, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";

const COLUMNS = [
  { key: "title", label: "Title", required: true },
  { key: "author", label: "Author", required: true },
  { key: "isbn", label: "ISBN", required: true },
  { key: "subject", label: "Subject", required: true },
  { key: "publisher", label: "Publisher", required: true },
  { key: "year", label: "Year", required: true },
  { key: "language", label: "Language", required: true, type: "select" },
  { key: "bookCategory", label: "Book Category", required: true, type: "select" },
  { key: "bookType", label: "Book Type", required: true, type: "select" },
  { key: "quantity", label: "Qty", required: false, type: "number" },
  { key: "description", label: "Description", required: false },
];

const HEADER_MAP = {
  title: "title",
  author: "author",
  isbn: "isbn",
  subject: "subject",
  publisher: "publisher",
  year: "year",
  language: "language",
  "book category": "bookCategory",
  bookcategory: "bookCategory",
  category: "bookCategory",
  "book type": "bookType",
  booktype: "bookType",
  type: "bookType",
  quantity: "quantity",
  qty: "quantity",
  description: "description",
};

const createEmptyRow = () => ({
  title: "",
  author: "",
  isbn: "",
  subject: "",
  publisher: "",
  year: "",
  language: "",
  bookCategory: "",
  bookType: "",
  quantity: "1",
  description: "",
});

// Validate a single row, returns { field: "error message" } or empty object
const validateRow = (row, allRows, rowIndex) => {
  const errors = {};

  if (!row.title?.trim()) errors.title = "Title is required";
  if (!row.author?.trim()) errors.author = "Author is required";

  if (!row.isbn?.trim()) {
    errors.isbn = "ISBN is required";
  } else if (!/^\d{13}$/.test(row.isbn.trim())) {
    errors.isbn = "Must be 13 digits";
  } else {
    const duplicate = allRows.findIndex((r, i) => i !== rowIndex && r.isbn?.trim() === row.isbn.trim());
    if (duplicate !== -1) errors.isbn = `Duplicate with row ${duplicate + 1}`;
  }

  if (!row.subject?.trim()) errors.subject = "Subject is required";
  if (!row.publisher?.trim()) errors.publisher = "Publisher is required";

  if (!row.year?.trim()) {
    errors.year = "Year is required";
  } else {
    const y = parseInt(row.year, 10);
    if (isNaN(y)) errors.year = "Invalid year";
    else if (y > new Date().getFullYear()) errors.year = "Future year";
  }

  if (!row.language?.trim()) errors.language = "Language is required";
  if (!row.bookCategory?.trim()) errors.bookCategory = "Category is required";
  if (!row.bookType?.trim()) errors.bookType = "Book Type is required";

  if (row.quantity) {
    const q = parseInt(row.quantity, 10);
    if (isNaN(q) || q <= 0) errors.quantity = "Must be > 0";
  }

  if (row.description && row.description.length > 1000) errors.description = "Max 1000 chars";

  return errors;
};

const BulkImportDialog = ({ isOpen, onOpenChange, languages, bookCategories, bookTypes }) => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowErrors, setRowErrors] = useState({}); // { rowIndex: { field: "msg" } }
  const [importResult, setImportResult] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { mutateAsync: bulkImport } = useBulkImportBooks();
  const { showSuccessToast, showErrorToast } = useErrorHandler();

  const languageOptions = languages?.data?.map((item) => item.language) || [];
  const categoryOptions = bookCategories?.data?.map((item) => ({ id: item.bookCategoryId, name: item.category })) || [];
  const typeOptions = bookTypes?.data?.map((item) => ({ id: item.bookTypeId, name: item.type })) || [];

  const errorCount = Object.values(rowErrors).reduce((sum, errs) => sum + Object.keys(errs).length, 0);
  const errorRowCount = Object.values(rowErrors).filter((errs) => Object.keys(errs).length > 0).length;

  const parseFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (jsonData.length === 0) {
          showErrorToast("The file is empty or has no data rows");
          return;
        }

        const parsed = jsonData.map((row) => {
          const mapped = createEmptyRow();
          Object.entries(row).forEach(([header, value]) => {
            const normalizedHeader = header.toLowerCase().trim();
            const fieldKey = HEADER_MAP[normalizedHeader];
            if (fieldKey) {
              mapped[fieldKey] = String(value).trim();
            }
          });
          if (!mapped.quantity || mapped.quantity === "0") mapped.quantity = "1";
          return mapped;
        });

        setRows(parsed);
        setFileName(file.name);
        setImportResult(null);
        setRowErrors({});
      } catch {
        showErrorToast("Failed to parse the Excel file");
      }
    };
    reader.readAsArrayBuffer(file);
  }, [showErrorToast]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const name = file.name.toLowerCase();
      if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
        showErrorToast("Only Excel files (.xlsx, .xls) are supported");
        return;
      }
      parseFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const name = file.name.toLowerCase();
      if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
        showErrorToast("Only Excel files (.xlsx, .xls) are supported");
        return;
      }
      parseFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);
      const blob = await downloadBulkImportTemplate();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "bulk_import_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      showErrorToast("Failed to download template");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCellChange = (rowIndex, key, value) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [key]: value };
      return updated;
    });
    // Clear the error for this specific cell when the user edits it
    setRowErrors((prev) => {
      const rowErr = prev[rowIndex];
      if (!rowErr || !rowErr[key]) return prev;
      const { [key]: _, ...rest } = rowErr;
      const updated = { ...prev };
      if (Object.keys(rest).length === 0) {
        delete updated[rowIndex];
      } else {
        updated[rowIndex] = rest;
      }
      return updated;
    });
  };

  const handleDeleteRow = (rowIndex) => {
    setRows((prev) => prev.filter((_, i) => i !== rowIndex));
    // Re-index errors after deletion
    setRowErrors((prev) => {
      const updated = {};
      Object.entries(prev).forEach(([idx, errs]) => {
        const i = Number(idx);
        if (i < rowIndex) updated[i] = errs;
        else if (i > rowIndex) updated[i - 1] = errs;
        // skip the deleted row
      });
      return updated;
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const runValidation = (currentRows) => {
    const errors = {};
    let hasErrors = false;
    currentRows.forEach((row, i) => {
      const rowErr = validateRow(row, currentRows, i);
      if (Object.keys(rowErr).length > 0) {
        errors[i] = rowErr;
        hasErrors = true;
      }
    });
    setRowErrors(errors);
    return !hasErrors;
  };

  const handleImport = async () => {
    if (rows.length === 0) return;

    // Client-side validation first
    if (!runValidation(rows)) {
      showErrorToast("Please fix the errors highlighted in red before importing");
      return;
    }

    try {
      setIsImporting(true);

      const exportData = rows.map((row) => ({
        Title: row.title,
        Author: row.author,
        ISBN: row.isbn,
        Subject: row.subject,
        Publisher: row.publisher,
        Year: row.year,
        Language: row.language,
        "Book Category": row.bookCategory,
        "Book Type": row.bookType,
        Quantity: row.quantity ? Number(row.quantity) : 1,
        Description: row.description,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Books");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const file = new File([blob], "bulk_import.xlsx", { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);

      const response = await bulkImport(formData);
      const result = response.data;

      // Map server-side errors back onto the rows
      if (result?.failedCount > 0 && result.results) {
        const serverErrors = {};
        result.results.forEach((r) => {
          if (!r.success) {
            // r.row is 1-based (header=row1, so data row 1 = row 2 in the sheet),
            // but the backend returns row relative to data: row 2 = first data row.
            // Our rows array is 0-indexed. Backend row is (excelRow), data starts at row 2.
            const rowIndex = r.row - 2;
            if (rowIndex >= 0 && rowIndex < rows.length) {
              serverErrors[rowIndex] = { _server: r.message };
            }
          }
        });
        setRowErrors(serverErrors);
      }

      setImportResult(result);

      if (result?.failedCount === 0) {
        showSuccessToast(response.message);
      }

      router.refresh();
    } catch (error) {
      const message = error?.data?.message || error?.message || "Import failed";
      showErrorToast(message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setFileName(null);
    setRows([]);
    setRowErrors({});
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onOpenChange(false);
  };

  const handleReset = () => {
    setFileName(null);
    setRows([]);
    setRowErrors({});
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasRows = rows.length > 0;
  const showUpload = !hasRows && !importResult;
  const showEditTable = hasRows && !importResult;
  const showResults = !!importResult;

  const getCellErrorClass = (rowIndex, key) => {
    const errs = rowErrors[rowIndex];
    if (!errs || !errs[key]) return "border-gray-200";
    return "border-red-400 bg-red-50/40";
  };

  const getCellError = (rowIndex, key) => {
    return rowErrors[rowIndex]?.[key] || null;
  };

  const getRowServerError = (rowIndex) => {
    return rowErrors[rowIndex]?._server || null;
  };

  const renderCell = (row, rowIndex, col) => {
    const errorClass = getCellErrorClass(rowIndex, col.key);
    const error = getCellError(rowIndex, col.key);

    const inputWrapper = (input) => (
      <div className="relative">
        {input}
        {error && (
          <p className="text-[10px] leading-tight text-red-500 mt-0.5 px-0.5">{error}</p>
        )}
      </div>
    );

    if (col.type === "select" && col.key === "language") {
      return inputWrapper(
        <select
          value={row[col.key]}
          onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
          className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:border-[#00796B] bg-white ${errorClass}`}
        >
          <option value="">Select</option>
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      );
    }

    if (col.type === "select" && col.key === "bookCategory") {
      return inputWrapper(
        <select
          value={row[col.key]}
          onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
          className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:border-[#00796B] bg-white ${errorClass}`}
        >
          <option value="">Select</option>
          {categoryOptions.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      );
    }

    if (col.type === "select" && col.key === "bookType") {
      return inputWrapper(
        <select
          value={row[col.key]}
          onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
          className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:border-[#00796B] bg-white ${errorClass}`}
        >
          <option value="">Select</option>
          {typeOptions.map((t) => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </select>
      );
    }

    if (col.type === "number") {
      return inputWrapper(
        <input
          type="number"
          min="1"
          value={row[col.key]}
          onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
          className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:border-[#00796B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errorClass}`}
        />
      );
    }

    return inputWrapper(
      <input
        type="text"
        value={row[col.key]}
        onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
        className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:border-[#00796B] ${errorClass}`}
        placeholder={col.label}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); else onOpenChange(open); }}>
      <DialogContent className={`max-h-[90vh] overflow-y-auto p-4 md:p-6 ${showEditTable || showResults ? "max-w-[95vw] md:max-w-6xl" : "max-w-[95vw] md:max-w-2xl"}`}>
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base md:text-lg font-semibold text-gray-900">
            Bulk Import Books
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {showUpload && "Upload an Excel file to import multiple books at once."}
            {showEditTable && (
              <>
                <span className="font-medium text-gray-700">{fileName}</span>
                {" — "}
                {rows.length} row{rows.length !== 1 ? "s" : ""} loaded. Review and edit before importing.
              </>
            )}
            {showResults && "Import completed. See results below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Template Download */}
          <div className="flex items-center justify-between p-3 bg-[#F0FDF4] border border-[#00A63E]/20 rounded-md">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#00796B]" />
              <span className="text-sm text-gray-700">Download the template to get started</span>
            </div>
            <ButtonWidget
              type="button"
              onClick={handleDownloadTemplate}
              disabled={isDownloading}
              loading={isDownloading}
              className="h-8 px-3 text-sm bg-white border border-[#00796B] text-[#00796B] hover:bg-[#00796B]/5 rounded-sm flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              {isDownloading ? "Downloading..." : "Template"}
            </ButtonWidget>
          </div>

          {/* Validation Error Banner */}
          {showEditTable && errorCount > 0 && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-sm text-red-700">
                {errorCount} error{errorCount !== 1 ? "s" : ""} in {errorRowCount} row{errorRowCount !== 1 ? "s" : ""}. Fix the highlighted fields before importing.
              </span>
            </div>
          )}

          {/* Step 1: File Upload */}
          {showUpload && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:border-[#00796B] hover:bg-[#00796B]/5 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">Only .xlsx and .xls files</p>
            </div>
          )}

          {/* Step 2: Editable Table */}
          {showEditTable && (
            <div className="space-y-3">
              <div className="border rounded-md overflow-auto max-h-[50vh]">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="p-2 text-left font-medium text-gray-600 border-b w-10">#</th>
                      {COLUMNS.map((col) => (
                        <th key={col.key} className="p-2 text-left font-medium text-gray-600 border-b whitespace-nowrap min-w-[100px]">
                          {col.label}
                          {col.required && <span className="text-red-500 ml-0.5">*</span>}
                        </th>
                      ))}
                      <th className="p-2 text-center font-medium text-gray-600 border-b w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => {
                      const hasRowError = rowErrors[rowIndex] && Object.keys(rowErrors[rowIndex]).length > 0;
                      const serverError = getRowServerError(rowIndex);
                      return (
                        <>
                          <tr key={rowIndex} className={`border-b ${hasRowError ? "bg-red-50/30" : "hover:bg-gray-50/50"}`}>
                            <td className="p-1.5 text-xs text-center align-top pt-2.5">
                              <span className={hasRowError ? "text-red-500 font-medium" : "text-gray-400"}>
                                {rowIndex + 1}
                              </span>
                            </td>
                            {COLUMNS.map((col) => (
                              <td key={col.key} className="p-1 align-top">
                                {renderCell(row, rowIndex, col)}
                              </td>
                            ))}
                            <td className="p-1 text-center align-top pt-2">
                              <button
                                type="button"
                                onClick={() => handleDeleteRow(rowIndex)}
                                className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                          {serverError && (
                            <tr key={`${rowIndex}-server-err`} className="bg-red-50/50">
                              <td />
                              <td colSpan={COLUMNS.length + 1} className="px-2 py-1.5">
                                <div className="flex items-center gap-1.5">
                                  <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                  <span className="text-xs text-red-600">{serverError}</span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1.5 text-sm text-[#00796B] hover:text-[#00796B]/80 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>
            </div>
          )}

          {/* Step 3: Import Results */}
          {showResults && (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1 p-3 bg-gray-50 rounded-md text-center">
                  <p className="text-2xl font-bold text-gray-900">{importResult.totalRows}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="flex-1 p-3 bg-[#F0FDF4] rounded-md text-center">
                  <p className="text-2xl font-bold text-[#00A63E]">{importResult.successCount}</p>
                  <p className="text-xs text-gray-500">Success</p>
                </div>
                <div className="flex-1 p-3 bg-red-50 rounded-md text-center">
                  <p className="text-2xl font-bold text-red-600">{importResult.failedCount}</p>
                  <p className="text-xs text-gray-500">Failed</p>
                </div>
              </div>

              {importResult.results?.length > 0 && (
                <div className="border rounded-md max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left p-2 font-medium text-gray-600">Row</th>
                        <th className="text-left p-2 font-medium text-gray-600">Title</th>
                        <th className="text-left p-2 font-medium text-gray-600">ISBN</th>
                        <th className="text-left p-2 font-medium text-gray-600">Status</th>
                        <th className="text-left p-2 font-medium text-gray-600">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importResult.results.map((result, idx) => (
                        <tr key={idx} className={`border-t ${result.success ? "" : "bg-red-50/50"}`}>
                          <td className="p-2 text-gray-600">{result.row}</td>
                          <td className="p-2 text-gray-900 max-w-[120px] truncate">{result.title || "-"}</td>
                          <td className="p-2 text-gray-600 font-mono text-xs">{result.isbn || "-"}</td>
                          <td className="p-2">
                            {result.success ? (
                              <CheckCircle2 className="w-4 h-4 text-[#00A63E]" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </td>
                          <td className="p-2 text-xs text-gray-600 max-w-[200px]">{result.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4 pt-3 border-t">
          <ButtonWidget
            type="button"
            onClick={handleClose}
            variant="outline"
            className="w-full sm:w-auto h-10 px-8 border-[#D9D9D9] hover:bg-gray-50 rounded-sm"
          >
            {showResults ? "Close" : "Cancel"}
          </ButtonWidget>

          {showEditTable && (
            <ButtonWidget
              type="button"
              onClick={handleReset}
              variant="outline"
              className="w-full sm:w-auto h-10 px-8 border-[#D9D9D9] hover:bg-gray-50 rounded-sm"
            >
              Re-upload
            </ButtonWidget>
          )}

          {showResults && (
            <ButtonWidget
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto text-white font-bold h-10 px-8 rounded-sm shadow-md border-0 bg-[#00796B] hover:bg-[#00796B]/90"
            >
              Import Another File
            </ButtonWidget>
          )}

          {showEditTable && (
            <ButtonWidget
              type="button"
              onClick={handleImport}
              disabled={isImporting || rows.length === 0}
              loading={isImporting}
              className="w-full sm:w-auto text-white font-bold h-10 px-8 rounded-sm shadow-md border-0 bg-[#00796B] hover:bg-[#00796B]/90"
            >
              {isImporting ? "Importing..." : `Import ${rows.length} Book${rows.length !== 1 ? "s" : ""}`}
            </ButtonWidget>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportDialog;

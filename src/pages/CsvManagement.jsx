import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Papa from "papaparse";

const CsvManagement = () => {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
        },
        error: (error) => {
          toast.error("Error parsing CSV file");
        },
      });
    }
  };

  const handleEditCell = (rowIndex, cellIndex, value) => {
    const updatedData = [...csvData];
    updatedData[rowIndex][cellIndex] = value;
    setCsvData(updatedData);
  };

  const handleAddRow = () => {
    setCsvData([...csvData, Array(csvData[0].length).fill("")]);
  };

  const handleDeleteRow = (rowIndex) => {
    setCsvData(csvData.filter((_, index) => index !== rowIndex));
  };

  const handleDownload = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName || "edited.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Management Tool</h1>
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {fileName && <p className="mt-2">Uploaded File: {fileName}</p>}
      </div>
      <div className="mb-4">
        <Button onClick={handleAddRow}>Add Row</Button>
      </div>
      {csvData.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              {csvData[0].map((_, index) => (
                <TableHead key={index}>Column {index + 1}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Input
                      value={cell}
                      onChange={(e) => handleEditCell(rowIndex, cellIndex, e.target.value)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="mt-4">
        <Button onClick={handleDownload}>Download CSV</Button>
      </div>
    </div>
  );
};

export default CsvManagement;
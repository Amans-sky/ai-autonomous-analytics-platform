import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileX } from "lucide-react";

interface DataTableProps {
  data: Record<string, unknown>[] | null;
  title?: string;
}

/**
 * Dynamically renders a table from any array of objects
 * Automatically extracts column headers from object keys
 */
const DataTable = ({ data, title = "Data Results" }: DataTableProps) => {
  // Empty state - no data
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <FileX className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-sm font-medium text-foreground">No data available</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit a query to see results here
          </p>
        </div>
      </div>
    );
  }

  // Extract column headers from the first row's keys
  const columns = Object.keys(data[0]);

  // Format cell value for display
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return "—";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return String(value);
  };

  // Format column header for display
  const formatHeader = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">
          {data.length} {data.length === 1 ? "row" : "rows"} returned
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="whitespace-nowrap">
                  {formatHeader(column)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column} className="whitespace-nowrap">
                    {formatValue(row[column])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;

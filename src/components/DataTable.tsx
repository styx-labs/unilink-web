import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

interface Column {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  detailsPath: (item: any) => string;
  idField?: string;
  isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  detailsPath,
  idField = "id",
  isLoading = false,
}) => {
  const renderCellContent = (item: any, column: Column) => {
    const value = item[column.key];
    if (column.render) {
      return column.render(value);
    }
    if (Array.isArray(value)) {
      return value.map((v, index) => (
        <div key={index}>
          {v.type}: {v.notes}
        </div>
      ));
    }
    return value;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </>
        ) : (
          data.map((item) => (
            <TableRow key={item[idField]}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {renderCellContent(item, column)}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex space-x-2">
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(item[idField])}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Link to={detailsPath(item)}>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;

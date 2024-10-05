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
import { ChevronRight, Pencil, Trash2, CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

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
  onAdd?: (id: string) => void;
  detailsPath?: (item: any) => string;
  idField?: string;
  isLoading?: boolean;
  className?: string;
}


const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
  detailsPath,
  idField = "id",
  className,
}) => {
  return (
    <Table className={cn("w-full", className)}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item[idField]}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.render
                  ? column.render(item[column.key])
                  : item[column.key]}
              </TableCell>
            ))}
            <TableCell>
              <div className="flex space-x-2">
                {onAdd && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAdd(item[idField])}
                  >
                    <CirclePlus className="h-4 w-4 text-blue-500" />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item[idField])}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
                {detailsPath && (
                  <Link to={detailsPath(item)}>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;

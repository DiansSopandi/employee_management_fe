// components/data-table/DataTable.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CustomButton } from "@/components/ui/custom-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Tipe data untuk paginasi dan metadata
export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Tipe data untuk kolom
export type ColumnDef<T> = {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  searchable?: boolean;
};

// Tipe data untuk prop DataTable
export type DataTableProps<T extends { id: number | string }> = Readonly<{
  title: string;
  columns: ColumnDef<T>[];
  fetchData: (
    page: number,
    pageSize: number,
    searchTerm: string
  ) => Promise<{
    data: T[];
    meta: PaginationMeta;
  }>;
  actions?: React.ReactNode;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  showDefaultActions?: boolean;
  rowActions?: (item: T) => React.ReactNode;
  pageSize?: number;
  defaultSearchTerm?: string;
}>;

export function DataTable<T extends { id: number | string }>({
  title,
  columns,
  fetchData,
  actions,
  onEdit,
  onDelete,
  showDefaultActions = false,
  rowActions,
  pageSize: initialPageSize = 5,
  defaultSearchTerm = "",
}: DataTableProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchData(page, pageSize, searchTerm);
      setItems(result.data);
      setLastPage(result.meta.totalPages);
      setTotalItems(result.meta.total);
    } catch (error) {
      console.error("Error fetching data:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, page, pageSize, searchTerm]);

  // Effect untuk fetch data awal atau saat pagination berubah
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [loadData]);

  // Handle perubahan pageSize
  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);
    setPage(1); // Reset ke halaman pertama saat pageSize berubah
  };

  const getCellContent = (column: ColumnDef<T>, item: T) => {
    let cellContent = "";
    if (column.cell) {
      cellContent = column.cell(item) as string;
    } else if (column.accessorKey) {
      cellContent = String(item[column.accessorKey]);
    }
    return cellContent;
  };

  const renderTableRows = () => {
    if (items.length > 0) {
      return items.map((item) => (
        <TableRow key={item.id.toString()}>
          {columns.map((column, index) => (
            <TableCell key={String(column.accessorKey ?? `column-${index}`)}>
              {getCellContent(column, item)}
            </TableCell>
          ))}
          {showDefaultActions && (
            <TableCell>
              <span className="flex space-x-2">
                {onEdit && (
                  <CustomButton
                    variant="default"
                    size="sm"
                    className="text-xs"
                    width="w-28"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </CustomButton>
                )}
                {onDelete && (
                  <CustomButton
                    variant="destructive"
                    size="sm"
                    className="text-xs"
                    width="w-28"
                    onClick={() => onDelete(item)}
                  >
                    Delete
                  </CustomButton>
                )}
              </span>
            </TableCell>
          )}
          {rowActions && <TableCell>{rowActions(item)}</TableCell>}
        </TableRow>
      ));
    } else {
      return (
        <TableRow>
          <TableCell
            colSpan={
              columns.length + (showDefaultActions || rowActions ? 1 : 0)
            }
            className="text-center py-8"
          >
            {searchTerm.trim() !== ""
              ? `No matching ${title.toLowerCase()} found.`
              : `No ${title.toLowerCase()} found.`}
          </TableCell>
        </TableRow>
      );
    }
  };

  // Buat pagination info
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);
  const paginationInfo =
    totalItems > 0
      ? `${startItem}-${endItem} from ${totalItems}`
      : "0-0 from 0";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-md font-semibold mb-4">{title}</h1>
        <div className="flex items-center space-x-2">{actions}</div>
      </div>

      {/* Search and PageSize Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
            className="pl-8"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
              {(showDefaultActions || rowActions) && (
                <TableHead>Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + (showDefaultActions || rowActions ? 1 : 0)
                  }
                  className="text-center py-8"
                >
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              renderTableRows()
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <div className="flex items-center gap-2">
          <CustomButton
            variant="default"
            size="sm"
            disabled={page === 1 || isLoading}
            onClick={() => setPage((prev) => prev - 1)}
            className="flex items-center gap-1"
            width="w-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </CustomButton>

          <CustomButton
            variant="default"
            size="sm"
            disabled={page === lastPage || isLoading || lastPage === 0}
            onClick={() => setPage((prev) => prev + 1)}
            className="flex items-center gap-1"
            width="w-40"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </CustomButton>
        </div>

        <div className="text-sm text-gray-600">
          <span>
            Page {page} of {lastPage || 1}
          </span>
          <span className="ml-2">({paginationInfo})</span>
        </div>
      </div>
    </div>
  );
}

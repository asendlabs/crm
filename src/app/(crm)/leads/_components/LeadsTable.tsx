"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "@/components/data-table/DataTablePagination";
import DataTableSearch from "@/components/data-table/DataTableSearch";
import { DataTableViewOptions } from "@/components/data-table/DataTableViewOptions";
import NewLeadForm from "./NewLeadForm";
import { updateLead } from "../_lib/lead.action";
import { useState } from "react";

interface LeadsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableData: TData[];
}

export function LeadsTable<TData, TValue>({
  columns,
  tableData,
}: LeadsTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>(tableData);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 13,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "leadName", desc: false },
  ]);

  const addLead = (newLead: any) => {
    setData((prevLeads) => [...prevLeads, newLead]);
  };

  const updateData = async ({
    rowIndex,
    columnId,
    newValue,
    itemId,
  }: {
    rowIndex: number;
    columnId: string;
    newValue: string;
    itemId: string;
  }) => {
    try {
      setData((prev) =>
        prev.map((row, index) =>
          index === rowIndex
            ? {
                ...prev[rowIndex],
                [columnId]: newValue,
              }
            : row
        )
      );
      const response = await updateLead({
        columnId,
        newValue,
        itemId,
      });
      if (!response.success) {
        return {
          success: false,
          message: "Coudln't successfully execute updateData function",
        };
      }
      return {
        success: true,
        message: "UpdateData function successfully executed",
      };
    } catch (error) {
      console.log("error", error);
    }
  };

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      pagination,
      columnFilters,
      sorting,
    },
    meta: {
      updateData,
    },
  });

  return (
    <>
      <section className="px-6 py-5 flex flex-col justify-between h-screen">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-xl font-semibold">Leads</h1>
            <div className="flex flex-row gap-2">
              <div>
                <DataTableViewOptions table={table} primaryField="leadName" />
              </div>
              <DataTableSearch
                table={table}
                primaryField="leadName"
                primaryFieldPrettyName="Lead"
              />
              <NewLeadForm addLead={addLead} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="cursor-pointer">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div>
          <DataTablePagination table={table} />
        </div>
      </section>
    </>
  );
}

"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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

import { DataTableFooter } from "@/components/data-table/DataTableFooter";
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "leadName", desc: false },
  ]);
  const [rowSelectionState, setRowSelectionState] = useState({});

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
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelectionState,
    state: {
      columnFilters,
      sorting,
      rowSelection: rowSelectionState,
    },
    meta: {
      updateData,
    },
  });

  return (
    <>
      <section className="px-6 py-5 flex flex-col justify-between h-screen gap-6">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-semibold">Leads</h1>
          <div className="flex flex-row gap-2">
            <div></div>
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
        <div className="overflow-y-auto custom-scrollbar">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="cursor-pointer">
              {table.getRowModel().rows.length ? (
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

        {/* <div>
          <DataTableFooter table={table} />
        </div> */}
      </section>
    </>
  );
}

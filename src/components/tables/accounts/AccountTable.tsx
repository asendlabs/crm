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

import {DataTableDeleteButton} from "@/components/data-table/DataTableDeleteButton";
import { DataTableSearch } from "@/components/data-table/DataTableSearch";
import { DataTableViewOptions } from "@/components/data-table/DataTableViewOptions";
import { NewLeadForm } from "../../forms/NewLeadForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AccountTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableData: TData[];
}

export function AccountTable<TData, TValue>({
  columns,
  tableData,
}: AccountTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>(tableData);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "accountName", desc: false },
  ]);
  const [rowSelectionState, setRowSelectionState] = useState({});
  const router = useRouter();
  const addData = (newData: any) => {
    setData((prevAccounts) => [...prevAccounts, newData]);
    router.refresh();
  };

  const primaryFields = ["accountName"];

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
            : row,
        ),
      );
      // const response = await updateAccount({
      //   columnId,
      //   newValue,
      //   itemId,
      // });
      // if (!response.success) {
      //   return {
      //     success: false,
      //     message: "Coudln't successfully execute updateData function",
      //   };
      // }
      // router.refresh();
      // return {
      //   success: true,
      //   message: "UpdateData function successfully executed",
      // };
    } catch (error) {
      console.log("error", error);
    }
  };

  const deleteData = async (itemIds: string[]) => {
    try {
      // const response = await deleteAccount(itemIds);
      // if (!response.success) {
      //   return {
      //     success: false,
      //     message: response.message,
      //   };
      // }
      setData((prev) => prev.filter((row: any) => !itemIds.includes(row.id)));
      table.resetRowSelection();
      router.refresh();
      // return {
      //   success: true,
      //   message: response.message,
      // };
    } catch (error) {
      console.log("error", error);
      return {
        success: false,
        message: "Internal Error",
      };
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
      deleteData,
    },
  });
  return (
    <>
      <section className="flex h-screen flex-col justify-between gap-6 px-6 py-5">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-semibold">Accounts</h1>
          <div className="flex flex-row gap-2">
            <div>
              <DataTableDeleteButton
                table={table}
                description="Deleting a account will delete all associated contacts. It can't be undone."
              />
            </div>
            <div>
              <DataTableViewOptions
                table={table}
                primaryFields={primaryFields}
              />
            </div>
            <DataTableSearch
              table={table}
              primaryField="accountName"
              primaryFieldPrettyName="Account"
            />
            {/* <NewLeadForm addLead={addData} /> */}
          </div>
        </div>
        <div className="custom-scrollbar min-h-[89vh] overflow-y-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                          cell.getContext(),
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
      </section>
    </>
  );
}

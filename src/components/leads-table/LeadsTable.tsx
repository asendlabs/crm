"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  Header,
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

import { DataTableDeleteButton } from "@/components/tables/nav/DataTableDeleteButton";
import { DataTableSearch } from "@/components/tables/nav/DataTableSearch";
import { DataTableViewOptions } from "@/components/tables/nav/DataTableViewOptions";
import { NewLeadForm } from "@/components/forms/NewLeadForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { deleteAccountAction, updateAccountAction } from "@/server/accounts";
import { toast } from "sonner";
import { Account, Contact } from "@database/types";

interface LeadTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableData: TData[];
}

export function LeadTable<TData, TValue>({
  columns,
  tableData,
}: LeadTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>(tableData);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "accountName", desc: false },
  ]);
  const [rowSelectionState, setRowSelectionState] = useState({});
  const router = useRouter();
  const addData = (newData: any) => {
    setData((prevLeads) => [...prevLeads, newData]);
    router.refresh();
  };
  const updateAccountServerAction = useServerAction(updateAccountAction);
  const deleteAccountServerAction = useServerAction(deleteAccountAction);
  const primaryFields = ["accountName", "contacts"];

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

      const [data, err] = await updateAccountServerAction.execute({
        columnId,
        itemId,
        newValue,
      });
      if (err) {
        return {
          success: false,
          message: "Coudln't successfully execute updateData function",
        };
      }
      router.refresh();
      return {
        success: true,
        message: "UpdateData function successfully executed",
      };
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteData = async (itemIds: string[]) => {
    try {
      const [data, err] = await deleteAccountServerAction.execute({ itemIds });
      if (err) {
        return {
          success: false,
          message: err.message,
        };
      }
      setData((prev) => prev.filter((row: any) => !itemIds.includes(row.id)));
      table.resetRowSelection();
      router.refresh();
      return {
        success: true,
        message: "Deleted",
      };
    } catch (error) {
      toast.error("Something went wrong");
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
      <section className="justify- flex h-screen flex-col gap-3 px-6 py-4">
        <div className="flex select-none flex-row items-center justify-between">
          <h1 className="text-xl font-semibold">Leads</h1>
          <div className="flex flex-row gap-2">
            <div>
              <DataTableDeleteButton
                table={table}
                description="Deleting a lead will delete all associated contacts. It can't be undone."
              />
            </div>
            <div>
              <DataTableViewOptions
                table={table}
                primaryFields={primaryFields}
              />
            </div>
            <div className="select-text">
              <DataTableSearch
                table={table}
                primaryField="accountName"
                primaryFieldPrettyName="Leads"
              />
            </div>
            <NewLeadForm addLead={addData} />
          </div>
        </div>
        <Table>
          <TableHeader className=" ">
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
          <TableBody className="mt-10 cursor-pointer">
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
                  className="h-24 select-none text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </>
  );
}
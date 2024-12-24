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

import { DataTableDeleteButton } from "@/app/app/_components/table_nav/DataTableDeleteButton";
import { DataTableSearch } from "@/app/app/_components/table_nav/DataTableSearch";
import { DataTableViewOptions } from "@/app/app/_components/table_nav/DataTableViewOptions";
import { useRouter } from "@/hooks/use-performance-router";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { deleteAccountAction, updateAccountAction } from "@/server/accounts";
import { toast } from "sonner";
import { Account, Contact } from "@/database";
import { PageTitle } from "@/components/page-title";
import { AccountFull } from "@/types/entities";

interface ClientTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableData: AccountFull[];
}

export function ClientTable<TData, TValue>({
  columns,
  tableData,
}: ClientTableProps<TData, TValue>) {
  const [data, setData] = useState<AccountFull[]>(tableData);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "accountName", desc: false },
  ]);
  const [rowSelectionState, setRowSelectionState] = useState({});
  const router = useRouter();
  const addData = (newData: any) => {
    setData((prevClients) => [...prevClients, newData]);
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
    data: data as TData[],
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
      <section className="flex h-screen flex-col gap-3 px-6 py-4">
        <div className="flex select-none flex-row items-center justify-between">
          <PageTitle>Clients</PageTitle>
          <div className="flex flex-row gap-2">
            <div>
              <DataTableDeleteButton
                table={table}
                description="Deleting a client will delete all associated contacts. It can't be undone."
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
                primaryFieldPrettyName="Clients"
              />
            </div>
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

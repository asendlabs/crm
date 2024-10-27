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

import { DataTableDeleteButton } from "@/app/app/_components/table_nav/DataTableDeleteButton";
import { DataTableSearch } from "@/app/app/_components/table_nav/DataTableSearch";
import { DataTableViewOptions } from "@/app/app/_components/table_nav/DataTableViewOptions";
import { NewDealForm } from "@/app/app/_components/forms/NewDealForm";
import { useRouter } from "@/hooks/use-performance-router";
import { useContext, useEffect, useState } from "react";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { deleteDealAction, updateDealAction } from "@/server/deal";
import { Account } from "@database/types";
import {
  DealViewContext,
  DealViewProvider,
  Views,
} from "@/providers/dealsViewProvider";
import { DealViewSwitcher } from "./DealViewSwitcher";
import {
  ContactWithDetails,
  DealStage,
  DealWithPrimaryContact,
} from "@/types/entities";
import { DealKanbanBoard } from "./DealKanbanBoard";
import { dealTableRelations } from "@database/relations";
import { Button } from "@/components/ui/button";
import { Cog, Settings, Settings2 } from "lucide-react";

interface DealTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableData: TData[];
  deals: DealWithPrimaryContact[];
  accounts: Account[];
  dealStages?: DealStage[];
}

export function DealTable<TData, TValue>({
  columns,
  tableData,
  deals,
  accounts,
  dealStages,
}: DealTableProps<TData, TValue>) {
  const { view } = useContext(DealViewContext);
  const [dealView, setDealView] = useState<Views>(view);
  const [data, setData] = useState<TData[]>(tableData);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "title", desc: false },
  ]);
  const [providedDeals, setProvidedDeals] = useState(deals);
  const [rowSelectionState, setRowSelectionState] = useState({});
  const router = useRouter();
  const updateDealServerAction = useServerAction(updateDealAction);
  const deleteDealServerAction = useServerAction(deleteDealAction);
  const addData = (newData: any) => {
    setData((prevDeals) => [...prevDeals, newData]);
    router.refresh();
  };

  const addDealKanban = (newDeal: any) => {
    setProvidedDeals((prevDeals) => [...prevDeals, newDeal]);
  };

  useEffect(() => {
    setDealView(view);
  }, [view]);

  const primaryFields = ["title", "stage"];

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
      const [data, err] = await updateDealServerAction.execute({
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
      const [data, err] = await deleteDealServerAction.execute({
        itemIds,
      });
      if (err) {
        return {
          success: false,
          message: err.message,
        };
      }
      setData((prev) => prev.filter((row: any) => !itemIds.includes(row.id)));
      setProvidedDeals((prev) =>
        prev.filter((row: any) => !itemIds.includes(row.id)),
      );
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
    <section className="flex h-screen flex-col gap-3 overflow-x-hidden px-6 pb-0 pt-4">
      <div className="flex select-none flex-row items-center justify-between">
        <h1 className="text-xl font-semibold capitalize">Deals</h1>
        <div className="flex flex-row gap-2">
          {dealView !== "board" && (
            <>
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
            </>
          )}
          {dealView !== "board" && (
            <div className="select-text">
              <DataTableSearch
                table={table}
                primaryField="title"
                primaryFieldPrettyName="Deal"
              />
            </div>
          )}
          {dealView !== "grid" && (
            <div>
              <Button variant={"outline"} size={"icon"} className="h-8 w-8">
                <Settings2 className="size-4" />
              </Button>
            </div>
          )}
          <div>
            <DealViewSwitcher view={dealView} setView={setDealView} />
          </div>

          <NewDealForm
            addDeal={addData}
            addDealKanban={addDealKanban}
            accounts={accounts}
            accessPoint={dealView}
            fullButton
          />
        </div>
      </div>
      {dealView === "grid" ? (
        <>
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
                    No deals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      ) : (
        <section className="mt-2 flex h-full max-w-[78.7vw] overflow-x-auto overflow-y-hidden">
          {/* {dealStages?.map((dealStage: DealStage) => <DealKanbanColumn dealStage={dealStage} deals={providedDeals} setProvidedDeals={setProvidedDeals} />)} */}
          <DealKanbanBoard
            defaultCols={dealStages ?? []}
            initialDeals={providedDeals}
          />
        </section>
      )}
    </section>
  );
}
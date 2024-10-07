"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface DataTableDeleteButtonProps<TData> {
  table: any;
  description: string;
}
export function DataTableDeleteButton<TData>({
  table,
  description,
}: DataTableDeleteButtonProps<TData>) {
  const [active, setActive] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleDelete = async () => {
    setOpen(false);
    const selectedRows = table.getSelectedRowModel().rows;

    if (selectedRows.length > 0) {
      const itemIds = selectedRows.map((row: any) => row.original.id); // Adjust based on your data structure
      const result = await table.options.meta?.deleteData(itemIds);
      if (result.success) {
        return { success: true };
      } else {
        return { success: false };
      }
    }
  };

  const tableRowslength = table.getFilteredSelectedRowModel().flatRows.length;

  useEffect(() => {
    if (tableRowslength > 0) {
      setActive(true);
    }
    if (tableRowslength === 0) {
      setActive(false);
    }
  }, [tableRowslength, table]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        disabled={!active}
        className="flex h-8 items-center gap-1 rounded-lg px-2 text-sm hover:text-red-600"
        onClick={() => setOpen(true)}
      >
        <Trash className="h-4 w-4" />
        {active && (
          <span>
            Delete
            <span>
              {" ("}
              {table.getFilteredSelectedRowModel().flatRows.length}
              {")"}
            </span>
          </span>
        )}
      </Button>
      <AlertDialogContent className="!p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={"destructive"} onClick={handleDelete}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
function DataTableDeleteButton<TData>({
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

  useEffect(() => {
    if (table.getFilteredSelectedRowModel().flatRows.length > 0) {
      setActive(true);
    }
    if (table.getFilteredSelectedRowModel().flatRows.length === 0) {
      setActive(false);
    }
  }, [table.getFilteredSelectedRowModel().flatRows.length, table]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        disabled={!active}
        className="flex h-8 items-center gap-2 rounded-lg px-2 text-sm hover:text-red-600"
        onClick={() => setOpen(true)}
      >
        <Trash className="h-4 w-4" />
        <span>
          Delete
          {active && (
            <span>
              {" ("}
              {table.getFilteredSelectedRowModel().flatRows.length}
              {")"}
            </span>
          )}
        </span>
      </Button>
      <AlertDialogContent>
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

export default DataTableDeleteButton;

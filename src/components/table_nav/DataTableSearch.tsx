import { Input } from "@/components/ui/input";
import React from "react";
import { Search } from "lucide-react";
import { Table } from "@tanstack/react-table";
interface DataTableSearchProps<TData> {
  table: Table<TData>;
  primaryField: string;
  primaryFieldPrettyName?: string;
}
export function DataTableSearch<TData>({
  table,
  primaryField,
  primaryFieldPrettyName,
}: DataTableSearchProps<TData>) {
  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-1/2 size-4 translate-y-[-50%] text-muted-foreground" />
      <Input
        type="search"
        className="max-h-8 w-full rounded-lg bg-background pl-8 md:w-60 lg:w-60"
        placeholder={
          primaryFieldPrettyName ? `${primaryFieldPrettyName} Search` : "Search"
        }
        value={
          (table.getColumn(primaryField)?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn(primaryField)?.setFilterValue(event.target.value)
        }
      />
    </div>
  );
}

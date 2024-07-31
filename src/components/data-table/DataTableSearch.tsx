import { Input } from "@/components/ui/input";
import React from "react";
import { Search } from "lucide-react";
import { Table } from "@tanstack/react-table";
interface DataTableSearchProps<TData> {
  table: Table<TData>;
  primaryField: string;
  primaryFieldPrettyName?: string;
}
function DataTableSearch<TData>({
  table,
  primaryField,
  primaryFieldPrettyName,
}: DataTableSearchProps<TData>) {
  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        className="w-full rounded-lg bg-background pl-8 md:w-60 lg:w-60 max-h-7"
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

export default DataTableSearch;

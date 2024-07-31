import { Checkbox } from "@/components/ui/checkbox";
export function DataTableCheckbox({ row }: { row: any }) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="ml-[10px]"
    />
  );
}

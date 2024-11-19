import { ChevronLeft } from "lucide-react";
import Link from "@/components/performance-link";

export function GoBackLink({
  pagePath,
  permanent,
  children,
}: {
  pagePath: string;
  permanent: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-center gap-1 text-sm text-gray-500 hover:text-gray-900 hover:underline">
      <ChevronLeft className="size-4" />
      <Link
        href={"/app/" + pagePath.toLowerCase().replace(/\s+/g, "")}
        replace={permanent}
      >
        {children}
      </Link>
    </div>
  );
}

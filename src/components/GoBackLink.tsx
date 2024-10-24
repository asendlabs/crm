import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function GoBackLink({
  pagePath,
  permanent,
}: {
  pagePath: string;
  permanent: boolean;
}) {
  return (
    (<div className="captialize flex flex-row items-center gap-1 text-sm text-gray-500 hover:text-gray-900 hover:underline">
      <ChevronLeft className="size-4" />
      <Link
        href={"/app/" + pagePath.toLowerCase().replace(/\s+/g, "")}
        replace={permanent}
      >
        Go back to {pagePath}
      </Link>
    </div>)
  );
}

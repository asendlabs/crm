import { authenticatedUrl } from "@/constants";
import { redirect } from "next/navigation";

export default function RootPage() {
  return redirect(authenticatedUrl);
}

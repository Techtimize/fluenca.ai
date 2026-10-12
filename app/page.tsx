import { redirect } from "next/navigation";
import { PAGE_ROUTES } from "@/constant/page-routes";

export default function RootPage() {
  redirect(PAGE_ROUTES.HOME);
}

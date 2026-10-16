import { redirect } from "next/navigation";
import { PAGE_ROUTES } from "@/constant/page-routes";

/** Blogs now live under AI visibility; keep old links working. */
export default function BlogsRedirect() {
  redirect(PAGE_ROUTES.BLOGS);
}

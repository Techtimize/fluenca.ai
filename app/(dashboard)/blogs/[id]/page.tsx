import { redirect } from "next/navigation";
import { PAGE_ROUTES } from "@/constant/page-routes";

/** Blogs now live under AI visibility; keep old links working. */
export default async function BlogDetailRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(PAGE_ROUTES.BLOG_DETAIL(id));
}

import { redirect } from "next/navigation";
import { PAGE_ROUTES } from "@/constant/page-routes";

/** Controls now live under Connectors; keep old links working. */
export default function ControlsRedirect() {
  redirect(PAGE_ROUTES.CONTROLS);
}

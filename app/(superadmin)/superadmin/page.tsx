"use client";

import { useMemo, useState } from "react";
import { Loader2, Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getApiErrorMessage } from "@/errors/error-utils";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { AdminUsersQuery } from "@/routes/admin/Admin-Query";
import useAuthStore from "@/store/AuthsStore";
import type { AdminUser } from "@/types/admin/users-type";

const SUPER_ADMIN_ROLES = new Set(["super_admin", "superadmin", "admin"]);

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusPill({ status }: { status?: string | null }) {
  const t = useTranslations("common");
  const normalized = (status ?? "").toLowerCase();
  const tone =
    normalized === "active" || normalized === "verified"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : normalized === "pending" || normalized === "invited"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : normalized === "inactive" || normalized === "suspended" || normalized === "blocked"
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-neutral-50 text-neutral-600 border-neutral-200";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${tone}`}>
      {status || t("unknown")}
    </span>
  );
}

function RolePill({ role }: { role?: string | null }) {
  return (
    <span className="inline-flex rounded-full border border-[#E6E8F5] bg-[#F6F7FD] px-2.5 py-0.5 text-[11px] font-medium text-neutral-700">
      {role || "—"}
    </span>
  );
}

function matchesQuery(user: AdminUser, query: string) {
  if (!query) return true;
  const haystack = [
    user.email,
    user.contact_person,
    user.company_name,
    user.industry,
    user.role,
    user.status,
    user.phone,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export default function SuperAdminUsersPage() {
  const t = useTranslations("superadmin");
  const tCommon = useTranslations("common");
  const tTop = useTranslations("topBar");
  const [query, setQuery] = useState("");
  const companyName = useAuthStore((s) => s.company_name);
  const role = useAuthStore((s) => s.role);
  const { data, isLoading, isError, error, isFetching } = AdminUsersQuery();

  const users = useMemo(() => {
    const list = data ?? [];
    const q = query.trim().toLowerCase();
    return list.filter((user) => matchesQuery(user, q));
  }, [data, query]);

  const isSuperAdmin = SUPER_ADMIN_ROLES.has(role.toLowerCase());

  if (role && !isSuperAdmin) {
    return (
      <main className="min-w-0 space-y-4">
        <TopBar user={{ name: companyName || "Admin" }} placeholder={tTop("searchUsers")} />
        <Card className="p-6">
          <h1 className="text-lg font-semibold text-neutral-900">{t("accessRestricted")}</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {t("accessBody")}{" "}
            <a href={PAGE_ROUTES.DASHBOARD} className="font-medium text-[#5B57E6] hover:underline">
              {t("backToDashboard")}
            </a>
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-w-0 space-y-4">
      <TopBar
        user={{ name: companyName || "Admin" }}
        placeholder={tTop("searchUsers")}
        onSearch={setQuery}
      />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">{t("usersTitle")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("usersSubtitle")}
            {typeof data?.length === "number" ? ` · ${t("total", { count: data.length })}` : ""}
          </p>
        </div>

        <label className="relative w-full max-w-xs">
          <span className="sr-only">{t("filterPlaceholder")}</span>
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("filterPlaceholder")}
            className="h-10 w-full rounded-full border border-[#E6E8F5] bg-white pe-4 ps-9 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-[#5B57E6]/30"
          />
        </label>
      </div>

      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-neutral-600">
            <Loader2 className="size-4 animate-spin" />
            {t("loading")}
          </div>
        ) : null}

        {isError ? (
          <div className="px-5 py-10 text-sm text-rose-700">
            {getApiErrorMessage(error, tCommon("errorGeneric"))}
          </div>
        ) : null}

        {!isLoading && !isError && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-5 py-16 text-center">
            <span className="grid size-11 place-items-center rounded-full bg-[#ECEBFF] text-[#5B57E6]">
              <Users className="size-5" />
            </span>
            <p className="text-sm font-medium text-neutral-900">{t("emptyTitle")}</p>
            <p className="text-sm text-neutral-500">
              {query ? t("emptySearch") : t("emptyDefault")}
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && users.length > 0 ? (
          <div className="px-2 py-2 sm:px-4">
            <div className="mb-2 flex items-center justify-between px-2 pt-2 text-[12px] text-neutral-500">
              <span>
                {t("showing", {
                  count: users.length,
                  matching: query ? t("matching") : "",
                  plural: users.length === 1 ? "" : "s",
                })}
              </span>
              {isFetching ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="size-3 animate-spin" />
                  {t("refreshing")}
                </span>
              ) : null}
            </div>

            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t("colUser")}</TableHead>
                  <TableHead>{t("colCompany")}</TableHead>
                  <TableHead>{t("colRole")}</TableHead>
                  <TableHead>{t("colStatus")}</TableHead>
                  <TableHead>{t("colJoined")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-neutral-900">
                          {user.contact_person || user.email}
                        </p>
                        <p className="truncate text-[12px] text-neutral-500">{user.email}</p>
                        {user.phone ? (
                          <p className="truncate text-[12px] text-neutral-400">{user.phone}</p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="truncate text-neutral-800">{user.company_name || "—"}</p>
                        {user.industry ? (
                          <p className="truncate text-[12px] text-neutral-500">{user.industry}</p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <RolePill role={user.role} />
                    </TableCell>
                    <TableCell>
                      <StatusPill status={user.status} />
                    </TableCell>
                    <TableCell className="text-neutral-600">{formatDate(user.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </Card>
    </main>
  );
}

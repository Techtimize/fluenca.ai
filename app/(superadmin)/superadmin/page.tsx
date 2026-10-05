"use client";

import { useState } from "react";
import { Loader2, Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import TopBar from "@/components/dashboard/topBar";
import Card from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { DeleteUserMutation, UpdateUserStatusMutation } from "@/routes/admin/Admin-Mutation";
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
  const haystack = [user.email, user.full_name, user.company_name, user.role, user.status]
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
  const currentUserId = useAuthStore((s) => s.user_id);
  const role = useAuthStore((s) => s.role);
  const { data, isLoading, isError, error, isFetching } = AdminUsersQuery();
  const updateStatus = UpdateUserStatusMutation();
  const deleteUser = DeleteUserMutation();
  const q = query.trim().toLowerCase();
  const users = (data?.items ?? []).filter((user) => matchesQuery(user, q));
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const confirmStatusChange = () => {
    if (!confirmTarget) return;
    const nextStatus = confirmTarget.status.toLowerCase() === "suspended" ? "active" : "suspended";
    updateStatus.mutate(
      { userId: confirmTarget.user_id, status: nextStatus },
      { onSuccess: () => setConfirmTarget(null) },
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget.user_id, { onSuccess: () => setDeleteTarget(null) });
  };

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
            {typeof data?.total === "number" ? ` · ${t("total", { count: data.total })}` : ""}
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
                  <TableHead>{t("colOnboarding")}</TableHead>
                  <TableHead>{t("colRole")}</TableHead>
                  <TableHead>{t("colStatus")}</TableHead>
                  <TableHead>{t("colJoined")}</TableHead>
                  <TableHead>{t("colActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isSelf = user.user_id === currentUserId;
                  const isSuspended = user.status.toLowerCase() === "suspended";
                  const isPending =
                    updateStatus.isPending && updateStatus.variables?.userId === user.user_id;

                  return (
                    <TableRow
                      key={user.user_id}
                      onClick={() => setSelectedUser(user)}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-neutral-900">
                            {user.full_name || user.email}
                          </p>
                          <p className="truncate text-[12px] text-neutral-500">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-800">{user.company_name || "—"}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            user.onboarding_completed_at
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {user.onboarding_completed_at ? t("onboardingDone") : t("onboardingPending")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <RolePill role={user.role} />
                      </TableCell>
                      <TableCell>
                        <StatusPill status={user.status} />
                      </TableCell>
                      <TableCell className="text-neutral-600">{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        {isSelf ? (
                          <span className="text-[12px] text-neutral-400">{t("you")}</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmTarget(user);
                              }}
                              className="rounded-full border border-[#E6E8F5] px-3 py-1 text-[12px] font-medium text-neutral-700 hover:bg-[#F6F7FD] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isPending ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : isSuspended ? (
                                t("reactivate")
                              ) : (
                                t("suspend")
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(user);
                              }}
                              className="rounded-full border border-rose-200 px-3 py-1 text-[12px] font-medium text-rose-700 hover:bg-rose-50"
                            >
                              {t("delete")}
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </Card>

      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser?.full_name || selectedUser?.email}</DialogTitle>
            <DialogDescription>{selectedUser?.email}</DialogDescription>
          </DialogHeader>
          {selectedUser ? (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-neutral-500">{t("colCompany")}</dt>
              <dd className="text-neutral-900">{selectedUser.company_name || "—"}</dd>
              <dt className="text-neutral-500">{t("colOnboarding")}</dt>
              <dd className="text-neutral-900">
                {selectedUser.onboarding_completed_at ? t("onboardingDone") : t("onboardingPending")}
              </dd>
              <dt className="text-neutral-500">{t("colRole")}</dt>
              <dd className="text-neutral-900">{selectedUser.role}</dd>
              <dt className="text-neutral-500">{t("colStatus")}</dt>
              <dd className="text-neutral-900">{selectedUser.status}</dd>
              <dt className="text-neutral-500">{t("colJoined")}</dt>
              <dd className="text-neutral-900">{formatDate(selectedUser.created_at)}</dd>
              <dt className="text-neutral-500">{t("lastLogin")}</dt>
              <dd className="text-neutral-900">{formatDate(selectedUser.last_login_at)}</dd>
            </dl>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmTarget !== null} onOpenChange={(open) => !open && setConfirmTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmTarget?.status.toLowerCase() === "suspended"
                ? t("confirmReactivateTitle")
                : t("confirmSuspendTitle")}
            </DialogTitle>
            <DialogDescription>
              {confirmTarget?.status.toLowerCase() === "suspended"
                ? t("confirmReactivateBody", { email: confirmTarget?.email ?? "" })
                : t("confirmSuspendBody", { email: confirmTarget?.email ?? "" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmTarget(null)} disabled={updateStatus.isPending}>
              {tCommon("cancel")}
            </Button>
            <Button
              variant={confirmTarget?.status.toLowerCase() === "suspended" ? "default" : "destructive"}
              onClick={confirmStatusChange}
              disabled={updateStatus.isPending}
            >
              {updateStatus.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : confirmTarget?.status.toLowerCase() === "suspended" ? (
                t("reactivate")
              ) : (
                t("suspend")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDeleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("confirmDeleteBody", { email: deleteTarget?.email ?? "" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteUser.isPending}>
              {tCommon("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteUser.isPending}>
              {deleteUser.isPending ? <Loader2 className="size-3.5 animate-spin" /> : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

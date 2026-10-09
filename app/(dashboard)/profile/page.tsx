"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bot,
  ClipboardList,
  Briefcase,
  Building2,
  CalendarDays,
  Crown,
  FileText,
  Globe,
  ImageIcon,
  Languages,
  Loader2,
  Link2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import TopBar from "@/components/dashboard/topBar";
import AssetImage from "@/components/shared/assetImage";
import Card from "@/components/shared/card";
import { PAGE_ROUTES } from "@/constant/page-routes";
import { EditUserProfileMutation } from "@/routes/bussiness/Bussiness-Mutation";
import { UserProfileQuery } from "@/routes/bussiness/Bussiness-Query";
import useAuthStore from "@/store/AuthsStore";
import type {
  EditProfileCompany,
  EditProfileRequest,
  EditProfileUser,
  UserProfileCompany,
  UserProfileData,
  UserProfileUser,
} from "@/types/bussiness/user-profile-type";
import { FOCUS_RING } from "@/utils/ui-classes";

const USAGE_ICONS: Record<string, typeof BarChart3> = {
  company_analysis: BarChart3,
  manual_competitor_analysis: Users,
  ai_competitor_analysis: Bot,
  script_generation: FileText,
  image_generation: ImageIcon,
};

const PLATFORMS: Record<string, { label: string; iconSrc: string }> = {
  instagram: { label: "Instagram", iconSrc: "/assets/insta.png" },
  linkedin: { label: "LinkedIn", iconSrc: "/assets/linkedin.png" },
  x: { label: "X", iconSrc: "/assets/x.png" },
};

function formatDate(value: string | null, opts: Intl.DateTimeFormatOptions) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", opts);
}

export default function ProfilePage() {
  const companyName = useAuthStore((s) => s.company_name);
  const { data, isLoading, isError, error, refetch } = UserProfileQuery();
  const profile = data?.data;

  return (
    <main className="min-w-0 space-y-4">
      <TopBar user={{ name: companyName || profile?.company?.name || "" }} />

      {isLoading ? (
        <ProfileSkeleton />
      ) : isError || !profile ? (
        <div className="flex flex-col items-start gap-3 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error instanceof Error
            ? error.message
            : "Could not load your profile."}
          <button
            type="button"
            onClick={() => void refetch()}
            className={`rounded-full border border-rose-300 bg-white px-4 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 ${FOCUS_RING}`}
          >
            Try again
          </button>
        </div>
      ) : (
        <ProfileView profile={profile} />
      )}
    </main>
  );
}

// Fields the edit-profile API accepts. Role, email and team size stay read-only.
const USER_FIELDS = ["full_name", "phone", "location", "language"] as const;
const COMPANY_FIELDS = [
  "name",
  "website",
  "logo_url",
  "industry",
  "region",
  "business_model",
] as const;

type Draft = {
  user: Record<(typeof USER_FIELDS)[number], string>;
  company: Record<(typeof COMPANY_FIELDS)[number], string>;
};

function toDraft(user: UserProfileUser, company: UserProfileCompany): Draft {
  return {
    user: Object.fromEntries(
      USER_FIELDS.map((key) => [key, user[key] ?? ""]),
    ) as Draft["user"],
    company: Object.fromEntries(
      COMPANY_FIELDS.map((key) => [key, company[key] ?? ""]),
    ) as Draft["company"],
  };
}

// Only fields that actually changed are sent, so the request may hold just one of them.
function changedFields(
  draft: Draft,
  user: UserProfileUser,
  company: UserProfileCompany,
): EditProfileRequest {
  const userChanges: EditProfileUser = {};
  for (const key of USER_FIELDS) {
    const value = draft.user[key].trim();
    if (value !== (user[key] ?? "")) userChanges[key] = value;
  }
  const companyChanges: EditProfileCompany = {};
  for (const key of COMPANY_FIELDS) {
    const value = draft.company[key].trim();
    if (value !== (company[key] ?? "")) companyChanges[key] = value;
  }
  return {
    ...(Object.keys(userChanges).length ? { user: userChanges } : {}),
    ...(Object.keys(companyChanges).length ? { company: companyChanges } : {}),
  };
}

function ProfileView({ profile }: { profile: UserProfileData }) {
  const { plan } = profile;
  // The API can send null for any of these, so every read below needs a fallback.
  const user = profile.user ?? ({} as UserProfileUser);
  const company = profile.company ?? ({} as UserProfileCompany);

  const [draft, setDraft] = useState<Draft | null>(null);
  const editing = draft !== null;
  const { mutate: editProfile, isPending: isSaving } =
    EditUserProfileMutation();

  const startEditing = () => setDraft(toDraft(user, company));
  const cancelEditing = () => setDraft(null);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft || isSaving) return;
    const changes = changedFields(draft, user, company);
    if (!changes.user && !changes.company) {
      setDraft(null);
      return;
    }
    editProfile(changes, { onSuccess: () => setDraft(null) });
  };

  const userInput = (key: keyof Draft["user"]) =>
    draft
      ? {
          value: draft.user[key],
          onChange: (value: string) =>
            setDraft({ ...draft, user: { ...draft.user, [key]: value } }),
        }
      : undefined;
  const companyInput = (key: keyof Draft["company"]) =>
    draft
      ? {
          value: draft.company[key],
          onChange: (value: string) =>
            setDraft({ ...draft, company: { ...draft.company, [key]: value } }),
        }
      : undefined;
  const companyName = company.name || "Your company";
  const displayName = user.full_name || user.email || companyName;
  const accounts = profile.connected_accounts ?? [];
  const usage = plan?.usage ?? [];

  const joined = formatDate(user.joined_at, { month: "long", year: "numeric" });
  const renews = formatDate(plan?.renews_at ?? null, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const connectedCount = accounts.filter((a) => a.connected).length;
  const totalUsed = usage.reduce((sum, u) => sum + u.used, 0);
  const totalLimit = usage.reduce((sum, u) => sum + u.limit, 0);

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Hero */}
      <Card className="relative overflow-hidden">
        <div className="relative h-36 overflow-hidden bg-linear-to-br from-[#4338CA] via-[#5B57E6] to-[#9061F9]">
          <span
            className="absolute -right-10 -top-16 size-56 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />
          <span
            className="absolute -bottom-20 left-1/3 size-64 rounded-full bg-[#C4B5FD]/25 blur-3xl"
            aria-hidden="true"
          />
          <span
            className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-size-[18px_18px]"
            aria-hidden="true"
          />
          {plan ? (
            <span className="absolute right-5 top-4 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Crown className="size-3.5" aria-hidden="true" />
              {plan.name} Plan
            </span>
          ) : null}
        </div>

        <div className="px-5 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <div className="relative -mt-12 w-fit">
                {user.avatar_url ? (
                  <AssetImage
                    src={user.avatar_url}
                    alt={displayName}
                    width={96}
                    height={96}
                    className="size-24 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <span className="grid size-24 place-items-center rounded-full border-4 border-white bg-linear-to-br from-[#5B57E6] to-[#8B5CF6] text-3xl font-semibold text-white shadow-lg">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
                <span
                  className="absolute bottom-1.5 right-1.5 size-4 rounded-full border-2 border-white bg-emerald-500"
                  aria-hidden="true"
                />
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-semibold text-neutral-900">
                  {displayName}
                </h1>
                <p className="text-sm text-neutral-500">
                  {user.role ? `${user.role} at ` : null}
                  <span className="font-medium text-neutral-700">
                    {companyName}
                  </span>
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {user.location ? (
                    <Chip icon={<MapPin />}>{user.location}</Chip>
                  ) : null}
                  {joined ? (
                    <Chip icon={<CalendarDays />}>Joined {joined}</Chip>
                  ) : null}
                  {user.email ? (
                    <Chip icon={<Mail />}>{user.email}</Chip>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 self-start sm:self-auto">
              <Link
                href={PAGE_ROUTES.QUESTIONS}
                className={`flex h-10 items-center justify-center gap-2 rounded-full border border-[#D9DCF7] bg-white px-5 text-sm font-medium text-[#5452F6] transition-colors hover:bg-[#EEF0FF] ${FOCUS_RING}`}
              >
                <ClipboardList className="size-4" aria-hidden="true" />
                View Questions
              </Link>
              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className={`flex h-10 items-center justify-center gap-2 rounded-full border border-[#E6E8F5] bg-white px-5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-60 ${FOCUS_RING}`}
                  >
                    <X className="size-4" aria-hidden="true" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex h-10 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] px-5 text-sm font-medium text-white shadow-[0_6px_16px_-6px_rgba(99,70,240,0.6)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
                  >
                    {isSaving ? (
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Save className="size-4" aria-hidden="true" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={startEditing}
                  className={`flex h-10 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] px-5 text-sm font-medium text-white shadow-[0_6px_16px_-6px_rgba(99,70,240,0.6)] transition-opacity hover:opacity-95 ${FOCUS_RING}`}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat
              icon={<Crown />}
              label="Current Plan"
              value={plan?.name ?? "No plan"}
              hint={renews ? `Renews ${renews}` : "—"}
            />
            <Stat
              icon={<Sparkles />}
              label="Credits Used"
              value={`${totalUsed}/${totalLimit}`}
              hint="Across all features"
            />
            <Stat
              icon={<Link2 />}
              label="Connected Accounts"
              value={`${connectedCount}/${accounts.length}`}
              hint={
                connectedCount === accounts.length
                  ? "All connected"
                  : "Connect more for better insights"
              }
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader
              icon={<Building2 />}
              title="Company"
              subtitle="The business you're growing"
            />
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#E6E8F5] bg-linear-to-r from-[#F5F6FF] to-white p-3">
              {company.logo_url ? (
                <AssetImage
                  src={company.logo_url}
                  alt={companyName}
                  width={48}
                  height={48}
                  className="size-12 rounded-xl border border-[#E6E8F5] bg-white object-contain"
                />
              ) : (
                <span className="grid size-12 place-items-center rounded-xl bg-[#EEF0FF] text-lg font-semibold text-[#5452F6]">
                  {companyName.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-neutral-900">
                  {companyName}
                </p>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 truncate text-xs text-[#5452F6] hover:underline"
                  >
                    <Globe className="size-3.5 shrink-0" aria-hidden="true" />
                    {company.website
                      .replace(/^https?:\/\//, "")
                      .replace(/\/$/, "")}
                  </a>
                ) : null}
              </div>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {editing ? (
                <>
                  <Field
                    icon={<Building2 />}
                    label="Company Name"
                    value={company.name}
                    input={companyInput("name")}
                  />
                  <Field
                    icon={<Globe />}
                    label="Website"
                    value={company.website}
                    input={companyInput("website")}
                    type="url"
                    placeholder="https://"
                  />
                  <Field
                    icon={<ImageIcon />}
                    label="Logo URL"
                    value={company.logo_url}
                    input={companyInput("logo_url")}
                    type="url"
                    placeholder="https://"
                    wide
                  />
                </>
              ) : null}
              <Field
                icon={<Briefcase />}
                label="Industry"
                value={company.industry}
                input={companyInput("industry")}
              />
              <Field
                icon={<MapPin />}
                label="Region"
                value={company.region}
                input={companyInput("region")}
              />
              <Field
                icon={<BarChart3 />}
                label="Business Model"
                value={company.business_model}
                input={companyInput("business_model")}
              />
              <Field
                icon={<Users />}
                label="Team Size"
                value={company.team_size}
              />
            </dl>
          </Card>

          <Card className="p-5">
            <SectionHeader
              icon={<User />}
              title="Personal Information"
              subtitle="Your account details"
            />
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field
                icon={<User />}
                label="Full Name"
                value={user.full_name}
                input={userInput("full_name")}
              />
              <Field icon={<ShieldCheck />} label="Role" value={user.role} />
              <Field icon={<Mail />} label="Email" value={user.email} />
              <Field
                icon={<Phone />}
                label="Phone"
                value={user.phone}
                input={userInput("phone")}
                type="tel"
              />
              <Field
                icon={<MapPin />}
                label="Location"
                value={user.location}
                input={userInput("location")}
              />
              <Field
                icon={<Languages />}
                label="Language"
                value={user.language}
                input={userInput("language")}
              />
            </dl>
          </Card>
        </div>

        <div className="space-y-4">
          {plan ? (
            <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#312E81] via-[#4F46E5] to-[#7C3AED] p-5 text-white shadow-[0_16px_40px_-20px_rgba(79,70,229,0.7)]">
              <span
                className="absolute -right-12 -top-12 size-44 rounded-full bg-white/10 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/70">Current Plan</p>
                    <p className="mt-0.5 flex items-center gap-2 text-2xl font-semibold">
                      {plan.name}
                      <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[11px] font-medium capitalize text-emerald-200">
                        {plan.status}
                      </span>
                    </p>
                    <p className="mt-1 text-xs capitalize text-white/70">
                      {[plan.billing_cycle, renews ? `Renews ${renews}` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-xl bg-white/15">
                    <Crown className="size-5" aria-hidden="true" />
                  </span>
                </div>

                <ul className="mt-5 space-y-3.5">
                  {usage.map((item) => {
                    const Icon = USAGE_ICONS[item.id] ?? Sparkles;
                    const pct = item.limit
                      ? Math.min(100, (item.used / item.limit) * 100)
                      : 0;
                    return (
                      <li key={item.id}>
                        <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                          <span className="flex items-center gap-2 text-white/85">
                            <Icon className="size-3.5" aria-hidden="true" />
                            {item.label}
                          </span>
                          <span className="font-semibold tabular-nums">
                            {item.used}
                            <span className="text-white/60">/{item.limit}</span>
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                          <div
                            className={`h-full rounded-full ${pct >= 80 ? "bg-amber-300" : "bg-white"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <button
                  type="button"
                  className={`mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-semibold text-[#4F46E5] transition-colors hover:bg-white/90 ${FOCUS_RING}`}
                >
                  <Sparkles className="size-4" aria-hidden="true" />
                  Upgrade Plan
                </button>
              </div>
            </section>
          ) : null}

          <Card className="p-5">
            <SectionHeader
              icon={<Link2 />}
              title="Connected Accounts"
              subtitle={`${connectedCount} of ${accounts.length} connected`}
            />
            <ul className="space-y-2">
              {accounts.map((account) => {
                const platform = PLATFORMS[account.platform] ?? {
                  label: account.platform,
                  iconSrc: "/assets/globe.png",
                };
                return (
                  <li
                    key={account.platform}
                    className="flex items-center gap-3 rounded-2xl border border-[#ECEDF5] px-3 py-2.5 transition-colors hover:bg-[#F8F9FF]"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-[#F5F6FF]">
                      <AssetImage
                        src={platform.iconSrc}
                        alt=""
                        width={22}
                        height={22}
                        className="size-5.5 object-contain"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-neutral-900">
                        {platform.label}
                      </span>
                      <span className="block truncate text-xs text-neutral-500">
                        {account.connected && account.handle
                          ? `@${account.handle}`
                          : "Not connected"}
                      </span>
                    </span>
                    {account.connected ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                        <span
                          className="size-1.5 rounded-full bg-emerald-500"
                          aria-hidden="true"
                        />
                        Connected
                      </span>
                    ) : (
                      <button
                        type="button"
                        className={`rounded-full border border-[#D9DCF7] px-3 py-1 text-xs font-medium text-[#5452F6] hover:bg-[#EEF0FF] ${FOCUS_RING}`}
                      >
                        Connect
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </form>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true">
      <div className="overflow-hidden rounded-3xl border border-[#E6E8F5] bg-white">
        <div className="h-36 bg-[#E4E6FB]" />
        <div className="px-5 pb-5">
          <div className="-mt-12 size-24 rounded-full border-4 border-white bg-neutral-200" />
          <div className="mt-3 h-5 w-48 rounded bg-neutral-200" />
          <div className="mt-2 h-3 w-64 rounded bg-neutral-100" />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-19 rounded-2xl bg-[#F4F5FD]" />
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
        <div className="h-72 rounded-3xl bg-white" />
        <div className="h-72 rounded-3xl bg-[#E4E6FB]" />
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className="grid size-9 place-items-center rounded-xl bg-[#EEF0FF] text-[#5452F6] [&>svg]:size-4.5"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div>
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
        {subtitle ? (
          <p className="text-xs text-neutral-500">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

function Chip({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-[#F1F4FF] px-2.5 py-1 text-xs text-neutral-700 [&>svg]:size-3.5 [&>svg]:text-[#5452F6]">
      {icon}
      {children}
    </span>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E6E8F5] bg-linear-to-br from-[#F7F8FF] to-white p-3.5">
      <span
        className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#5452F6] shadow-sm [&>svg]:size-4.5"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="text-base font-semibold text-neutral-900">{value}</p>
        <p className="truncate text-[11px] text-neutral-400">{hint}</p>
      </div>
    </div>
  );
}

type FieldInput = { value: string; onChange: (value: string) => void };

function Field({
  icon,
  label,
  value,
  input,
  type = "text",
  placeholder,
  wide,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  // When set, the field is in edit mode and shows a text input.
  input?: FieldInput;
  type?: "text" | "url" | "tel";
  placeholder?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
        input
          ? "bg-white ring-1 ring-[#D9DCF7] focus-within:ring-2 focus-within:ring-[#5B57E6]/50"
          : "bg-[#F6F7FE] hover:bg-[#EEF0FF]"
      } ${wide ? "sm:col-span-2" : ""}`}
    >
      {icon ? (
        <span
          className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#5452F6] shadow-sm [&>svg]:size-4"
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-neutral-500">{label}</dt>
        <dd className="mt-0.5 truncate text-sm font-semibold text-neutral-900">
          {input ? (
            <input
              type={type}
              value={input.value}
              onChange={(e) => input.onChange(e.target.value)}
              placeholder={placeholder ?? `Add ${label.toLowerCase()}`}
              aria-label={label}
              className="w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none placeholder:font-normal placeholder:text-neutral-400"
            />
          ) : (
            value || "—"
          )}
        </dd>
      </div>
    </div>
  );
}

"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Building2, ChevronRight, Loader2, MapPin, Search, UserRound } from "lucide-react";
import { LinkedInIcon } from "@/components/shared/brandIcons";
import { SearchCompanyMutation, SearchPeopleMutation } from "@/routes/bussiness/Bussiness-Mutation";
import type {
  CompanySearchRequest,
  CompanySearchResult,
  PeopleSearchPerson,
  PeopleSearchRequest,
  PersonDetailRequest,
} from "@/types/bussiness/linkedin-people-type";
import { FOCUS_RING } from "@/utils/ui-classes";
import PersonDetailDialog from "./PersonDetailDialog";
import { BADGE, CARD, FIELD_INPUT, PRIMARY_BUTTON, SECONDARY_BUTTON, humanize, toList } from "./prospect-ui";
import SectionHeader from "./SectionHeader";

type Tab = "people" | "companies" | "lookup";

const TABS: { id: Tab; label: string }[] = [
  { id: "people", label: "People" },
  { id: "companies", label: "Companies" },
  { id: "lookup", label: "Look up a person" },
];

/** Search LinkedIn for people and companies in plain English, and look up one person. */
export default function LinkedInSearchSection() {
  const [tab, setTab] = useState<Tab>("people");
  const [lookup, setLookup] = useState<PersonDetailRequest | null>(null);

  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <SectionHeader
        step={<Search className="size-3.5" aria-hidden="true" />}
        title="Search people & companies"
        description="Describe who you're looking for in plain English, e.g. “Heads of marketing at Dubai fintechs”."
      />

      <div className="mt-5 flex flex-wrap gap-1.5" role="tablist" aria-label="Search type">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${FOCUS_RING} ${
              tab === id ? "bg-[#5B57E6] text-white" : "bg-[#F1F2FB] text-neutral-600 hover:bg-[#E6E8F5]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4" role="tabpanel">
        {tab === "people" ? <PeopleSearch onOpen={setLookup} /> : null}
        {tab === "companies" ? <CompanySearch /> : null}
        {tab === "lookup" ? <PersonLookup onLookup={setLookup} /> : null}
      </div>

      <PersonDetailDialog lookup={lookup} onClose={() => setLookup(null)} />
    </section>
  );
}

// ---------- Shared bits ----------

const numberOrNull = (value: string) => (value.trim() ? Number(value) : null);

/** Country codes are sent as two capital letters ("ae" → "AE"). */
const toCountries = (value: string) => toList(value).map((code) => code.toUpperCase());

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-[12px] font-medium text-neutral-700">{label}</span>
      {children}
    </label>
  );
}

function SearchButton({ pending }: { pending: boolean }) {
  return (
    <button type="submit" disabled={pending} className={`${PRIMARY_BUTTON} h-10 ${FOCUS_RING}`}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
      Search
    </button>
  );
}

function LoadMore({ pending, onClick }: { pending: boolean; onClick: () => void }) {
  return (
    <div className="mt-3 flex justify-center">
      <button type="button" onClick={onClick} disabled={pending} className={`${SECONDARY_BUTTON} ${FOCUS_RING}`}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Load more
      </button>
    </div>
  );
}

function EmptyResults({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-[#E6E8F5] px-6 py-8 text-center text-[13px] text-neutral-500">
      {text}
    </p>
  );
}

// ---------- People ----------

function PeopleSearch({ onOpen }: { onOpen: (lookup: PersonDetailRequest) => void }) {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState("");
  const [minYears, setMinYears] = useState("");
  const search = SearchPeopleMutation();
  // The request behind the results, reused with `cursor` for the next page.
  const [request, setRequest] = useState<PeopleSearchRequest | null>(null);
  const [results, setResults] = useState<PeopleSearchPerson[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    const body: PeopleSearchRequest = {
      query: query.trim(),
      filters: { countries: toCountries(countries), years_of_experience_min: numberOrNull(minYears) },
    };
    search.mutate(body, {
      onSuccess: (data) => {
        setRequest(body);
        setResults(data.results);
        setNextCursor(data.next_cursor);
      },
    });
  };

  const loadMore = () => {
    if (!request || !nextCursor) return;
    search.mutate(
      { ...request, cursor: nextCursor },
      {
        onSuccess: (data) => {
          setResults((current) => [...current, ...data.results]);
          setNextCursor(data.next_cursor);
        },
      },
    );
  };

  return (
    <>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem_9rem_auto] sm:items-end">
        <Field label="Who are you looking for?">
          <input
            required
            maxLength={500}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Heads of marketing at Dubai fintechs"
            className={FIELD_INPUT}
          />
        </Field>
        <Field label="Countries">
          <input value={countries} onChange={(e) => setCountries(e.target.value)} placeholder="AE, GB" className={FIELD_INPUT} />
        </Field>
        <Field label="Min. years exp.">
          <input type="number" min={0} value={minYears} onChange={(e) => setMinYears(e.target.value)} placeholder="5" className={FIELD_INPUT} />
        </Field>
        <SearchButton pending={search.isPending && !request?.cursor} />
      </form>

      <div className="mt-4">
        {request && !results.length ? (
          <EmptyResults text="No people matched. Try a broader description or fewer filters." />
        ) : results.length ? (
          <>
            <ul className="grid gap-2.5 md:grid-cols-2">
              {results.map((person, index) => (
                <li key={`${person.profiles?.[0] ?? person.name}-${index}`}>
                  <PersonCard person={person} onOpen={() => onOpen(personLookup(person))} />
                </li>
              ))}
            </ul>
            {nextCursor ? <LoadMore pending={search.isPending} onClick={loadMore} /> : null}
          </>
        ) : null}
      </div>
    </>
  );
}

/** Profile URLs find the person best; otherwise fall back to their name and company. */
function personLookup(person: PeopleSearchPerson): PersonDetailRequest {
  if (person.profiles?.length) return { social_urls: person.profiles };
  const [first, ...rest] = person.name.split(/\s+/);
  const company = person.role?.company;
  return {
    name: { first, last: rest.join(" ") || first },
    company: { name: company?.name ?? undefined, domain: company?.domain ?? undefined },
  };
}

function PersonCard({ person, onOpen }: { person: PeopleSearchPerson; onOpen: () => void }) {
  const role = person.role;
  const location = [person.location?.city, person.location?.region, person.location?.country_code].filter(Boolean).join(", ");
  const linkedin = person.profiles?.find((url) => url.includes("linkedin.com"));
  const skills = person.skills?.slice(0, 4) ?? [];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#E6E8F5] p-3.5">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#EEF0FF] text-[#5B57E6]">
          <UserRound className="size-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-[14px] font-semibold text-neutral-900">{person.name}</h3>
            {person.is_founder ? <span className={`${BADGE} bg-violet-50 text-violet-700`}>Founder</span> : null}
          </div>
          {role?.title ? (
            <p className="text-[12px] text-neutral-600">
              {role.title}
              {role.company?.name ? <span className="text-neutral-400"> at {role.company.name}</span> : null}
            </p>
          ) : null}
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-neutral-500">
            {location ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" aria-hidden="true" />
                {location}
              </span>
            ) : null}
            {typeof person.years_of_experience === "number" ? <span>{person.years_of_experience} yrs exp.</span> : null}
            {role?.seniority ? <span>{humanize(role.seniority)}</span> : null}
          </p>
        </div>
      </div>

      {skills.length ? (
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <li key={skill} className="rounded-full bg-[#F6F7FD] px-2 py-0.5 text-[11px] text-neutral-600">
              {skill}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        {linkedin ? (
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1 rounded text-[12px] text-[#5B57E6] hover:underline ${FOCUS_RING}`}
          >
            <LinkedInIcon className="size-3.5" />
            Profile
          </a>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onOpen}
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[12px] font-medium text-[#5B57E6] hover:bg-[#F0F1FF] ${FOCUS_RING}`}
        >
          Full details
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

// ---------- Companies ----------

function CompanySearch() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState("");
  const [minEmployees, setMinEmployees] = useState("");
  const search = SearchCompanyMutation();
  const [request, setRequest] = useState<CompanySearchRequest | null>(null);
  const [results, setResults] = useState<CompanySearchResult[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    const body: CompanySearchRequest = {
      query: query.trim(),
      filters: { countries: toCountries(countries), employees_min: numberOrNull(minEmployees) },
    };
    search.mutate(body, {
      onSuccess: (data) => {
        setRequest(body);
        setResults(data.results);
        setNextCursor(data.next_cursor);
      },
    });
  };

  const loadMore = () => {
    if (!request || !nextCursor) return;
    search.mutate(
      { ...request, cursor: nextCursor },
      {
        onSuccess: (data) => {
          setResults((current) => [...current, ...data.results]);
          setNextCursor(data.next_cursor);
        },
      },
    );
  };

  return (
    <>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem_9rem_auto] sm:items-end">
        <Field label="What kind of companies?">
          <input
            required
            maxLength={500}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="B2B payment startups in the UAE"
            className={FIELD_INPUT}
          />
        </Field>
        <Field label="HQ countries">
          <input value={countries} onChange={(e) => setCountries(e.target.value)} placeholder="AE" className={FIELD_INPUT} />
        </Field>
        <Field label="Min. employees">
          <input type="number" min={0} value={minEmployees} onChange={(e) => setMinEmployees(e.target.value)} placeholder="10" className={FIELD_INPUT} />
        </Field>
        <SearchButton pending={search.isPending && !request?.cursor} />
      </form>

      <div className="mt-4">
        {request && !results.length ? (
          <EmptyResults text="No companies matched. Try a broader description or fewer filters." />
        ) : results.length ? (
          <>
            <ul className="grid gap-2.5 md:grid-cols-2">
              {results.map((company, index) => (
                <li key={`${company.domain ?? company.name}-${index}`}>
                  <CompanyCard company={company} />
                </li>
              ))}
            </ul>
            {nextCursor ? <LoadMore pending={search.isPending} onClick={loadMore} /> : null}
          </>
        ) : null}
      </div>
    </>
  );
}

const usd = (value?: number | null) =>
  typeof value === "number"
    ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", notation: "compact" }).format(value)
    : null;

const headcount = (employees: CompanySearchResult["employees"]) => {
  if (!employees) return null;
  if (typeof employees.count === "number") return `${employees.count.toLocaleString()} employees`;
  if (typeof employees.min === "number") {
    return employees.max ? `${employees.min}–${employees.max} employees` : `${employees.min}+ employees`;
  }
  return null;
};

function CompanyCard({ company }: { company: CompanySearchResult }) {
  const hq = [company.headquarters?.city, company.headquarters?.region, company.headquarters?.country_code]
    .filter(Boolean)
    .join(", ");
  const revenueMin = usd(company.revenue?.min_usd);
  const revenueMax = usd(company.revenue?.max_usd);
  const revenue = revenueMin && revenueMax ? `${revenueMin}–${revenueMax} revenue` : null;
  const funding = company.funding?.total_usd
    ? `${usd(company.funding.total_usd)} raised${company.funding.stage ? ` · ${humanize(company.funding.stage)}` : ""}`
    : company.funding?.stage
      ? humanize(company.funding.stage)
      : null;
  const facts = [headcount(company.employees), revenue, funding, company.founded_year ? `Founded ${company.founded_year}` : null].filter(
    Boolean,
  );

  return (
    <article className="h-full rounded-2xl border border-[#E6E8F5] p-3.5">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#EEF0FF] text-[#5B57E6]">
          <Building2 className="size-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14px] font-semibold text-neutral-900">{company.name}</h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-neutral-500">
            {company.domain ? (
              <a
                href={`https://${company.domain}`}
                target="_blank"
                rel="noreferrer"
                className={`rounded text-[#5B57E6] hover:underline ${FOCUS_RING}`}
              >
                {company.domain}
              </a>
            ) : null}
            {hq ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" aria-hidden="true" />
                {hq}
              </span>
            ) : null}
          </p>
        </div>
      </div>
      {company.description ? (
        <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-neutral-600">{company.description}</p>
      ) : null}
      {facts.length ? <p className="mt-2 text-[12px] text-neutral-500">{facts.join(" · ")}</p> : null}
      {company.industries?.length ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {company.industries.slice(0, 4).map((industry) => (
            <li key={industry} className="rounded-full bg-[#F6F7FD] px-2 py-0.5 text-[11px] text-neutral-600">
              {industry}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

// ---------- Look up one person ----------

type LookupMode = "linkedin" | "email" | "name";

const LOOKUP_MODES: { id: LookupMode; label: string }[] = [
  { id: "linkedin", label: "LinkedIn URL" },
  { id: "email", label: "Work email" },
  { id: "name", label: "Name + company" },
];

function PersonLookup({ onLookup }: { onLookup: (lookup: PersonDetailRequest) => void }) {
  const [mode, setMode] = useState<LookupMode>("linkedin");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [domain, setDomain] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (mode === "linkedin") onLookup({ social_urls: [url.trim()] });
    else if (mode === "email") onLookup({ email: email.trim() });
    else onLookup({ name: { first: first.trim(), last: last.trim() }, company: { domain: domain.trim() } });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Look up by">
        {LOOKUP_MODES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={mode === id}
            onClick={() => setMode(id)}
            className={`rounded-full border px-3 py-1 text-[12px] font-medium ${FOCUS_RING} ${
              mode === id ? "border-[#5B57E6] bg-[#F0F1FF] text-[#4544C9]" : "border-[#E6E8F5] text-neutral-600 hover:bg-[#F6F7FD]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        {mode === "linkedin" ? (
          <Field label="LinkedIn profile URL">
            <input
              required
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/…"
              className={FIELD_INPUT}
            />
          </Field>
        ) : mode === "email" ? (
          <Field label="Work email">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@acme.com"
              className={FIELD_INPUT}
            />
          </Field>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="First name">
              <input required value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Jane" className={FIELD_INPUT} />
            </Field>
            <Field label="Last name">
              <input required value={last} onChange={(e) => setLast(e.target.value)} placeholder="Doe" className={FIELD_INPUT} />
            </Field>
            <Field label="Company domain">
              <input required value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="acme.com" className={FIELD_INPUT} />
            </Field>
          </div>
        )}
        <button type="submit" className={`${PRIMARY_BUTTON} h-10 ${FOCUS_RING}`}>
          <Search className="size-4" />
          Look up
        </button>
      </div>
    </form>
  );
}

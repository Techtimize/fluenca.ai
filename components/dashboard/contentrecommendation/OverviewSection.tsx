// import SharedCard from "@/components/shared/card";
// import { Chip } from "./chipsandsection";
// import SectionHeader from "./sectionHeader";

// type Props = {
//   summary?: string | null;
//   companyName?: string | null;
//   version?: number | null;
//   status?: string | null;
//   createdAt?: string | null;
//   platformNames: string[];
//   ideasCount: number;
//   goalMode?: string | null;
//   quickMode?: boolean;
// };

// export default function OverviewSection({
//   summary,
//   companyName,
//   version,
//   status,
//   createdAt,
//   platformNames,
//   ideasCount,
//   goalMode,
//   quickMode,
// }: Props) {
//   if (
//     !summary &&
//     !companyName &&
//     version == null &&
//     !platformNames.length &&
//     !ideasCount
//   ) {
//     return null;
//   }

//   return (
//     <SharedCard className="overflow-hidden p-0">
//       <div className="border-b border-[#EEF0F8] bg-[radial-gradient(ellipse_at_top_left,#ECEBFF_0%,#FFFFFF_55%)] px-4 py-4">
//         <SectionHeader label="overview" />
//         {companyName ? (
//           <p className="mt-1 text-[16px] font-semibold tracking-tight text-neutral-900">
//             {companyName}
//           </p>
//         ) : null}
//         {summary ? (
//           <p className="mt-1.5 text-[13px] leading-5 text-neutral-600">{summary}</p>
//         ) : null}
//       </div>
//       <div className="flex flex-wrap gap-2 p-4">
//         {typeof version === "number" ? (
//           <Chip>v{version}</Chip>
//         ) : null}
//         {status ? <Chip>{status}</Chip> : null}
//         {ideasCount ? <Chip>{ideasCount} ideas</Chip> : null}
//         {goalMode ? <Chip>Goal · {goalMode}</Chip> : null}
//         {quickMode ? <Chip>Quick mode</Chip> : null}
//         {createdAt ? (
//           <Chip>{new Date(createdAt).toLocaleString()}</Chip>
//         ) : null}
//         {platformNames.map((platform) => (
//           <Chip key={platform}>{platform}</Chip>
//         ))}
//       </div>
//     </SharedCard>
//   );
// }

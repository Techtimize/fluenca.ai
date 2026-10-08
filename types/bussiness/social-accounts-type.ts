export type SocialPlatform = "instagram" | "linkedin" | string;

export interface InstagramAuthorizeResponse {
  authorize_url: string;
  success?: boolean;
  message?: string;
}

export interface SocialAccount {
  id?: string;
  platform?: SocialPlatform;
  provider?: string;
  username?: string | null;
  account_name?: string | null;
  display_name?: string | null;
  profile_url?: string | null;
  connected?: boolean;
  is_connected?: boolean;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

export type SocialAccountsResponse =
  | SocialAccount[]
  | {
      success?: boolean;
      accounts?: SocialAccount[];
      social_accounts?: SocialAccount[];
      data?: SocialAccount[] | { accounts?: SocialAccount[] };
      items?: SocialAccount[];
      results?: SocialAccount[];
      [key: string]: unknown;
    };

export function normalizeSocialAccounts(
  data?: SocialAccountsResponse | null,
): SocialAccount[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  if (Array.isArray(data.accounts)) return data.accounts;
  if (Array.isArray(data.social_accounts)) return data.social_accounts;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.results)) return data.results;

  if (data.data) {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data.accounts)) return data.data.accounts;
  }

  return [];
}

export function isSocialAccountConnected(account?: SocialAccount | null) {
  if (!account) return false;
  if (typeof account.connected === "boolean") return account.connected;
  if (typeof account.is_connected === "boolean") return account.is_connected;
  const status = String(account.status || "").toLowerCase();
  return status === "connected" || status === "active" || status === "linked";
}

export function findSocialAccount(
  accounts: SocialAccount[],
  platform: SocialPlatform,
) {
  const target = String(platform).toLowerCase();
  return (
    accounts.find((account) => {
      const value = String(account.platform || account.provider || "").toLowerCase();
      return value === target || value.includes(target);
    }) ?? null
  );
}

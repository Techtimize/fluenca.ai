export type DnaStatus = 'not_started' | 'generating' | 'ready' | 'failed';

export interface DnaSection {
  key: string;
  title: string;
  text: string;
}

export interface DnaResponseProps {
  status: DnaStatus;
  version: number | null;
  sections: DnaSection[];
  document: string | null;
  error: string | null;
  created_at: string | null;
  ready_at: string | null;
}

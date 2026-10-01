export type IntakeStatus = 'not_started' | 'running' | 'review' | 'completed' | 'failed';

export type IntakeStep =
  | 'queued'
  | 'reading_website'
  | 'writing_questions'
  | 'drafting_answers'
  | 'searching_web'
  | 'saving'
  | 'done';

export type AnswerStatus = 'needs_input' | 'drafted_by_ai' | 'confirmed';

export type AnswerConfidence = 'high' | 'medium';

export interface IntakeSummary {
  total: number;
  drafted_by_ai: number;
  needs_input: number;
  confirmed: number;
  required_unanswered: number;
}

export interface IntakeQuestion {
  question_id: string;
  field_name: string;
  section: string;
  question: string;
  required: boolean;
  only_you_can_answer: boolean;
  answer: string | null;
  status: AnswerStatus;
  source_url: string | null;
  source_quote?: string | null;
  confidence: AnswerConfidence | null;
  updated_at: string;
}

export interface IntakeSection {
  name: string;
  questions: IntakeQuestion[];
}

export interface IntakeResponseProps {
  status: IntakeStatus;
  step: IntakeStep | null;
  error: string | null;
  run_started_at: string | null;
  run_finished_at: string | null;
  completed_at: string | null;
  can_complete: boolean;
  summary: IntakeSummary;
  sections: IntakeSection[];
}

export interface AnswerQuestionRequestProps {
  question_id: string;
  answer: string | null;
}

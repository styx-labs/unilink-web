export interface Company {
  company_id: string;
  company_name: string;
  company_desc: string;
  founders: string;
}

export interface Candidate {
  candidate_id: string;
  candidate_first_name: string;
  candidate_last_name: string;
  candidate_desc: string | null;
  linkedin: string;
  github: string;
  resume: string;
  email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface CandidateRole {
  candidate_id: string;
  candidate: Candidate;
  candidate_role_notes: CandidateRoleNote[] | null;
  candidate_role_status: CandidateRoleStatus;
  created_at: string;
  updated_at: string;
}

export interface CandidateRoleNote {
  type: CandidateRoleNoteType;
  notes: string;
}

export enum CandidateRoleNoteType {
  GENERATED = "Generated",
  TAKEHOME = "Takehome Assignment",
  EMAIL = "Email",
  PHONE_SCREEN = "Phone Screen",
  OTHER = "Other",
}

export interface Role {
  role_id: string;
  role_name: string;
  role_status: RoleStatus;
  role_desc: string;
  role_requirements: string;
  role_criteria: string[];
}

export enum RoleStatus {
  OPEN = "Open",
  IN_REVIEW = "In Review",
  CLOSED_FILLED = "Closed Filled",
  CLOSED_UNFILLED = "Closed Unfilled",
  CLOSED_CANCELLED = "Closed Cancelled",
}

export enum CandidateRoleStatus {
  OUTREACH = "Outreach",
  SCREENING = "Screening",
  INTERVIEW = "Interview",
  OFFER = "Offer",
  HIRED = "Hired",
  REJECTED = "Rejected",
}

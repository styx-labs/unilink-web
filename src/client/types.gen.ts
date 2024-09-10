// This file is auto-generated by @hey-api/openapi-ts

export type Candidate = {
  candidate_first_name: string;
  candidate_last_name: string;
  candidate_desc: string;
  linkedin: string;
  github: string;
  resume: string;
  email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  generated_desc: string;
};

export type CandidateCreate = {
  candidate_first_name: string;
  candidate_last_name: string;
  candidate_desc: string;
  linkedin: string;
  github: string;
  resume: string;
  email: string;
  phone_number: string;
  created_at?: string;
  updated_at?: string;
  generated_desc?: string;
};

export type CandidateRole = {
  candidate_id: string;
  candidate_role_status?: CandidateRoleStatus;
  candidate_role_notes?: Array<CandidateRoleNote> | null;
  criteria_scores?: Array<CriteriaScoringItem> | null;
  candidate_role_generated_description?: string | null;
  created_at: string;
  updated_at: string;
  readonly candidate: Candidate | null;
};

export type CandidateRoleCreate = {
  candidate_id: string;
  candidate_role_status?: CandidateRoleStatus;
  candidate_role_notes?: Array<CandidateRoleNote> | null;
  criteria_scores?: Array<CriteriaScoringItem> | null;
  candidate_role_generated_description?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CandidateRoleNote = {
  type: CandidateRoleNoteType;
  notes: string;
  created_at?: string;
};

export enum CandidateRoleNoteType {
  Generated = "Generated",
  TakehomeAssignment = "Takehome Assignment",
  Email = "Email",
  PhoneScreen = "Phone Screen",
  Other = "Other",
}

export enum CandidateRoleStatus {
  Outreach = "Outreach",
  Screening = "Screening",
  Interview = "Interview",
  Offer = "Offer",
  Hired = "Hired",
  Rejected = "Rejected",
}

export type CandidateRoleUpdate = {
  candidate_id: string;
  candidate_role_status?: CandidateRoleStatus;
  candidate_role_notes?: Array<CandidateRoleNote> | null;
  criteria_scores?: Array<CriteriaScoringItem> | null;
  candidate_role_generated_description?: string | null;
  updated_at?: string;
};

export type CandidateUpdate = {
  candidate_first_name: string;
  candidate_last_name: string;
  candidate_desc: string;
  linkedin: string;
  github: string;
  resume: string;
  email: string;
  phone_number: string;
  updated_at?: string;
};

export type CandidateWithId = {
  candidate_first_name: string;
  candidate_last_name: string;
  candidate_desc: string;
  linkedin: string;
  github: string;
  resume: string;
  email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  generated_desc: string;
  candidate_id: string;
};

export type Company = {
  company_name: string;
  company_desc: string;
  founders: Array<CompanyFounder>;
  created_at: string;
  updated_at: string;
};

export type CompanyCreate = {
  company_name: string;
  company_desc: string;
  founders: Array<CompanyFounder>;
  created_at?: string;
  updated_at?: string;
};

export type CompanyFounder = {
  founder_name: string;
  founder_role: string;
  founder_email: string;
  founder_phone: string;
  founder_linkedin_url: string;
};

export type CompanyUpdate = {
  company_name: string;
  company_desc: string;
  founders: Array<CompanyFounder>;
  updated_at?: string;
};

export type CompanyWithId = {
  company_name: string;
  company_desc: string;
  founders: Array<CompanyFounder>;
  created_at: string;
  updated_at: string;
  company_id: string;
};

export type CriteriaScoringItem = {
  criteria_name: string;
  score: number;
};

export type HTTPValidationError = {
  detail?: Array<ValidationError>;
};

export type Role = {
  role_name: string;
  role_desc: string;
  role_requirements?: string | null;
  role_status?: RoleStatus;
  role_criteria?: Array<RoleCriteria>;
  created_at: string;
  updated_at: string;
};

export type RoleCreate = {
  role_name: string;
  role_desc: string;
  role_requirements?: string | null;
  role_status?: RoleStatus;
  role_criteria?: Array<RoleCriteria>;
  created_at?: string;
  updated_at?: string;
  is_open?: boolean;
};

export type RoleCriteria = {
  criteria_name: string;
};

export enum RoleStatus {
  Open = "Open",
  InReview = "In Review",
  ClosedFilled = "Closed Filled",
  ClosedUnfilled = "Closed Unfilled",
  ClosedCancelled = "Closed Cancelled",
}

export type RoleUpdate = {
  role_name: string;
  role_desc: string;
  role_requirements?: string | null;
  role_status?: RoleStatus;
  role_criteria?: Array<RoleCriteria>;
  updated_at?: string;
};

export type RoleWithId = {
  role_name: string;
  role_desc: string;
  role_requirements?: string | null;
  role_status?: RoleStatus;
  role_criteria?: Array<RoleCriteria>;
  created_at: string;
  updated_at: string;
  role_id: string;
};

export type ValidationError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

export type HealthcheckHealthcheckGetResponse = {
  [key: string]: unknown;
};

export type HealthcheckHealthcheckGetError = unknown;

export type ListCompaniesCompaniesGetResponse = Array<CompanyWithId>;

export type ListCompaniesCompaniesGetError = unknown;

export type CreateCompanyCompaniesPostData = {
  body: CompanyCreate;
};

export type CreateCompanyCompaniesPostResponse = string;

export type CreateCompanyCompaniesPostError = HTTPValidationError;

export type GetCompanyCompaniesCompanyIdGetData = {
  path: {
    company_id: string;
  };
};

export type GetCompanyCompaniesCompanyIdGetResponse = Company | null;

export type GetCompanyCompaniesCompanyIdGetError = HTTPValidationError;

export type UpdateCompanyCompaniesCompanyIdPutData = {
  body: CompanyUpdate;
  path: {
    company_id: string;
  };
};

export type UpdateCompanyCompaniesCompanyIdPutResponse = Company;

export type UpdateCompanyCompaniesCompanyIdPutError = HTTPValidationError;

export type DeleteCompanyCompaniesCompanyIdDeleteData = {
  path: {
    company_id: string;
  };
};

export type DeleteCompanyCompaniesCompanyIdDeleteResponse = Company;

export type DeleteCompanyCompaniesCompanyIdDeleteError = HTTPValidationError;

export type CreateRoleCompaniesCompanyIdRolesPostData = {
  body: RoleCreate;
  path: {
    company_id: string;
  };
};

export type CreateRoleCompaniesCompanyIdRolesPostResponse = string;

export type CreateRoleCompaniesCompanyIdRolesPostError = HTTPValidationError;

export type ListRolesCompaniesCompanyIdRolesGetData = {
  path: {
    company_id: string;
  };
};

export type ListRolesCompaniesCompanyIdRolesGetResponse = Array<RoleWithId>;

export type ListRolesCompaniesCompanyIdRolesGetError = HTTPValidationError;

export type GetRoleCompaniesCompanyIdRolesRoleIdGetData = {
  path: {
    company_id: string;
    role_id: string;
  };
};

export type GetRoleCompaniesCompanyIdRolesRoleIdGetResponse = Role | null;

export type GetRoleCompaniesCompanyIdRolesRoleIdGetError = HTTPValidationError;

export type UpdateRoleCompaniesCompanyIdRolesRoleIdPutData = {
  body: RoleUpdate;
  path: {
    company_id: string;
    role_id: string;
  };
};

export type UpdateRoleCompaniesCompanyIdRolesRoleIdPutResponse = Role | null;

export type UpdateRoleCompaniesCompanyIdRolesRoleIdPutError =
  HTTPValidationError;

export type DeleteRoleCompaniesCompanyIdRolesRoleIdDeleteData = {
  path: {
    company_id: string;
    role_id: string;
  };
};

export type DeleteRoleCompaniesCompanyIdRolesRoleIdDeleteResponse = Role;

export type DeleteRoleCompaniesCompanyIdRolesRoleIdDeleteError =
  HTTPValidationError;

export type GenerateCriteriaCompaniesCompanyIdRolesRoleIdGenerateCriteriaPostData =
  {
    path: {
      company_id: string;
      role_id: string;
    };
  };

export type GenerateCriteriaCompaniesCompanyIdRolesRoleIdGenerateCriteriaPostResponse =
  Array<RoleCriteria>;

export type GenerateCriteriaCompaniesCompanyIdRolesRoleIdGenerateCriteriaPostError =
  HTTPValidationError;

export type CreateCandidateCompaniesCompanyIdRolesRoleIdCandidatesCreatePostData =
  {
    body: CandidateCreate;
    path: {
      company_id: string;
      role_id: string;
    };
  };

export type CreateCandidateCompaniesCompanyIdRolesRoleIdCandidatesCreatePostResponse =
  CandidateRole;

export type CreateCandidateCompaniesCompanyIdRolesRoleIdCandidatesCreatePostError =
  HTTPValidationError;

export type AddCandidateCompaniesCompanyIdRolesRoleIdCandidatesPostData = {
  body: CandidateRoleCreate;
  path: {
    company_id: string;
    role_id: string;
  };
};

export type AddCandidateCompaniesCompanyIdRolesRoleIdCandidatesPostResponse =
  CandidateRole | null;

export type AddCandidateCompaniesCompanyIdRolesRoleIdCandidatesPostError =
  HTTPValidationError;

export type ListCandidatesCompaniesCompanyIdRolesRoleIdCandidatesGetData = {
  path: {
    company_id: string;
    role_id: string;
  };
};

export type ListCandidatesCompaniesCompanyIdRolesRoleIdCandidatesGetResponse =
  Array<CandidateRole>;

export type ListCandidatesCompaniesCompanyIdRolesRoleIdCandidatesGetError =
  HTTPValidationError;

export type UpdateCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPutData =
  {
    body: CandidateRoleUpdate;
    path: {
      candidate_id: string;
      company_id: string;
      role_id: string;
    };
  };

export type UpdateCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPutResponse =
  CandidateRole | null;

export type UpdateCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPutError =
  HTTPValidationError;

export type GetCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGetData =
  {
    path: {
      candidate_id: string;
      company_id: string;
      role_id: string;
    };
  };

export type GetCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGetResponse =
  CandidateRole | null;

export type GetCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGetError =
  HTTPValidationError;

export type DeleteCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdDeleteData =
  {
    path: {
      candidate_id: string;
      company_id: string;
      role_id: string;
    };
  };

export type DeleteCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdDeleteResponse =
  CandidateRole;

export type DeleteCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdDeleteError =
  HTTPValidationError;

export type GenerateCandidateRoleDescriptionCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGenerateDescriptionPostData =
  {
    path: {
      candidate_id: string;
      company_id: string;
      role_id: string;
    };
  };

export type GenerateCandidateRoleDescriptionCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGenerateDescriptionPostResponse =
  string | null;

export type GenerateCandidateRoleDescriptionCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGenerateDescriptionPostError =
  HTTPValidationError;

export type ListCandidatesCandidatesGetResponse = Array<CandidateWithId>;

export type ListCandidatesCandidatesGetError = unknown;

export type CreateCandidateCandidatesPostData = {
  body: CandidateCreate;
};

export type CreateCandidateCandidatesPostResponse = string;

export type CreateCandidateCandidatesPostError = HTTPValidationError;

export type GetCandidateCandidatesCandidateIdGetData = {
  path: {
    candidate_id: string;
  };
};

export type GetCandidateCandidatesCandidateIdGetResponse = Candidate | null;

export type GetCandidateCandidatesCandidateIdGetError = HTTPValidationError;

export type UpdateCandidateCandidatesCandidateIdPutData = {
  body: CandidateUpdate;
  path: {
    candidate_id: string;
  };
};

export type UpdateCandidateCandidatesCandidateIdPutResponse = Candidate;

export type UpdateCandidateCandidatesCandidateIdPutError = HTTPValidationError;

export type DeleteCandidateCandidatesCandidateIdDeleteData = {
  path: {
    candidate_id: string;
  };
};

export type DeleteCandidateCandidatesCandidateIdDeleteResponse = Candidate;

export type DeleteCandidateCandidatesCandidateIdDeleteError =
  HTTPValidationError;

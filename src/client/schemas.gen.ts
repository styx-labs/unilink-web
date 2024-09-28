// This file is auto-generated by @hey-api/openapi-ts

export const CandidateSchema = {
    properties: {
        candidate_first_name: {
            type: 'string',
            title: 'Candidate First Name'
        },
        candidate_last_name: {
            type: 'string',
            title: 'Candidate Last Name'
        },
        candidate_desc: {
            type: 'string',
            title: 'Candidate Desc'
        },
        linkedin: {
            type: 'string',
            title: 'Linkedin'
        },
        resume: {
            type: 'string',
            title: 'Resume'
        },
        email: {
            type: 'string',
            title: 'Email'
        },
        phone_number: {
            type: 'string',
            title: 'Phone Number'
        },
        github: {
            type: 'string',
            title: 'Github'
        },
        requires_sponsorship: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Requires Sponsorship'
        },
        authorized_us: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Authorized Us'
        },
        github_rating: {
            anyOf: [
                {
                    type: 'object'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Github Rating'
        },
        portfolio: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Portfolio'
        },
        portfolio_rating: {
            anyOf: [
                {
                    type: 'object'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Portfolio Rating'
        },
        grad_year: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Grad Year'
        },
        grad_month: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Grad Month'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        },
        generated_desc: {
            type: 'string',
            title: 'Generated Desc'
        }
    },
    type: 'object',
    required: ['candidate_first_name', 'candidate_last_name', 'candidate_desc', 'linkedin', 'resume', 'email', 'phone_number', 'github', 'created_at', 'updated_at', 'generated_desc'],
    title: 'Candidate'
} as const;

export const CandidateCreateSchema = {
    properties: {
        candidate_first_name: {
            type: 'string',
            title: 'Candidate First Name'
        },
        candidate_last_name: {
            type: 'string',
            title: 'Candidate Last Name'
        },
        candidate_desc: {
            type: 'string',
            title: 'Candidate Desc'
        },
        linkedin: {
            type: 'string',
            title: 'Linkedin'
        },
        resume: {
            type: 'string',
            title: 'Resume'
        },
        email: {
            type: 'string',
            title: 'Email'
        },
        phone_number: {
            type: 'string',
            title: 'Phone Number'
        },
        github: {
            type: 'string',
            title: 'Github'
        },
        requires_sponsorship: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Requires Sponsorship'
        },
        authorized_us: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Authorized Us'
        },
        github_rating: {
            anyOf: [
                {
                    type: 'object'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Github Rating'
        },
        portfolio: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Portfolio'
        },
        portfolio_rating: {
            anyOf: [
                {
                    type: 'object'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Portfolio Rating'
        },
        grad_year: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Grad Year'
        },
        grad_month: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Grad Month'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        },
        generated_desc: {
            type: 'string',
            title: 'Generated Desc',
            default: ''
        }
    },
    type: 'object',
    required: ['candidate_first_name', 'candidate_last_name', 'candidate_desc', 'linkedin', 'resume', 'email', 'phone_number', 'github'],
    title: 'CandidateCreate'
} as const;

export const CandidateRoleSchema = {
    properties: {
        candidate_id: {
            type: 'string',
            title: 'Candidate Id'
        },
        candidate_role_status: {
            allOf: [
                {
                    '$ref': '#/components/schemas/CandidateRoleStatus'
                }
            ],
            default: 'Outreach'
        },
        candidate_role_notes: {
            anyOf: [
                {
                    items: {
                        '$ref': '#/components/schemas/CandidateRoleNote'
                    },
                    type: 'array'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Candidate Role Notes'
        },
        criteria_scores: {
            anyOf: [
                {
                    items: {
                        '$ref': '#/components/schemas/CriteriaScoringItem'
                    },
                    type: 'array'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Criteria Scores'
        },
        candidate_role_generated_description: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Candidate Role Generated Description'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        },
        candidate: {
            anyOf: [
                {
                    '$ref': '#/components/schemas/Candidate'
                },
                {
                    type: 'null'
                }
            ],
            readOnly: true
        }
    },
    type: 'object',
    required: ['candidate_id', 'created_at', 'updated_at', 'candidate'],
    title: 'CandidateRole'
} as const;

export const CandidateRoleCreateSchema = {
    properties: {
        candidate_id: {
            type: 'string',
            title: 'Candidate Id'
        },
        candidate_role_status: {
            allOf: [
                {
                    '$ref': '#/components/schemas/CandidateRoleStatus'
                }
            ],
            default: 'Outreach'
        },
        candidate_role_notes: {
            anyOf: [
                {
                    items: {
                        '$ref': '#/components/schemas/CandidateRoleNote'
                    },
                    type: 'array'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Candidate Role Notes'
        },
        criteria_scores: {
            anyOf: [
                {
                    items: {
                        '$ref': '#/components/schemas/CriteriaScoringItem'
                    },
                    type: 'array'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Criteria Scores'
        },
        candidate_role_generated_description: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Candidate Role Generated Description'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        }
    },
    type: 'object',
    required: ['candidate_id'],
    title: 'CandidateRoleCreate'
} as const;

export const CandidateRoleNoteSchema = {
    properties: {
        type: {
            '$ref': '#/components/schemas/CandidateRoleNoteType'
        },
        notes: {
            type: 'string',
            title: 'Notes'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        }
    },
    type: 'object',
    required: ['type', 'notes'],
    title: 'CandidateRoleNote'
} as const;

export const CandidateRoleNoteTypeSchema = {
    type: 'string',
    enum: ['Takehome Assignment', 'Email', 'Phone Screen', 'Other'],
    title: 'CandidateRoleNoteType'
} as const;

export const CandidateRoleStatusSchema = {
    type: 'string',
    enum: ['Outreach', 'Screening', 'Sent', 'Interview', 'Offer', 'Hired', 'Rejected'],
    title: 'CandidateRoleStatus'
} as const;

export const CandidateRoleUpdateSchema = {
    properties: {
        candidate_id: {
            type: 'string',
            title: 'Candidate Id'
        },
        candidate_role_status: {
            allOf: [
                {
                    '$ref': '#/components/schemas/CandidateRoleStatus'
                }
            ],
            default: 'Outreach'
        },
        candidate_role_notes: {
            anyOf: [
                {
                    items: {
                        '$ref': '#/components/schemas/CandidateRoleNote'
                    },
                    type: 'array'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Candidate Role Notes'
        },
        criteria_scores: {
            anyOf: [
                {
                    items: {
                        '$ref': '#/components/schemas/CriteriaScoringItem'
                    },
                    type: 'array'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Criteria Scores'
        },
        candidate_role_generated_description: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Candidate Role Generated Description'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        }
    },
    type: 'object',
    required: ['candidate_id'],
    title: 'CandidateRoleUpdate'
} as const;

export const CandidateUpdateSchema = {
    properties: {
        candidate_first_name: {
            type: 'string',
            title: 'Candidate First Name'
        },
        candidate_last_name: {
            type: 'string',
            title: 'Candidate Last Name'
        },
        candidate_desc: {
            type: 'string',
            title: 'Candidate Desc'
        },
        linkedin: {
            type: 'string',
            title: 'Linkedin'
        },
        resume: {
            type: 'string',
            title: 'Resume'
        },
        email: {
            type: 'string',
            title: 'Email'
        },
        phone_number: {
            type: 'string',
            title: 'Phone Number'
        },
        github: {
            type: 'string',
            title: 'Github'
        },
        requires_sponsorship: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Requires Sponsorship'
        },
        authorized_us: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Authorized Us'
        },
        github_rating: {
            anyOf: [
                {
                    type: 'object'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Github Rating'
        },
        portfolio: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Portfolio'
        },
        portfolio_rating: {
            anyOf: [
                {
                    type: 'object'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Portfolio Rating'
        },
        grad_year: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Grad Year'
        },
        grad_month: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Grad Month'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        }
    },
    type: 'object',
    required: ['candidate_first_name', 'candidate_last_name', 'candidate_desc', 'linkedin', 'resume', 'email', 'phone_number', 'github'],
    title: 'CandidateUpdate'
} as const;

export const CandidateWithIdSchema = {
    properties: {
        candidate_first_name: {
            type: 'string',
            title: 'Candidate First Name'
        },
        candidate_last_name: {
            type: 'string',
            title: 'Candidate Last Name'
        },
        candidate_desc: {
            type: 'string',
            title: 'Candidate Desc'
        },
        linkedin: {
            type: 'string',
            title: 'Linkedin'
        },
        resume: {
            type: 'string',
            title: 'Resume'
        },
        email: {
            type: 'string',
            title: 'Email'
        },
        phone_number: {
            type: 'string',
            title: 'Phone Number'
        },
        github: {
            type: 'string',
            title: 'Github'
        },
        requires_sponsorship: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Requires Sponsorship'
        },
        authorized_us: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Authorized Us'
        },
        github_rating: {
            anyOf: [
                {
                    type: 'object'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Github Rating'
        },
        portfolio: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Portfolio'
        },
        portfolio_rating: {
            anyOf: [
                {
                    type: 'object'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Portfolio Rating'
        },
        grad_year: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Grad Year'
        },
        grad_month: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Grad Month'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        },
        generated_desc: {
            type: 'string',
            title: 'Generated Desc'
        },
        candidate_id: {
            type: 'string',
            title: 'Candidate Id'
        }
    },
    type: 'object',
    required: ['candidate_first_name', 'candidate_last_name', 'candidate_desc', 'linkedin', 'resume', 'email', 'phone_number', 'github', 'created_at', 'updated_at', 'generated_desc', 'candidate_id'],
    title: 'CandidateWithId'
} as const;

export const CompanySchema = {
    properties: {
        status: {
            allOf: [
                {
                    '$ref': '#/components/schemas/CompanyStatus'
                }
            ],
            default: 'Active'
        },
        company_name: {
            type: 'string',
            title: 'Company Name'
        },
        company_desc: {
            type: 'string',
            title: 'Company Desc'
        },
        founders: {
            items: {
                '$ref': '#/components/schemas/CompanyFounder'
            },
            type: 'array',
            title: 'Founders'
        },
        contract_size: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Contract Size'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        }
    },
    type: 'object',
    required: ['company_name', 'company_desc', 'founders', 'created_at', 'updated_at'],
    title: 'Company'
} as const;

export const CompanyCreateSchema = {
    properties: {
        status: {
            allOf: [
                {
                    '$ref': '#/components/schemas/CompanyStatus'
                }
            ],
            default: 'Active'
        },
        company_name: {
            type: 'string',
            title: 'Company Name'
        },
        company_desc: {
            type: 'string',
            title: 'Company Desc'
        },
        founders: {
            items: {
                '$ref': '#/components/schemas/CompanyFounder'
            },
            type: 'array',
            title: 'Founders'
        },
        contract_size: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Contract Size'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        }
    },
    type: 'object',
    required: ['company_name', 'company_desc', 'founders'],
    title: 'CompanyCreate'
} as const;

export const CompanyFounderSchema = {
    properties: {
        founder_name: {
            type: 'string',
            title: 'Founder Name'
        },
        founder_role: {
            type: 'string',
            title: 'Founder Role'
        },
        founder_email: {
            type: 'string',
            title: 'Founder Email'
        },
        founder_phone: {
            type: 'string',
            title: 'Founder Phone'
        },
        founder_linkedin_url: {
            type: 'string',
            title: 'Founder Linkedin Url'
        }
    },
    type: 'object',
    required: ['founder_name', 'founder_role', 'founder_email', 'founder_phone', 'founder_linkedin_url'],
    title: 'CompanyFounder'
} as const;

export const CompanyStatusSchema = {
    type: 'string',
    enum: ['Active', 'Inactive', 'Pending'],
    title: 'CompanyStatus'
} as const;

export const CompanyUpdateSchema = {
    properties: {
        status: {
            allOf: [
                {
                    '$ref': '#/components/schemas/CompanyStatus'
                }
            ],
            default: 'Active'
        },
        company_name: {
            type: 'string',
            title: 'Company Name'
        },
        company_desc: {
            type: 'string',
            title: 'Company Desc'
        },
        founders: {
            items: {
                '$ref': '#/components/schemas/CompanyFounder'
            },
            type: 'array',
            title: 'Founders'
        },
        contract_size: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Contract Size'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        }
    },
    type: 'object',
    required: ['company_name', 'company_desc', 'founders'],
    title: 'CompanyUpdate'
} as const;

export const CompanyWithIdSchema = {
    properties: {
        status: {
            allOf: [
                {
                    '$ref': '#/components/schemas/CompanyStatus'
                }
            ],
            default: 'Active'
        },
        company_name: {
            type: 'string',
            title: 'Company Name'
        },
        company_desc: {
            type: 'string',
            title: 'Company Desc'
        },
        founders: {
            items: {
                '$ref': '#/components/schemas/CompanyFounder'
            },
            type: 'array',
            title: 'Founders'
        },
        contract_size: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Contract Size'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        },
        company_id: {
            type: 'string',
            title: 'Company Id'
        },
        roles_count: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Roles Count'
        }
    },
    type: 'object',
    required: ['company_name', 'company_desc', 'founders', 'created_at', 'updated_at', 'company_id'],
    title: 'CompanyWithId'
} as const;

export const CriteriaScoringItemSchema = {
    properties: {
        criteria_name: {
            type: 'string',
            title: 'Criteria Name'
        },
        score: {
            type: 'number',
            title: 'Score'
        }
    },
    type: 'object',
    required: ['criteria_name', 'score'],
    title: 'CriteriaScoringItem'
} as const;

export const FindCandidatesBodySchema = {
    properties: {
        n: {
            type: 'integer',
            title: 'N'
        },
        grad_years: {
            anyOf: [
                {
                    items: {
                        type: 'string'
                    },
                    type: 'array'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Grad Years'
        }
    },
    type: 'object',
    required: ['n'],
    title: 'FindCandidatesBody'
} as const;

export const HTTPValidationErrorSchema = {
    properties: {
        detail: {
            items: {
                '$ref': '#/components/schemas/ValidationError'
            },
            type: 'array',
            title: 'Detail'
        }
    },
    type: 'object',
    title: 'HTTPValidationError'
} as const;

export const RoleSchema = {
    properties: {
        role_name: {
            type: 'string',
            title: 'Role Name'
        },
        role_desc: {
            type: 'string',
            title: 'Role Desc'
        },
        role_requirements: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Role Requirements'
        },
        role_status: {
            allOf: [
                {
                    '$ref': '#/components/schemas/RoleStatus'
                }
            ],
            default: 'Open'
        },
        role_criteria: {
            items: {
                '$ref': '#/components/schemas/RoleCriteria'
            },
            type: 'array',
            title: 'Role Criteria'
        },
        meeting_link: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Meeting Link'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        }
    },
    type: 'object',
    required: ['role_name', 'role_desc', 'created_at', 'updated_at'],
    title: 'Role'
} as const;

export const RoleCreateSchema = {
    properties: {
        role_name: {
            type: 'string',
            title: 'Role Name'
        },
        role_desc: {
            type: 'string',
            title: 'Role Desc'
        },
        role_requirements: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Role Requirements'
        },
        role_status: {
            allOf: [
                {
                    '$ref': '#/components/schemas/RoleStatus'
                }
            ],
            default: 'Open'
        },
        role_criteria: {
            items: {
                '$ref': '#/components/schemas/RoleCriteria'
            },
            type: 'array',
            title: 'Role Criteria'
        },
        meeting_link: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Meeting Link'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        },
        is_open: {
            type: 'boolean',
            title: 'Is Open',
            default: true
        }
    },
    type: 'object',
    required: ['role_name', 'role_desc'],
    title: 'RoleCreate'
} as const;

export const RoleCriteriaSchema = {
    properties: {
        criteria_name: {
            type: 'string',
            title: 'Criteria Name'
        }
    },
    type: 'object',
    required: ['criteria_name'],
    title: 'RoleCriteria'
} as const;

export const RoleStatusSchema = {
    type: 'string',
    enum: ['Open', 'In Review', 'Closed Filled', 'Closed Unfilled', 'Closed Cancelled'],
    title: 'RoleStatus'
} as const;

export const RoleUpdateSchema = {
    properties: {
        role_name: {
            type: 'string',
            title: 'Role Name'
        },
        role_desc: {
            type: 'string',
            title: 'Role Desc'
        },
        role_requirements: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Role Requirements'
        },
        role_status: {
            allOf: [
                {
                    '$ref': '#/components/schemas/RoleStatus'
                }
            ],
            default: 'Open'
        },
        role_criteria: {
            items: {
                '$ref': '#/components/schemas/RoleCriteria'
            },
            type: 'array',
            title: 'Role Criteria'
        },
        meeting_link: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Meeting Link'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        }
    },
    type: 'object',
    required: ['role_name', 'role_desc'],
    title: 'RoleUpdate'
} as const;

export const RoleWithIdSchema = {
    properties: {
        role_name: {
            type: 'string',
            title: 'Role Name'
        },
        role_desc: {
            type: 'string',
            title: 'Role Desc'
        },
        role_requirements: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Role Requirements'
        },
        role_status: {
            allOf: [
                {
                    '$ref': '#/components/schemas/RoleStatus'
                }
            ],
            default: 'Open'
        },
        role_criteria: {
            items: {
                '$ref': '#/components/schemas/RoleCriteria'
            },
            type: 'array',
            title: 'Role Criteria'
        },
        meeting_link: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Meeting Link'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At'
        },
        role_id: {
            type: 'string',
            title: 'Role Id'
        },
        candidates_interview_count: {
            type: 'integer',
            title: 'Candidates Interview Count'
        },
        candidates_sent_count: {
            type: 'integer',
            title: 'Candidates Sent Count'
        }
    },
    type: 'object',
    required: ['role_name', 'role_desc', 'created_at', 'updated_at', 'role_id', 'candidates_interview_count', 'candidates_sent_count'],
    title: 'RoleWithId'
} as const;

export const ValidationErrorSchema = {
    properties: {
        loc: {
            items: {
                anyOf: [
                    {
                        type: 'string'
                    },
                    {
                        type: 'integer'
                    }
                ]
            },
            type: 'array',
            title: 'Location'
        },
        msg: {
            type: 'string',
            title: 'Message'
        },
        type: {
            type: 'string',
            title: 'Error Type'
        }
    },
    type: 'object',
    required: ['loc', 'msg', 'type'],
    title: 'ValidationError'
} as const;
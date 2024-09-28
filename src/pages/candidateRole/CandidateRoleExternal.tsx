import { CandidateForm } from "../candidates/CandidateForm";
import {
    CandidateWithId,
    CandidateCreate,
    Company,
    Role,
  } from "../../client/types.gen";
import {
    createCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCreatePost, 
    getCompanyEndpointCompaniesCompanyIdGet,
    getRoleEndpointCompaniesCompanyIdRolesRoleIdGet
} from "../../client/services.gen";
import {CandidateCreateSchema} from "../../client/schemas.gen";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Video } from 'lucide-react';
import { useNavigate } from "react-router-dom";


function CandidateRoleExternal() {
    const navigate = useNavigate();
    const { companyId, roleId } = useParams();
    const [company, setCompany] = useState<Company>();
    const [role, setRole] = useState<Role>();

    useEffect(() => {
        getCompany();
        getRole();
      }, [companyId, roleId]);

    const getCompany = async () => {
        const { data, error } = await getCompanyEndpointCompaniesCompanyIdGet({
            path: { company_id: companyId || "" },
          });;
        if (error) {
            console.error("Error fetching companies:", error);
        } else {
            setCompany(data!);
        }
    };

    const getRole = async () => {
        const { data, error } = await getRoleEndpointCompaniesCompanyIdRolesRoleIdGet({
            path: { company_id: companyId || "", role_id: roleId || "" },
          });;
        if (error) {
            console.error("Error fetching companies:", error);
        } else {
            setRole(data!);
        }
    };

    const addCandidate = async (newCandidate: Partial<CandidateWithId>) => {
        const completeCandidate = Object.keys(
          CandidateCreateSchema.properties
        ).reduce((acc, key) => {
          if (
            key !== "created_at" &&
            key !== "updated_at" &&
            key !== "github_rating" &&
            key !== "portfolio_rating" &&
            key !== "requires_sponsorship" &&
            key !== "authorized_us"
          ) {
            acc[key as keyof CandidateCreate] =
              (newCandidate[key as keyof CandidateCreate] as any) ?? "";
          }
          return acc;
        }, {} as Partial<CandidateCreate>);
    
        const { error } =
          await createCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCreatePost(
            {
              path: { company_id: companyId || "", role_id: roleId || "" },
              body: completeCandidate as CandidateCreate,
            }
          );
        if (error) {
          console.error("Error adding candidate:", error);
        }
      };

    const handleSubmit = async (submittedCandidate: Partial<CandidateWithId>) => {
        try {
            await addCandidate(submittedCandidate as CandidateWithId);
            navigate("/submission-success");
        } catch (error) {
            console.error("Error submitting candidate:", error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
                {company && role && (
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">{role.role_name + " at " + company.company_name}</h1>
                        <h2 className="text-xl font-semibold mb-2">About the company</h2>
                        <p className="mb-4 whitespace-pre-wrap">{company.company_desc}</p>
                        <h2 className="text-xl font-semibold mb-2">About the role</h2>
                        <p className="mb-4 whitespace-pre-wrap">{role.role_desc}</p>
                        {role.role_requirements && (
                            <>
                                <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                                <p className="mb-4 whitespace-pre-wrap">{role.role_requirements}</p>
                            </>
                        )}
                        <hr className="my-6 border-t border-gray-300" />
                        <h3 className="text-l font-semibold mb-2">If you're interested, please schedule an interview with our team at UniLink <u>and</u> fill out your information below!</h3>
                        <hr className="my-6 border-t border-gray-300" />
                        {role.meeting_link && (
                            <a href={role.meeting_link} target="_blank" rel="noopener noreferrer">
                                <Button>
                                    <Video className="mr-2 h-5 w-5" />Schedule Interview
                                </Button>
                            </a>
                        )}
                    </div>
                )}
                <CandidateForm
                    candidate={{}}
                    onSubmit={handleSubmit}
                    open={true}
                    onOpenChange={() => {}}
                    title="New Candidate"
                    description=""
                    internal={false}
                />
            </div>
        </div>
    );
}

export default CandidateRoleExternal;
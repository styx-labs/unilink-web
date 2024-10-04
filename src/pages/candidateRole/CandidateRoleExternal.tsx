import { CandidateForm } from "../candidates/CandidateForm";
import { CandidateWithId, Company, Role } from "../../client/types.gen";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCandidateRoles } from "../../hooks/useCandidateRoles";
import { useRoles } from "../../hooks/useRoles";
import { useCompanies } from "../../hooks/useCompanies";
import { Loader } from "../../components/ui/loader";
import Cal from "@calcom/embed-react";

function CandidateRoleExternal() {
  const { companyId, roleId } = useParams();
  const [company, setCompany] = useState<Company>();
  const [role, setRole] = useState<Role>();
  const { addCandidate } = useCandidateRoles();
  const { getRole } = useRoles();
  const { getCompany } = useCompanies();
  const [candidateSubmitted, setCandidateSubmitted] = useState(false);
  const [submittedCandidate, setSubmittedCandidate] =
    useState<CandidateWithId | null>(null);

  useEffect(() => {
    getCompany(companyId!).then((company) => setCompany(company!));
    getRole(roleId!).then((role) => setRole(role!));
  }, [companyId, roleId]);

  const handleSubmit = async (submittedCandidate: Partial<CandidateWithId>) => {
    try {
      await addCandidate(submittedCandidate);
      setSubmittedCandidate(submittedCandidate as CandidateWithId);
      setCandidateSubmitted(true);
    } catch (error) {
      console.error("Error submitting candidate:", error);
    }
  };

  const extractCalLink = (url: string) => {
    const urlObj = new URL(url);
    return urlObj.pathname.slice(1);
  };

  if (!company || !role) {
    return <Loader />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        {!candidateSubmitted ? (
          <>
            {company && role && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">
                  {role.role_name + " at " + company.company_name}
                </h1>
                <h2 className="text-xl font-semibold mb-2">
                  About the company
                </h2>
                <p className="mb-4 whitespace-pre-wrap">
                  {company.company_desc}
                </p>
                <h2 className="text-xl font-semibold mb-2">About the role</h2>
                <p className="mb-4 whitespace-pre-wrap">{role.role_desc}</p>
                {role.role_requirements && (
                  <>
                    <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                    <p className="mb-4 whitespace-pre-wrap">
                      {role.role_requirements}
                    </p>
                  </>
                )}
                <hr className="my-6 border-t border-gray-300" />
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
          </>
        ) : (
          <>
            {role?.meeting_link ? (
              submittedCandidate && (
                <>
                  <h2 className="text-xl font-semibold mb-2">
                    Thank you for submitting your information. Please schedule
                    your interview below.
                  </h2>
                  <Cal
                    calLink={extractCalLink(role.meeting_link)}
                    config={{
                      theme: "light",
                      hideEventTypeDetails: "true",
                      layout: "month_view",
                      name: `${submittedCandidate.candidate_first_name} ${submittedCandidate.candidate_last_name}`,
                      location: JSON.stringify({
                        value: "phone",
                        optionValue: submittedCandidate.phone_number || "",
                      }),
                      email: submittedCandidate.email || "",
                      github: submittedCandidate.github || "",
                      resume: submittedCandidate.resume || "",
                    }}
                  />
                </>
              )
            ) : (
              <h2 className="text-xl font-semibold mb-2">
                Thank you for submitting your information. A member of our team
                will reach out to you soon.
              </h2>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CandidateRoleExternal;

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DataTable from "../../components/DataTable";
import { useParams } from "react-router-dom";
import { RoleWithId } from "../../client/types.gen";
import { RoleForm } from "./RoleForm";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../../components/ui/loader";
import { useRoles } from "../../hooks/useRoles";
import { CompanyWithId } from "../../client/types.gen";
import { useCompanies } from "../../hooks/useCompanies";

function CompanyInfo({ company }: { company: CompanyWithId }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {company.company_name}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        {company.company_desc}
      </p>
    </div>
  );
}

function RoleList() {
  const { companyId } = useParams();
  const { getCompany } = useCompanies();
  const [company, setCompany] = useState<CompanyWithId | null>(null);
  const { roles, loading, hasMore, addRole, updateRole, deleteRole, loadMore } =
    useRoles();
  const [formData, setFormData] = useState<{
    role: Partial<RoleWithId>;
    isOpen: boolean;
    isEditing: boolean;
  }>({
    role: {},
    isOpen: false,
    isEditing: false,
  });

  useEffect(() => {
    if (companyId) {
      getCompany(companyId).then((fetchedCompany) => {
        if (fetchedCompany) {
          setCompany(fetchedCompany as CompanyWithId);
        }
      });
    }
  }, [companyId]);

  const openAddForm = () => {
    setFormData({ role: {}, isOpen: true, isEditing: false });
  };

  const openEditForm = (role: RoleWithId) => {
    setFormData({ role, isOpen: true, isEditing: true });
  };

  const closeForm = () => {
    setFormData({ role: {}, isOpen: false, isEditing: false });
  };

  const handleSubmit = async (submittedRole: Partial<RoleWithId>) => {
    if (formData.isEditing) {
      await updateRole(submittedRole as RoleWithId);
    } else {
      await addRole(submittedRole);
    }
    closeForm();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <BreadCrumbs
        items={[
          { label: "Companies", path: "/" },
          { label: "Roles", path: `/companies/${companyId}/roles` },
        ]}
      />
      <div className="p-4">
        {company && <CompanyInfo company={company} />}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Roles
          </h2>
          <Button onClick={openAddForm}>
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </Button>
        </div>
        <div id="scrollableDiv" style={{ height: "80vh", overflow: "auto" }}>
          <InfiniteScroll
            dataLength={roles.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center items-center p-4">
                <Loader />
              </div>
            }
            scrollableTarget="scrollableDiv"
          >
            <DataTable
              columns={[
                { key: "role_status", label: "Status" },
                { key: "role_name", label: "Title" },
                {
                  key: "candidates_interview_count",
                  label: "Candidates Interviewed",
                },
                { key: "candidates_sent_count", label: "Candidates Sent" },
              ]}
              data={roles}
              onEdit={openEditForm}
              onDelete={deleteRole}
              detailsPath={(role) =>
                `/companies/${companyId}/roles/${role.role_id}/candidates`
              }
              idField="role_id"
              isLoading={loading}
            />
          </InfiniteScroll>
        </div>
      </div>

      <RoleForm
        role={formData.role}
        onSubmit={handleSubmit}
        open={formData.isOpen}
        onOpenChange={closeForm}
        title={formData.isEditing ? "Edit Role" : "Add Role"}
        description={
          formData.isEditing
            ? "Make changes to the role here."
            : "Enter the details for the new role here."
        }
      />
    </div>
  );
}

export default RoleList;

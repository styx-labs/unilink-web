import { useState } from "react";

import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../../components/DataTable";
import { Loader } from "../../components/ui/loader";
import BreadCrumbs from "../../components/breadcrumbs";
import InfiniteScroll from "react-infinite-scroll-component";

import { CompanyForm } from "./CompanyForm";
import { CompanyWithId, CompanyFounder } from "../../client/types.gen";
import { useCompanies } from "../../hooks/useCompanies";

function CompanyList() {
  const {
    companies,
    loading,
    hasMore,
    addCompany,
    updateCompany,
    deleteCompany,
    loadMore,
  } = useCompanies();
  const [formData, setFormData] = useState<{
    company: Partial<CompanyWithId>;
    isOpen: boolean;
    isEditing: boolean;
  }>({
    company: {},
    isOpen: false,
    isEditing: false,
  });

  const openAddForm = () => {
    setFormData({ company: {}, isOpen: true, isEditing: false });
  };

  const openEditForm = (company: CompanyWithId) => {
    setFormData({ company, isOpen: true, isEditing: true });
  };

  const closeForm = () => {
    setFormData({ company: {}, isOpen: false, isEditing: false });
  };

  const handleSubmit = async (submittedCompany: Partial<CompanyWithId>) => {
    if (formData.isEditing) {
      await updateCompany(submittedCompany as CompanyWithId);
    } else {
      await addCompany(submittedCompany);
    }
    closeForm();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <BreadCrumbs items={[{ label: "Companies", path: "/" }]} />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Companies
          </h2>
          <Button onClick={openAddForm}>
            <Plus className="mr-2 h-4 w-4" /> Add Company
          </Button>
        </div>
        <div id="scrollableDiv" style={{ height: "80vh", overflow: "auto" }}>
          <InfiniteScroll
            dataLength={companies.length}
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
                { key: "status", label: "Status" },
                { key: "company_name", label: "Company Name" },
                { key: "contract_size", label: "Contract Size" },
                {
                  key: "founders",
                  label: "Point of Contact",
                  render: (founders: CompanyFounder[]) =>
                    founders.map((f) => f.founder_name).join(", "),
                },
                { key: "roles_count", label: "Number of Roles" },
              ]}
              data={companies}
              onEdit={openEditForm}
              onDelete={deleteCompany}
              detailsPath={(company: CompanyWithId) =>
                `/companies/${company.company_id}/roles`
              }
              idField="company_id"
              isLoading={loading}
            />
          </InfiniteScroll>
        </div>
      </div>

      <CompanyForm
        company={formData.company}
        onSubmit={handleSubmit}
        open={formData.isOpen}
        onOpenChange={closeForm}
        title={formData.isEditing ? "Edit Company" : "Add Company"}
        description={
          formData.isEditing
            ? "Make changes to the company here."
            : "Enter the details for the new company here."
        }
      />
    </div>
  );
}

export default CompanyList;

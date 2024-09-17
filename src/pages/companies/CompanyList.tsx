import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../../components/DataTable";
import { CompanyForm } from "./CompanyForm";
import {
  CompanyWithId,
  CompanyFounder,
  CompanyCreate,
  CompanyUpdate,
  CompanyStatus,
} from "../../client/types.gen";
import {
  listCompaniesCompaniesGet,
  createCompanyCompaniesPost,
  updateCompanyCompaniesCompanyIdPut,
  deleteCompanyCompaniesCompanyIdDelete,
} from "../../client/services.gen";
function CompanyList() {
  const [companies, setCompanies] = useState<CompanyWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    const { data, error } = await listCompaniesCompaniesGet();
    if (error) {
      console.error("Error fetching companies:", error);
    } else {
      setCompanies(data!);
    }
    setLoading(false);
  };

  const addCompany = async (newCompany: Partial<CompanyWithId>) => {
    const completeCompany: CompanyCreate = {
      company_name: newCompany.company_name ?? "",
      company_desc: newCompany.company_desc ?? "",
      founders: newCompany.founders ?? [],
      contract_size: newCompany.contract_size ?? "",
      status: newCompany.status ?? CompanyStatus.PENDING,
    };

    const { error } = await createCompanyCompaniesPost({
      body: completeCompany as CompanyCreate,
    });
    if (error) {
      console.error("Error adding company:", error);
    } else {
      fetchCompanies();
    }
  };

  const updateCompany = async (editingCompany: CompanyWithId) => {
    const completeCompany: CompanyUpdate = {
      company_name: editingCompany.company_name ?? "",
      company_desc: editingCompany.company_desc ?? "",
      founders: editingCompany.founders ?? [],
      contract_size: editingCompany.contract_size ?? "",
      status: editingCompany.status ?? CompanyStatus.PENDING,
    };

    const { error } = await updateCompanyCompaniesCompanyIdPut({
      body: completeCompany as CompanyUpdate,
      path: { company_id: editingCompany.company_id },
    });
    if (error) {
      console.error("Error updating company:", error);
    } else {
      setCompanies(
        companies.map((company) =>
          company.company_id === editingCompany.company_id
            ? editingCompany
            : company
        )
      );
    }
  };

  const deleteCompany = async (id: string) => {
    const { error } = await deleteCompanyCompaniesCompanyIdDelete({
      path: { company_id: id },
    });
    if (error) {
      console.error("Error deleting company:", error);
    } else {
      setCompanies(companies.filter((company) => company.company_id !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Companies
          </h2>
          <Button onClick={openAddForm}>
            <Plus className="mr-2 h-4 w-4" /> Add Company
          </Button>
        </div>
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

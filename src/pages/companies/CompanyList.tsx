import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../../components/DataTable";
import api from "../../api/axiosConfig";
import { Company, CompanyFounder } from "../../lib/types";
import { CompanyForm } from "./CompanyForm";

function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<{
    company: Partial<Company>;
    isOpen: boolean;
    isEditing: boolean;
  }>({
    company: {},
    isOpen: false,
    isEditing: false,
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.get<Company[]>("/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setFormData({ company: {}, isOpen: true, isEditing: false });
  };

  const openEditForm = (company: Company) => {
    setFormData({ company, isOpen: true, isEditing: true });
  };

  const closeForm = () => {
    setFormData({ company: {}, isOpen: false, isEditing: false });
  };

  const handleSubmit = async (submittedCompany: Partial<Company>) => {
    if (formData.isEditing) {
      await updateCompany(submittedCompany as Company);
    } else {
      await addCompany(submittedCompany);
    }
    closeForm();
  };

  const addCompany = async (newCompany: Partial<Company>) => {
    try {
      const completeCompany = {
        company_name: newCompany.company_name || "",
        company_desc: newCompany.company_desc || "",
        founders: newCompany.founders || [],
      };
      await api.post("/companies", completeCompany);
      fetchCompanies();
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const updateCompany = async (editingCompany: Company) => {
    try {
      await api.put(`/companies/${editingCompany.company_id}`, editingCompany);
      setCompanies(
        companies.map((company) =>
          company.company_id === editingCompany.company_id
            ? editingCompany
            : company
        )
      );
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      await api.delete(`/companies/${id}`);
      setCompanies(companies.filter((company) => company.company_id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
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
            { key: "company_name", label: "Company Name" },
            { key: "company_desc", label: "Description" },
            {
              key: "founders",
              label: "Founders",
              render: (founders: CompanyFounder[]) =>
                founders.map((f) => f.founder_name).join(", "),
            },
          ]}
          data={companies}
          onEdit={openEditForm}
          onDelete={deleteCompany}
          detailsPath={(company: Company) =>
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

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import DialogForm from "../../components/DialogForm";
import DataTable from "../../components/DataTable";
import api from "../../api/axiosConfig";
import { Company, CompanyFounder } from "../../lib/types";

const fields = [
  { id: "company_name", label: "Company Name", type: "input" as const },
  { id: "company_desc", label: "Description", type: "textarea" as const },
  {
    id: "founders",
    label: "Founders",
    type: "founders" as const,
  },
];

function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({});
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
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

  const addCompany = async () => {
    try {
      const completeCompany = fields.reduce((acc, field) => {
        if (field.id === "founders") {
          acc[field.id] = (newCompany[field.id] as CompanyFounder[]) ?? [];
        } else {
          acc[field.id as keyof Omit<Company, "founders">] =
            newCompany[field.id as keyof Omit<Company, "founders">] ?? "";
        }
        return acc;
      }, {} as Partial<Company>);
      await api.post("/companies", completeCompany);
      fetchCompanies();
      setIsAddModalOpen(false);
      setNewCompany({});
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const updateCompany = async () => {
    if (!editingCompany) return;
    try {
      await api.put(`/companies/${editingCompany.company_id}`, editingCompany);
      setCompanies(
        companies.map((company) =>
          company.company_id === editingCompany.company_id
            ? editingCompany
            : company
        )
      );
      setEditingCompany(null);
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
          <Button onClick={() => setIsAddModalOpen(true)}>
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
              render: (founders: CompanyFounder[]) => founders.map(f => f.founder_name).join(", ")
            },
          ]}
          data={companies}
          onEdit={setEditingCompany}
          onDelete={deleteCompany}
          detailsPath={(company: Company) =>
            `/companies/${company.company_id}/roles`
          }
          idField="company_id"
          isLoading={loading}
        />
      </div>

      <DialogForm
        title="Add Company"
        description="Enter the details for the new company here."
        fields={fields}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={addCompany}
        values={newCompany}
        setValues={(newValues) => setEditingCompany(newValues as Company)}
      />

      <DialogForm
        title="Edit Company"
        description="Make changes to the company here."
        fields={fields}
        open={!!editingCompany}
        onOpenChange={() => setEditingCompany(null)}
        onSubmit={updateCompany}
        values={editingCompany || {}}
        setValues={(newValues) => setEditingCompany(newValues as Company)}
      />
    </div>
  );
}

export default CompanyList;

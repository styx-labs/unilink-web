import { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpinner } from "../../components/ui/loader";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DialogForm from "../../components/DialogForm";
import DataTable from "../../components/DataTable";

interface Company {
  company_id: number;
  company_name: string;
  company_desc: string;
  founders: string;
}

const fields = [
  { id: "company_name", label: "Company Name", type: "input" as const },
  { id: "company_desc", label: "Description", type: "textarea" as const },
  { id: "founders", label: "Founders", type: "input" as const },
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
      const response = await axios.get<Company[]>(
        `${process.env.REACT_APP_API_BASE_URL}/companies`
      );
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/companies`,
        newCompany
      );
      fetchCompanies();
      setIsAddModalOpen(false);
      setNewCompany({});
    } catch (error) {
      console.error("Error adding company:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async () => {
    if (!editingCompany) return;
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${editingCompany.company_id}`,
        editingCompany
      );
      fetchCompanies();
      setEditingCompany(null);
    } catch (error) {
      console.error("Error updating company:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${id}`
      );
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <BreadCrumbs items={[{ label: "Companies", path: "/" }]} />
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
            { key: "founders", label: "Founders" },
          ]}
          data={companies}
          onEdit={setEditingCompany}
          onDelete={deleteCompany}
          detailsPath={(company: Company) =>
            `/companies/${company.company_id}/roles`
          }
          idField="company_id"
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
        setValues={setNewCompany}
      />

      <DialogForm
        title="Edit Company"
        description="Make changes to the company here."
        fields={fields}
        open={!!editingCompany}
        onOpenChange={() => setEditingCompany(null)}
        onSubmit={updateCompany}
        values={editingCompany || {}}
        setValues={setEditingCompany}
      />
    </div>
  );
}

export default CompanyList;

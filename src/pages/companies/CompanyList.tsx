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
  listCompaniesEndpointCompaniesGet,
  createCompanyEndpointCompaniesPost,
  updateCompanyEndpointCompaniesCompanyIdPut,
  deleteCompanyEndpointCompaniesCompanyIdDelete,
} from "../../client/services.gen";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../../components/ui/loader";
import BreadCrumbs from "../../components/breadcrumbs";

function CompanyList() {
  const [companies, setCompanies] = useState<CompanyWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [formData, setFormData] = useState<{
    company: Partial<CompanyWithId>;
    isOpen: boolean;
    isEditing: boolean;
  }>({
    company: {},
    isOpen: false,
    isEditing: false,
  });
  const { companyId } = useParams();

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
  }, [companyId]);

  const fetchCompanies = async (cursorParam?: string | null) => {
    setLoading(true);
    const { data, error } = await listCompaniesEndpointCompaniesGet({
      query: {
        cursor: cursorParam || undefined,
        limit: 20,
      },
    });
    if (error) {
      console.error("Error fetching companies:", error);
    } else {
      const [newCompanies, newNextCursor] = data!;
      setCompanies((prev) =>
        cursorParam ? [...prev, ...newCompanies] : newCompanies
      );
      setNextCursor(newNextCursor);
      setHasMore(!!newNextCursor);
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

    const { error } = await createCompanyEndpointCompaniesPost({
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

    const { error } = await updateCompanyEndpointCompaniesCompanyIdPut({
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
    const { error } = await deleteCompanyEndpointCompaniesCompanyIdDelete({
      path: { company_id: id },
    });
    if (error) {
      console.error("Error deleting company:", error);
    } else {
      setCompanies(companies.filter((company) => company.company_id !== id));
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchCompanies(nextCursor);
    }
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

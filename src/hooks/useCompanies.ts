import { useState, useEffect, useCallback } from "react";
import {
  CompanyWithId,
  CompanyCreate,
  CompanyUpdate,
  CompanyStatus,
} from "../client/types.gen";
import {
  listCompaniesEndpointCompaniesGet,
  getCompanyEndpointCompaniesCompanyIdGet,
  createCompanyEndpointCompaniesPost,
  updateCompanyEndpointCompaniesCompanyIdPut,
  deleteCompanyEndpointCompaniesCompanyIdDelete,
} from "../client/services.gen";

export const useCompanies = () => {
  const [companies, setCompanies] = useState<CompanyWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchCompanies = useCallback(async (cursorParam?: string | null) => {
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
  }, []);

  const getCompany = async (companyId: string) => {
    const { data, error } = await getCompanyEndpointCompaniesCompanyIdGet({
      path: { company_id: companyId || "" },
    });
    if (error) {
      console.error("Error fetching company:", error);
    } else {
      return data;
    }
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

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    loading,
    hasMore,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompany,
    loadMore,
  };
};

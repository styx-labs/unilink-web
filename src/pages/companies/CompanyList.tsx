import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ChevronRight, Pencil, Trash2, Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";

interface Company {
  company_id: number;
  company_name: string;
  company_desc: string;
  founders: string;
}

function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  const deleteCompany = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${id}`
      );
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <BreadCrumbs items={[{ label: "Companies", path: "/" }]} />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Companies
          </h2>
          <Link to="/add-company">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Founders</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.company_id}>
                <TableCell>{company.company_name}</TableCell>
                <TableCell>{company.company_desc}</TableCell>
                <TableCell>{company.founders}</TableCell>
                <TableCell>
                  <div className="flex space=-x-2">
                    <Link to={`/companies/${company.company_id}/`}>
                      <Button variant="ghost">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => deleteCompany(company.company_id)}
                    >
                      <Trash2 className="h-4 w-4" />{" "}
                    </Button>
                    <Link to={`/companies/${company.company_id}/edit`}>
                      <Button variant="ghost">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CompanyList;

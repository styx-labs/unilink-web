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
    <div>
      <header>
        <h1>Companies</h1>
        <Link to="/add-company">
          <Button>Add Company</Button>
        </Link>
      </header>
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
                <div>
                  <Link to={`/companies/${company.company_id}/roles`}>
                    <Button variant="ghost">View Roles</Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => deleteCompany(company.company_id)}
                  >
                    Delete
                  </Button>
                  <Link to={`/companies/${company.company_id}/edit`}>
                    <Button variant="ghost">Edit</Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CompanyList;

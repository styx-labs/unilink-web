import { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpinner } from "../../components/ui/loader";
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
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

interface Company {
  company_id: number;
  company_name: string;
  company_desc: string;
  founders: string;
}

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

  const fields = {
    companies: [
      { id: "company_name", label: "Company Name", type: "input" },
      { id: "company_desc", label: "Description", type: "textarea" },
      { id: "founders", label: "Founders", type: "input" },
    ],
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
        {companies.length > 0 ? (
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
                    <div className="flex space-x-2">
                      <Link to={`/companies/${company.company_id}/roles`}>
                        <Button variant="ghost">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingCompany(company)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => deleteCompany(company.company_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              No companies found
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Get started by adding a new company.
            </p>
            <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Company
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
            <DialogDescription>
              Enter the details for the new company here. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              { id: "company_name", label: "Company Name", type: "input" },
              { id: "company_desc", label: "Description", type: "textarea" },
              { id: "founders", label: "Founders", type: "input" },
            ].map((field) => (
              <div
                key={field.id}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label htmlFor={field.id} className="text-right">
                  {field.label}
                </Label>
                {field.type === "input" ? (
                  <Input
                    id={field.id}
                    value={newCompany[field.id as keyof Company] || ""}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        [field.id]: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                ) : (
                  <Textarea
                    id={field.id}
                    value={newCompany[field.id as keyof Company] || ""}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        [field.id]: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={addCompany}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingCompany}
        onOpenChange={() => setEditingCompany(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Make changes to the company here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.companies.map((field) => (
              <div
                key={field.id}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label htmlFor={field.id} className="text-right">
                  {field.label}
                </Label>
                {field.type === "input" ? (
                  <Input
                    id={field.id}
                    type="text"
                    defaultValue={editingCompany?.[field.id as keyof Company]}
                    onChange={(e) =>
                      setEditingCompany(
                        editingCompany
                          ? { ...editingCompany, [field.id]: e.target.value }
                          : null
                      )
                    }
                    className="col-span-3"
                  />
                ) : (
                  <Textarea
                    id={field.id}
                    defaultValue={editingCompany?.[field.id as keyof Company]}
                    onChange={(e) =>
                      setEditingCompany(
                        editingCompany
                          ? { ...editingCompany, [field.id]: e.target.value }
                          : null
                      )
                    }
                    className="col-span-3"
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={updateCompany}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CompanyList;

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Pencil, Trash2, Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { LoadingSpinner } from "../../components/ui/loader";
interface Role {
  id: string;
  role_name: string;
  role_desc: string;
  role_candidates: string;
}

function RoleList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({});
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const { companyId } = useParams();

  useEffect(() => {
    fetchRoles();
  }, [companyId]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles`
      );
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}`
      );
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setLoading(false);
    }
  };

  const addRole = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles`,
        newRole
      );
      fetchRoles();
      setIsAddModalOpen(false);
      setNewRole({});
    } catch (error) {
      console.error("Error adding role:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${editingRole?.id}`,
        editingRole
      );
      fetchRoles();
      setEditingRole(null);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const fields = {
    roles: [
      { id: "role_name", label: "Role Name", type: "input" },
      { id: "role_desc", label: "Description", type: "textarea" },
      { id: "requirements", label: "Requirements", type: "textarea" },
    ],
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
            Roles
          </h2>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </Button>
        </div>
        {roles.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role: any) => (
                <TableRow key={role.role_id}>
                  <TableCell className="font-medium">
                    {role.role_name}
                  </TableCell>
                  <TableCell>{role.role_desc}</TableCell>
                  <TableCell>{role.role_candidates}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Link
                          to={`/companies/${companyId}/roles/${role.role_id}/candidates`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingRole(role)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRole(role.role_id)}
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
              No roles found
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Get started by adding a new role.
            </p>
            <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Role
            </Button>
          </div>
        )}
      </div>

      {/* Add Role Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
            <DialogDescription>
              Enter the details for the new role here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.roles.map((field) => (
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
                    value={newRole[field.id as keyof Role] || ""}
                    onChange={(e) =>
                      setNewRole({
                        ...newRole,
                        [field.id]: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                ) : (
                  <Textarea
                    id={field.id}
                    value={newRole[field.id as keyof Role] || ""}
                    onChange={(e) =>
                      setNewRole({
                        ...newRole,
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
            <Button type="submit" onClick={addRole}>
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Make changes to the role here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.roles.map((field) => (
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
                    value={editingRole?.[field.id as keyof Role] || ""}
                    onChange={(e) =>
                      setEditingRole(
                        editingRole
                          ? { ...editingRole, [field.id]: e.target.value }
                          : null
                      )
                    }
                    className="col-span-3"
                  />
                ) : (
                  <Textarea
                    id={field.id}
                    value={editingRole?.[field.id as keyof Role] || ""}
                    onChange={(e) =>
                      setEditingRole(
                        editingRole
                          ? { ...editingRole, [field.id]: e.target.value }
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
            <Button type="submit" onClick={updateRole}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RoleList;

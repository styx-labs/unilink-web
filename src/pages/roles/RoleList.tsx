import { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpinner } from "../../components/ui/loader";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DialogForm from "../../components/DialogForm";
import DataTable from "../../components/DataTable";
import { useParams } from "react-router-dom";

interface Role {
  role_id: string;
  role_name: string;
  role_desc: string;
  requirements: string;
  role_candidates: string;
}

const fields = [
  { id: "role_name", label: "Role Name", type: "input" as const },
  { id: "role_desc", label: "Description", type: "textarea" as const },
  { id: "requirements", label: "Requirements", type: "textarea" as const },
];

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
    setLoading(true);
    try {
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

  const deleteRole = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${id}`
      );
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setLoading(false);
    }
  };

  const addRole = async () => {
    setLoading(true);
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
    if (!editingRole) return;
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${editingRole.role_id}`,
        editingRole
      );
      fetchRoles();
      setEditingRole(null);
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setLoading(false);
    }
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
        <DataTable
          columns={[
            { key: "role_name", label: "Title" },
            { key: "role_desc", label: "Description" },
            { key: "role_candidates", label: "Candidates" },
          ]}
          data={roles}
          onEdit={setEditingRole}
          onDelete={(id) => deleteRole(id as string)}
          detailsPath={(role) =>
            `/companies/${companyId}/roles/${role.role_id}/candidates`
          }
          idField="role_id"
        />
      </div>

      <DialogForm
        title="Add Role"
        description="Enter the details for the new role here."
        fields={fields}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={addRole}
        values={newRole}
        setValues={setNewRole}
      />

      <DialogForm
        title="Edit Role"
        description="Make changes to the role here."
        fields={fields}
        open={!!editingRole}
        onOpenChange={() => setEditingRole(null)}
        onSubmit={updateRole}
        values={editingRole || {}}
        setValues={setEditingRole}
      />
    </div>
  );
}

export default RoleList;

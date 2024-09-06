import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DialogForm from "../../components/DialogForm";
import DataTable from "../../components/DataTable";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import { Role, RoleStatus } from "../../lib/types";

const fields = [
  { id: "role_name", label: "Role Name", type: "input" as const },
  {
    id: "role_status",
    label: "Status",
    type: "select" as const,
    options: Object.values(RoleStatus),
  },
  { id: "role_desc", label: "Description", type: "textarea" as const },
  { id: "role_requirements", label: "Requirements", type: "textarea" as const },
  {
    id: "role_criteria",
    label: "Criteria",
    type: "array" as const,
  },
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
      const response = await api.get(`/companies/${companyId}/roles`);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    try {
      await api.delete(`/companies/${companyId}/roles/${id}`);
      setRoles(roles.filter((role) => role.role_id !== id));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const addRole = async () => {
    try {
      const completeRole = fields.reduce((acc, field) => {
        if (field.id === "role_criteria") {
          acc[field.id] = newRole[field.id] || [];
        } else {
          acc[field.id as keyof Role] = newRole[field.id as keyof Role] ?? "";
        }
        return acc;
      }, {} as Partial<Record<keyof Role, string | number | string[]>>);
      await api.post(`/companies/${companyId}/roles`, completeRole);
      fetchRoles();
      setIsAddModalOpen(false);
      setNewRole({});
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const updateRole = async () => {
    if (!editingRole) return;
    try {
      await api.put(
        `/companies/${companyId}/roles/${editingRole.role_id}`,
        editingRole
      );
      setRoles(
        roles.map((role) =>
          role.role_id === editingRole.role_id ? editingRole : role
        )
      );
      setEditingRole(null);
    } catch (error) {
      console.error("Error updating role:", error);
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
            Roles
          </h2>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </Button>
        </div>
        <DataTable
          columns={[
            { key: "role_name", label: "Title" },
            { key: "role_status", label: "Status" },
            { key: "role_desc", label: "Description" },
            { key: "role_requirements", label: "Requirements" },
          ]}
          data={roles}
          onEdit={setEditingRole}
          onDelete={(id) => deleteRole(id as string)}
          detailsPath={(role) =>
            `/companies/${companyId}/roles/${role.role_id}/candidates`
          }
          idField="role_id"
          isLoading={loading}
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
        setValues={(newValues) => setNewRole(newValues as Role)}
      />

      <DialogForm
        title="Edit Role"
        description="Make changes to the role here."
        fields={fields}
        open={!!editingRole}
        onOpenChange={() => setEditingRole(null)}
        onSubmit={updateRole}
        values={editingRole || {}}
        setValues={(newValues) => setEditingRole(newValues as Role)}
      />
    </div>
  );
}

export default RoleList;

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DataTable from "../../components/DataTable";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import { Role, RoleCriteria } from "../../lib/types";
import { RoleForm } from "./RoleForm";

function RoleList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<{
    role: Partial<Role>;
    isOpen: boolean;
    isEditing: boolean;
  }>({
    role: {},
    isOpen: false,
    isEditing: false,
  });
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

  const openAddForm = () => {
    setFormData({ role: {}, isOpen: true, isEditing: false });
  };

  const openEditForm = (role: Role) => {
    setFormData({ role, isOpen: true, isEditing: true });
  };

  const closeForm = () => {
    setFormData({ role: {}, isOpen: false, isEditing: false });
  };

  const handleSubmit = async (submittedRole: Partial<Role>) => {
    if (formData.isEditing) {
      await updateRole(submittedRole as Role);
    } else {
      await addRole(submittedRole);
    }
    closeForm();
  };

  const addRole = async (newRole: Partial<Role>) => {
    try {
      await api.post(`/companies/${companyId}/roles`, newRole);
      fetchRoles();
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const updateRole = async (editingRole: Role) => {
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
    } catch (error) {
      console.error("Error updating role:", error);
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
          <Button onClick={openAddForm}>
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </Button>
        </div>
        <DataTable
          columns={[
            { key: "role_name", label: "Title" },
            { key: "role_status", label: "Status" },
            { key: "role_desc", label: "Description" },
            { key: "role_requirements", label: "Requirements" },
            {
              key: "role_criteria",
              label: "Criteria",
              render: (criteria: RoleCriteria[]) =>
                criteria.map((c) => c.criteria_name).join(", "),
            },
          ]}
          data={roles}
          onEdit={openEditForm}
          onDelete={deleteRole}
          detailsPath={(role) =>
            `/companies/${companyId}/roles/${role.role_id}/candidates`
          }
          idField="role_id"
          isLoading={loading}
        />
      </div>

      <RoleForm
        role={formData.role}
        onSubmit={handleSubmit}
        open={formData.isOpen}
        onOpenChange={closeForm}
        title={formData.isEditing ? "Edit Role" : "Add Role"}
        description={
          formData.isEditing
            ? "Make changes to the role here."
            : "Enter the details for the new role here."
        }
      />
    </div>
  );
}

export default RoleList;

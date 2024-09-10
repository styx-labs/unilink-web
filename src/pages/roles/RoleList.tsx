import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DataTable from "../../components/DataTable";
import { useParams } from "react-router-dom";
import {
  listRolesCompaniesCompanyIdRolesGet,
  createRoleCompaniesCompanyIdRolesPost,
  updateRoleCompaniesCompanyIdRolesRoleIdPut,
  deleteRoleCompaniesCompanyIdRolesRoleIdDelete,
} from "../../client/services.gen";
import {
  RoleWithId,
  RoleCriteria,
  RoleCreate,
  RoleUpdate,
} from "../../client/types.gen";
import { RoleForm } from "./RoleForm";

function RoleList() {
  const [roles, setRoles] = useState<RoleWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<{
    role: Partial<RoleWithId>;
    isOpen: boolean;
    isEditing: boolean;
  }>({
    role: {},
    isOpen: false,
    isEditing: false,
  });
  const { companyId } = useParams();

  const openAddForm = () => {
    setFormData({ role: {}, isOpen: true, isEditing: false });
  };

  const openEditForm = (role: RoleWithId) => {
    setFormData({ role, isOpen: true, isEditing: true });
  };

  const closeForm = () => {
    setFormData({ role: {}, isOpen: false, isEditing: false });
  };

  const handleSubmit = async (submittedRole: Partial<RoleWithId>) => {
    if (formData.isEditing) {
      await updateRole(submittedRole as RoleWithId);
    } else {
      await addRole(submittedRole);
    }
    closeForm();
  };

  useEffect(() => {
    fetchRoles();
  }, [companyId]);

  const fetchRoles = async () => {
    setLoading(true);
    const { data, error } = await listRolesCompaniesCompanyIdRolesGet({
      path: { company_id: companyId || "" },
    });
    if (error) {
      console.error("Error fetching roles:", error);
    } else {
      setRoles(data!);
    }
    setLoading(false);
  };

  const addRole = async (newRole: Partial<RoleWithId>) => {
    const completeRole: RoleCreate = {
      role_name: newRole.role_name ?? "",
      role_desc: newRole.role_desc ?? "",
      role_requirements: newRole.role_requirements ?? "",
      role_criteria: newRole.role_criteria ?? [],
    };
    const { error } = await createRoleCompaniesCompanyIdRolesPost({
      path: { company_id: companyId || "" },
      body: completeRole as RoleCreate,
    });
    if (error) {
      console.error("Error adding role:", error);
    } else {
      fetchRoles();
    }
  };

  const updateRole = async (editingRole: RoleWithId) => {
    const completeRole: RoleUpdate = {
      role_name: editingRole.role_name ?? "",
      role_desc: editingRole.role_desc ?? "",
      role_requirements: editingRole.role_requirements ?? "",
      role_criteria: editingRole.role_criteria ?? [],
    };
    const { error } = await updateRoleCompaniesCompanyIdRolesRoleIdPut({
      path: { company_id: companyId || "", role_id: editingRole.role_id },
      body: completeRole as RoleUpdate,
    });
    if (error) {
      console.error("Error updating role:", error);
    } else {
      setRoles(
        roles.map((role) =>
          role.role_id === editingRole.role_id ? editingRole : role
        )
      );
    }
  };

  const deleteRole = async (id: string) => {
    const { error } = await deleteRoleCompaniesCompanyIdRolesRoleIdDelete({
      path: { company_id: companyId || "", role_id: id },
    });
    if (error) {
      console.error("Error deleting role:", error);
    } else {
      fetchRoles();
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

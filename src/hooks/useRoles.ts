import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  RoleWithId,
  RoleCreate,
  RoleUpdate,
  RoleStatus,
} from "../client/types.gen";
import {
  listRolesEndpointCompaniesCompanyIdRolesGet,
  getRoleEndpointCompaniesCompanyIdRolesRoleIdGet,
  createRoleEndpointCompaniesCompanyIdRolesPost,
  updateRoleEndpointCompaniesCompanyIdRolesRoleIdPut,
  deleteRoleEndpointCompaniesCompanyIdRolesRoleIdDelete,
  generateCriteriaEndpointCompaniesCompanyIdRolesRoleIdGenerateCriteriaPost,
} from "../client/services.gen";

export const useRoles = () => {
  const [roles, setRoles] = useState<RoleWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { companyId } = useParams();

  useEffect(() => {
    fetchRoles();
  }, [companyId]);

  const fetchRoles = async (cursorParam?: string | null) => {
    setLoading(true);
    const { data, error } = await listRolesEndpointCompaniesCompanyIdRolesGet({
      path: { company_id: companyId || "" },
      query: {
        cursor: cursorParam || undefined,
        limit: 20,
      },
    });
    if (error) {
      console.error("Error fetching roles:", error);
    } else {
      const [newRoles, newNextCursor] = data!;
      setRoles((prev) => (cursorParam ? [...prev, ...newRoles] : newRoles));
      setNextCursor(newNextCursor);
      setHasMore(!!newNextCursor);
    }
    setLoading(false);
  };

  const getRole = async (roleId: string) => {
    const { data, error } =
      await getRoleEndpointCompaniesCompanyIdRolesRoleIdGet({
        path: { company_id: companyId || "", role_id: roleId },
      });
    if (error) {
      console.error("Error fetching role:", error);
    } else {
      return data;
    }
  };

  const addRole = async (newRole: Partial<RoleWithId>) => {
    const completeRole: RoleCreate = {
      role_name: newRole.role_name ?? "",
      role_desc: newRole.role_desc ?? "",
      role_requirements: newRole.role_requirements ?? "",
      role_criteria: newRole.role_criteria ?? [],
      role_status: newRole.role_status ?? RoleStatus.OPEN,
      meeting_link: newRole.meeting_link ?? "",
    };
    const { error } = await createRoleEndpointCompaniesCompanyIdRolesPost({
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
      role_status: editingRole.role_status ?? RoleStatus.OPEN,
      meeting_link: editingRole.meeting_link ?? "",
    };
    const { error } = await updateRoleEndpointCompaniesCompanyIdRolesRoleIdPut({
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
    const { error } =
      await deleteRoleEndpointCompaniesCompanyIdRolesRoleIdDelete({
        path: { company_id: companyId || "", role_id: id },
      });
    if (error) {
      console.error("Error deleting role:", error);
    } else {
      fetchRoles();
    }
  };

  const generateCriteria = async (roleId: string) => {
    const { data, error } =
      await generateCriteriaEndpointCompaniesCompanyIdRolesRoleIdGenerateCriteriaPost(
        {
          path: { company_id: companyId || "", role_id: roleId },
        }
      );
    if (error) {
      console.error("Error generating criteria:", error);
    } else {
      return data;
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchRoles(nextCursor);
    }
  };

  return {
    roles,
    loading,
    hasMore,
    getRole,
    addRole,
    updateRole,
    deleteRole,
    generateCriteria,
    loadMore,
  };
};

import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { PageHeader } from "../Layout/PageHeader";
import { Role, RoleCreateInput } from "./types";
import { DataControls } from "../General/DataControls";
import { UpsertRole } from "./UpsertRole";
import { TAKE } from "./const";
import { RolesTable } from "./RolesTable";

export const Roles = () => {
  const utils = trpc.useUtils();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(search, 500);
  const [isUpsertRoleModalOpen, setUpsertModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>();

  const { data: totalCount, isLoading: isLoadingCount } =
    trpc.role.total.useQuery(
      {
        search: debouncedSearchTerm,
      },
      {
        enabled: true,
      }
    );

  const { data: rolesData } = trpc.role.list.useQuery(
    {
      skip: (page - 1) * TAKE,
      limit: TAKE,
      search: debouncedSearchTerm,
    },
    { enabled: !isLoadingCount && (totalCount ?? 0) > 0 }
  );
  const { mutate: upsertRole, isPending: isLoading } =
    trpc.role.upsert.useMutation({
      onSuccess: () => {
        utils.role.list.invalidate();
        utils.role.total.invalidate();
      },
    });

  const { mutate: deleteRole } = trpc.role.deleteOne.useMutation({
    onSuccess: () => {
      utils.role.list.invalidate();
      utils.role.total.invalidate();
    },
  });

  const toggleUpsertUserModal = () => {
    setEditingRole(undefined);
    setUpsertModal((prev) => !prev);
  };

  return (
    <>
      <PageHeader
        title="Role management"
        description="Manage user roles to control access of your users."
      />
      <DataControls
        name="role"
        total={totalCount ?? 0}
        search={search}
        onCreate={toggleUpsertUserModal}
        onSearch={(search: string) => {
          setPage(1);
          setSearch(search);
        }}
      />
      <RolesTable
        roles={rolesData?.roles ?? []}
        total={totalCount ?? 0}
        page={page}
        onRoleEdit={(role: Role) => {
          setEditingRole(role);
          setUpsertModal(true);
        }}
        onRoleDelete={(id) => deleteRole({ id })}
        onPageChange={(page) => setPage(page)}
      />
      <UpsertRole
        isOpen={Boolean(isUpsertRoleModalOpen)}
        editingRole={editingRole}
        loading={isLoading}
        toggle={toggleUpsertUserModal}
        onRoleUpsert={(role: RoleCreateInput) => {
          upsertRole({
            ...role,
            id: editingRole?.id ?? 0,
          });
        }}
      />
    </>
  );
};

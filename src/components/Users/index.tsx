import { UsersTable } from "./UsersTable";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { UpsertUser } from "./UpsertUser";
import { TAKE } from "./const";
import type { CreateUserValues, User } from "./types";
import { PageHeader } from "../Layout/PageHeader";
import { DataControls } from "../General/DataControls";

const Users = () => {
  const utils = trpc.useUtils();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(search, 500);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isUpsertUserModalOpen, setUpsertModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  const { data: totalCount, isLoading: isLoadingCount } =
    trpc.user.total.useQuery(
      {
        search: debouncedSearchTerm,
      },
      {
        enabled: true,
      }
    );

  const { data: usersData } = trpc.user.list.useQuery(
    {
      skip: (page - 1) * TAKE,
      limit: TAKE,
      search: debouncedSearchTerm,
    },
    { enabled: !isLoadingCount && (totalCount ?? 0) > 0 }
  );

  const { data: roles } = trpc.role.all.useQuery();

  const { mutate: createUser, isPending: isCreating } =
    trpc.user.add.useMutation({
      onSuccess: () => {
        utils.user.list.invalidate();
        utils.user.total.invalidate();
      },
    });

  const { mutate: editUser } = trpc.user.edit.useMutation({
    onSuccess: () => {
      utils.user.list.invalidate();
      utils.user.total.invalidate();
    },
  });

  const { mutate: deleteUser } = trpc.user.deleteOne.useMutation({
    onSuccess: () => {
      utils.user.list.invalidate();
      utils.user.total.invalidate();
    },
  });
  const { mutate: deleteManyUsers } = trpc.user.deleteMany.useMutation({
    onSuccess: () => {
      utils.user.list.invalidate();
      utils.user.total.invalidate();
    },
  });

  const handleUserUpsert = (values: CreateUserValues) => {
    if (editingUser?.id) {
      editUser({
        id: editingUser.id,
        email: values.email,
        name: values.name,
        oldRoles: editingUser.roles.map((role) => role.role.id),
        updatedRoles: values.roles,
      });
      setEditingUser(undefined);
      return;
    }
    createUser(values);
    setPage(1);
  };
  const toggleUpsertUserModal = () => {
    setEditingUser(undefined);
    setUpsertModal((prev) => !prev);
  };

  return (
    <>
      <PageHeader
        title="User management"
        description="Manage your team members and their account permissions here."
      />
      <DataControls
        name="user"
        total={totalCount ?? 0}
        search={search}
        onSearch={(search: string) => {
          setPage(1);
          setSearch(search);
        }}
        onCreate={toggleUpsertUserModal}
      />
      <UsersTable
        users={usersData?.users ?? []}
        total={totalCount ?? 0}
        page={page}
        selectedUsers={selectedUsers}
        onUserEdit={(user: User) => {
          setEditingUser(user);
          setUpsertModal(true);
        }}
        onUserDelete={(id: number) => deleteUser({ id })}
        onPageChange={(page) => setPage(page)}
        onSelectedChange={(selected: number[]) => setSelectedUsers(selected)}
        onSelectedDelete={() => deleteManyUsers({ ids: selectedUsers })}
      />
      <UpsertUser
        roles={roles ?? []}
        isOpen={Boolean(isUpsertUserModalOpen)}
        editingUser={editingUser}
        loading={isCreating}
        toggle={toggleUpsertUserModal}
        onUserUpsert={handleUserUpsert}
      />
    </>
  );
};

export default Users;

// app/(dashboard)/users/page.tsx
"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/data-table/data-table";
import { AddUserModal } from "@/components/add-user-modal";
import { Badge } from "@/components/ui/badge";
import { RolesBadges } from "@/components/roles-badges";
import { AddUserDialog } from "./add-user-dialog";

type User = {
  id: number;
  username: string;
  email: string;
  roles: string[];
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const renderRoles = (user: User) => <RolesBadges roles={user.roles} />;

export const UsersForm = () => {
  // Definisi kolom untuk tabel User
  const columns: ColumnDef<User>[] = [
    {
      header: "Username",
      accessorKey: "username",
      searchable: true,
    },
    {
      header: "Email",
      accessorKey: "email",
      searchable: true,
    },
    {
      header: "Roles",
      cell: renderRoles,
    },
  ];

  // Fungsi untuk mengambil data user
  const fetchUsers = async (
    page: number,
    pageSize: number,
    searchTerm: string
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?page=${
          page - 1
        }&pageSize=${pageSize}&fullSearch=${encodeURIComponent(
          searchTerm || " "
        )}`,
        {
          credentials: "include",
        }
      );
      const result: ApiResponse = await res.json();

      if (result.success) {
        return {
          data: result.data,
          meta: result.meta,
        };
      } else {
        console.error("API returned error:", result.message);
        return {
          data: [],
          meta: { total: 0, page: 1, limit: pageSize, totalPages: 0 },
        };
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        data: [],
        meta: { total: 0, page: 1, limit: pageSize, totalPages: 0 },
      };
    }
  };

  // Handler untuk edit user
  const handleEditUser = (user: User) => {
    console.log("Edit user:", user);
    // Implementasi edit user
  };

  // Handler untuk hapus user
  const handleDeleteUser = (user: User) => {
    console.log("Delete user:", user);
    // Implementasi delete user
  };

  return (
    <DataTable<User>
      title="Users Management"
      columns={columns}
      fetchData={fetchUsers}
      //   actions={<AddUserModal onUserAdded={() => console.log("User added")} />}
      actions={<AddUserDialog onUserAdded={() => console.log("User added")} />}
      showDefaultActions={true}
      onEdit={handleEditUser}
      onDelete={handleDeleteUser}
      pageSize={5}
    />
  );
};

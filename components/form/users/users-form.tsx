// app/(dashboard)/users/page.tsx
"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { RolesBadges } from "@/components/roles-badges";
import { AddUserDialog } from "./add-user-dialog";
import { Button } from "@/components/ui/button";
import {
  FormField,
  GenericFormDialog,
} from "@/components/dialog/generic-form-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { toast } from "sonner";
import AlertActionDialog from "@/components/common/alert-action-dialog";

type User = {
  id: string;
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
  // State untuk manajemen edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // State untuk konfirmasi delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // State untuk loading
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Fungsi untuk refresh data
  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Handler untuk edit user
  const handleEditUser = (user: User) => {
    console.log("Edit userx:", user);
    // Implementasi edit user
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  // Handler untuk submit form edit
  const handleEditSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      if (!editingUser) {
        return { success: false, message: "No user selected for editing" };
      }

      // Implementasi API untuk update user
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Trigger refresh data setelah edit berhasil
        setRefreshTrigger((prev) => prev + 1);
        return { success: true, message: "User updated successfully" };
      } else {
        return {
          success: false,
          message: result.message || "Failed to update user",
        };
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        success: false,
        message: "An error occurred while updating user",
      };
    }
  };

  // Handler untuk konfirmasi delete user
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  // Handler untuk hapus user
  const executeDeleteUser = async (user: User) => {
    console.log("Delete user:", user);

    if (!userToDelete) return;

    try {
      setIsSubmitting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (result.success) {
        // Refresh data setelah hapus berhasil
        toast.success("User deleted", {
          description: `${userToDelete.username} has been deleted successfully`,
        });
        refreshData();
      } else {
        console.error("Error deleting user:", result.message);
        toast.error("Failed to delete user", {
          description: result.message || "An error occurred",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error", {
        description: "Failed to delete user",
      });
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Handler ketika user baru ditambahkan
  const handleUserAdded = () => {
    toast.success("User added", {
      description: "New user has been added successfully",
    });
    refreshData();
  };

  // Custom action renderer untuk edit (override default action)
  // const renderEditAction = (user: User) => {
  //   return (
  //     <>
  //       <CustomButton
  //         variant="default"
  //         size="sm"
  //         className="text-xs"
  //         width="w-28"
  //         onClick={() => setOpen(true)}
  //       >
  //         Edit
  //       </CustomButton>

  //       <EditUserDialog
  //         user={{
  //           id: String(user.id), // Konversi ke string
  //           username: user.username,
  //           email: user.email,
  //           roles: user.roles,
  //         }}
  //         onUserUpdated={refreshData}
  //       />
  //     </>
  //   );
  // };

  // Field untuk form edit user
  const editUserFields: FormField[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      required: true,
      validation: (value) => {
        if (!value || value.trim() === "") return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters";
        return null;
      },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      validation: (value) => {
        if (!value || value.trim() === "") return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email";
        return null;
      },
    },
    {
      name: "roles",
      label: "Roles",
      type: "select",
      options: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
        { value: "editor", label: "Editor" },
      ],
      render: ({ value, onChange, error }) => (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {["admin", "user", "editor"].map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`role-${role}`}
                  checked={value?.includes(role) || false}
                  onChange={(e) => {
                    const newRoles = [...(value || [])];
                    if (e.target.checked) {
                      if (!newRoles.includes(role)) {
                        newRoles.push(role);
                      }
                    } else {
                      const index = newRoles.indexOf(role);
                      if (index !== -1) {
                        newRoles.splice(index, 1);
                      }
                    }
                    onChange(newRoles);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor={`role-${role}`} className="text-sm capitalize">
                  {role}
                </label>
              </div>
            ))}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      ),
      validation: (value) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return "Please select at least one role";
        }
        return null;
      },
    },
    {
      name: "password",
      label: "Password (leave empty to keep current)",
      type: "password",
      placeholder: "••••••••",
      validation: (value) => {
        if (value && value.length < 8) {
          return "Password must be at least 8 characters";
        }
        return null;
      },
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "••••••••",
      validation: (value) => {
        const password = editingUser
          ? undefined
          : (
              document.querySelector(
                'input[name="password"]'
              ) as HTMLInputElement
            )?.value;
        if (value && value !== password) {
          return "Passwords do not match";
        }
        return null;
      },
    },
  ];

  // Transformasi data sebelum submit
  const transformSubmitData = (data: any) => {
    // Remove confirmPassword field before submission
    const { confirmPassword, ...submitData } = data;

    // If password is empty, remove it from the request
    if (!submitData.password) {
      delete submitData.password;
    }

    return submitData;
  };

  return (
    <>
      <DataTable<User>
        title="Users Management"
        columns={columns}
        fetchData={fetchUsers}
        //   actions={<AddUserModal onUserAdded={() => console.log("User added")} />}
        //   actions={<AddUserDialog onUserAdded={() => console.log("User added")} />}
        actions={<AddUserDialog onUserAdded={refreshData} />}
        showDefaultActions={true}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        pageSize={10}
        // refreshTrigger={refreshTrigger}
        key={`users-table-${refreshTrigger}`}
        // customEditRenderer={renderEditAction}
      />

      {/* Dialog untuk edit user */}
      {/* <GenericFormDialog
        title="Edit User"
        triggerButton={<div></div>} // Dummy trigger karena kita menggunakan controlled mode
        fields={editUserFields}
        onSubmit={handleEditSubmit}
        onSuccess={() => {
          setIsEditDialogOpen(false);
          setEditingUser(null);
        }}
        submitButtonText="Update User"
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={editingUser || undefined}
        transformSubmitData={transformSubmitData}
      /> */}

      <EditUserDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSuccess={() => refreshData()} // misal kamu mau refresh data setelah edit
      />

      <AlertActionDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => userToDelete && executeDeleteUser(userToDelete)}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

// components/users/AddUserDialog.tsx
"use client";

import {
  GenericFormDialog,
  FormField,
} from "@/components/dialog/generic-form-dialog";
import { CustomButton } from "@/components/ui/custom-button";

type UserFormData = {
  username: string;
  email: string;
  password: string;
  roles: string[];
};

type ApiResponse = { success: boolean; message: string };

export function AddUserDialog({
  onUserAdded,
}: Readonly<{ onUserAdded: () => void }>) {
  // Definisi fields untuk form user
  const userFields: FormField[] = [
    {
      name: "username",
      label: "Username",
      placeholder: "Enter username",
      required: true,
      validation: (value) =>
        value.length < 3 ? "Username must be at least 3 characters" : null,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email address",
      required: true,
      validation: (value) =>
        !value.includes("@") ? "Please enter a valid email address" : null,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      required: true,
      validation: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
    {
      name: "roles",
      label: "Role",
      type: "select",
      defaultValue: "USER",
      options: [
        { value: "USER", label: "User" },
        { value: "ADMIN", label: "Admin" },
        { value: "MANAGER", label: "Manager" },
      ],
    },
  ];

  // Handle submit form
  const handleSubmit = async (data: UserFormData): Promise<ApiResponse> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...data,
            roles: Array.isArray(data.roles) ? data.roles : [data.roles],
          }),
        }
      );

      const result = await res.json();

      return {
        success: res.ok,
        message:
          result.message ??
          (res.ok ? "User added successfully" : "Failed to add user"),
      };
    } catch (err) {
      console.error("Add user error:", err);
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  };

  return (
    <GenericFormDialog<UserFormData>
      title="Add New User"
      triggerButton={
        <CustomButton size="sm" className="text-xs" width="w-40">
          Add User
        </CustomButton>
      }
      fields={userFields}
      onSubmit={handleSubmit}
      onSuccess={onUserAdded}
      transformSubmitData={(data) => ({
        ...data,
        roles: Array.isArray(data.roles) ? data.roles : [data.roles],
      })}
    />
  );
}

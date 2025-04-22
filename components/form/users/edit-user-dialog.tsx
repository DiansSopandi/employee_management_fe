"use client";

import {
  GenericFormDialog,
  FormField,
} from "@/components/dialog/generic-form-dialog";
import { CustomButton } from "@/components/ui/custom-button";

type UserFormData = {
  username: string;
  email: string;
  password?: string;
  roles: string[];
};

type EditUserDialogProps = {
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
  onUserUpdated: () => void;
};

export function EditUserDialog({
  user,
  onUserUpdated,
}: Readonly<EditUserDialogProps>) {
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
      placeholder: "Enter email",
      required: true,
      validation: (value) =>
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Enter a valid email"
          : null,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Leave blank to keep current password",
      required: false,
    },
    {
      name: "roles",
      label: "Roles",
      type: "select",
      options: [
        { value: "USER", label: "User" },
        { value: "ADMIN", label: "Admin" },
        { value: "MANAGER", label: "Manager" },
      ],
      defaultValue: user.roles[0], // Atau support multi jika kamu mau
    },
  ];

  const handleSubmit = async (data: UserFormData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
        {
          method: "PATCH", // atau PUT sesuai backend kamu
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
          (res.ok ? "User updated successfully" : "Failed to update user"),
      };
    } catch (err) {
      console.error("Update user error:", err);
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  };

  return (
    <GenericFormDialog<UserFormData>
      title="Edit User"
      triggerButton={
        <CustomButton variant="outline" size="sm" className="text-xs">
          Edit
        </CustomButton>
      }
      fields={userFields.map((field) => ({
        ...field,
        defaultValue:
          field.name === "password"
            ? undefined
            : (user[field.name as keyof Omit<UserFormData, "password">] as
                | string
                | number
                | boolean
                | undefined),
      }))}
      onSubmit={handleSubmit}
      onSuccess={onUserUpdated}
      transformSubmitData={(data) => ({
        ...data,
        roles: Array.isArray(data.roles) ? data.roles : [data.roles],
      })}
    />
  );
}

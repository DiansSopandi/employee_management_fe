// components/users/EditUserDialog.tsx
"use client";

import {
  GenericFormDialog,
  FormField,
} from "@/components/dialog/generic-form-dialog";
// import { User } from "@/types/user"; // atau sesuaikan dengan struktur user-mu
import { useMemo } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  roles: string[];
};

type EditUserDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess?: () => void;
};

export function EditUserDialog({
  isOpen,
  onClose,
  user,
  onSuccess,
}: EditUserDialogProps) {
  // Pastikan user tersedia sebelum menampilkan form
  if (!user) return null;

  // 🧩 Definisikan field form (bisa gunakan useMemo agar tidak render ulang terus)
  const fields: FormField[] = useMemo(
    () => [
      {
        name: "username",
        label: "Username",
        type: "text",
        required: true,
        defaultValue: user.username,
      },
      {
        name: "email",
        label: "Email",
        type: "text",
        required: true,
        defaultValue: user.email,
        validation: (value) =>
          !value.includes("@") ? "Email tidak valid" : null,
      },
      {
        name: "roles",
        label: "Roles",
        type: "select",
        defaultValue: user.roles,
        options: [
          { value: "user", label: "User" },
          { value: "admin", label: "Admin" },
          { value: "employee", label: "Employee" },
        ],
        required: true,
      },
      // Tambahkan field lain sesuai kebutuhan
    ],
    [user]
  );

  // 🛠️ Fungsi submit ke backend
  const handleSubmit = async (data: any) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      return {
        success: res.ok,
        message:
          result.message ||
          (res.ok ? "Update user successfully" : "Update user failed"),
      };
    } catch (error) {
      console.error("Edit user error:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat mengedit user.",
      };
    }
  };

  return (
    <GenericFormDialog
      title="Edit User"
      triggerButton={null} // Tidak perlu tombol trigger karena dikendalikan dari luar
      fields={fields}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      isOpen={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose(); // Tutup jika user menutup dialog
      }}
      initialData={user}
      submitButtonText="Save Changes"
    />
  );
}

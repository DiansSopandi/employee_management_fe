// components/users/EditUserDialog.tsx
"use client";

import {
  GenericFormDialog,
  FormField,
} from "@/components/dialog/generic-form-dialog";
import Select from "react-select";
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
}: Readonly<EditUserDialogProps>) {
  // Pastikan user tersedia sebelum menampilkan form

  // 🧩 Definisikan field form (bisa gunakan useMemo agar tidak render ulang terus)
  // if (!user) return null;
  const fields: FormField[] = useMemo(() => {
    if (!user) return [];

    return [
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
        // defaultValue: user.roles.map((role) => ({ value: role, label: role })),
        isMulti: true,
        // options: [
        //   { value: "USER", label: "USER" },
        //   { value: "ADMIN", label: "ADMIN" },
        //   { value: "EMPLOYEE", label: "EMPLOYEE" },
        //   { value: "SUPERADMIN", label: "SUPERADMIN" },
        // ],
        required: true,
        // render: ({ value, onChange, error }) => (
        //   <div className="space-y-2">
        //     <div className="flex flex-wrap gap-2">
        //       {["ADMIN", "USER", "EMPLOYEE", "SUPERADMIN"].map((role) => (
        //         <div key={role} className="flex items-center space-x-2">
        //           <input
        //             type="checkbox"
        //             id={`edit-role-${role}`}
        //             checked={value?.includes(role) || false}
        //             onChange={(e) => {
        //               const newRoles = [...(value || [])];
        //               if (e.target.checked) {
        //                 if (!newRoles.includes(role)) newRoles.push(role);
        //               } else {
        //                 const index = newRoles.indexOf(role);
        //                 if (index !== -1) newRoles.splice(index, 1);
        //               }
        //               onChange(newRoles);
        //             }}
        //             className="h-4 w-4 border-gray-300 rounded text-primary focus:ring-primary"
        //           />
        //           <label
        //             htmlFor={`edit-role-${role}`}
        //             className="text-sm capitalize"
        //           >
        //             {role}
        //           </label>
        //         </div>
        //       ))}
        //     </div>
        //     {error && <p className="text-xs text-red-500">{error}</p>}
        //   </div>
        // ),
        render: ({ value, onChange, error }) => {
          const options = [
            { value: "USER", label: "USER" },
            { value: "ADMIN", label: "ADMIN" },
            { value: "EMPLOYEE", label: "EMPLOYEE" },
            { value: "SUPERADMIN", label: "SUPERADMIN" },
          ];

          const selectedOptions = options.filter((option) =>
            (value || []).includes(option.value)
          );

          return (
            <div className="space-y-2">
              <Select
                isMulti
                options={options}
                value={selectedOptions}
                onChange={(selected) => {
                  const selectedValues = (selected || []).map((s) => s.value);
                  // onChange(selected || []);
                  onChange(selectedValues);
                }}
                className="text-sm"
                classNamePrefix="react-select"
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => e.value}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
          );
        },
        validation: (value) => {
          if (!value || !Array.isArray(value) || value.length === 0) {
            return "Please select at least one role";
          }
          return null;
        },
      },
      // Tambahkan field lain sesuai kebutuhan
    ];
  }, [user]);

  if (!user) return null;

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
      key={user.id}
      title="Edit User"
      triggerButton={null}
      fields={fields}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      isOpen={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      initialData={user}
      submitButtonText="Save Changes"
    />
  );
}

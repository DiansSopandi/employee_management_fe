// components/dialog/GenericFormDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";

// Tipe data untuk field input
export type FormField = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number | boolean | string[]; // Untuk select multiple
  options?: { value: string; label: string }[]; // Untuk select dropdown
  required?: boolean;
  validation?: (value: any) => string | null; // Function validasi, mengembalikan error message atau null
  render?: (props: {
    value: any;
    onChange: (value: any) => void;
    error?: string;
  }) => React.ReactNode; // Untuk custom rendering
};

// Tipe data untuk dialog props
export type GenericFormDialogProps<T> = {
  title: string;
  triggerButton: React.ReactNode;
  fields: FormField[];
  onSubmit: (data: T) => Promise<{ success: boolean; message: string }>;
  onSuccess?: () => void;
  submitButtonText?: string;
  apiUrl?: string;
  transformSubmitData?: (data: any) => any; // Function untuk transformasi data sebelum submit
  isOpen?: boolean; // Tambahan untuk controlled mode
  onOpenChange?: (isOpen: boolean) => void; // Tambahan untuk controlled mode
  initialData?: Record<string, any>; // Tambahan untuk data awal saat edit
};

export function GenericFormDialog<T>({
  title,
  triggerButton,
  fields,
  onSubmit,
  onSuccess,
  submitButtonText = "Submit",
  transformSubmitData,
  isOpen, // Controlled mode
  onOpenChange, // Controlled mode
  initialData, // Data awal untuk edit
}: Readonly<GenericFormDialogProps<T>>) {
  // Gunakan controlled mode jika isOpen dan onOpenChange disediakan
  const controlled = isOpen !== undefined && onOpenChange !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);

  // const [open, setOpen] = useState(false);
  // Open state yang digunakan bergantung pada mode
  const open = controlled ? isOpen : internalOpen;
  const setOpen = controlled ? onOpenChange : setInternalOpen;

  const [formData, setFormData] = useState<any>(() => {
    // Inisialisasi form data dari initialData atau default values
    const data: any = initialData || {};
    fields.forEach((field) => {
      if (data[field.name] === undefined) {
        data[field.name] = field.defaultValue ?? "";
      }
    });
    return data;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<string, boolean>
  >({});

  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // Update form data ketika initialData berubah (untuk edit)
  useEffect(() => {
    if (initialData) {
      setFormData((prev: any) => {
        const newData = { ...prev };

        // Update dengan data baru
        Object.keys(initialData).forEach((key) => {
          newData[key] = initialData[key];
        });

        return newData;
      });
    }
  }, [initialData]);

  // Update form data ketika fields berubah (untuk defaultValues)
  useEffect(() => {
    setFormData((prev: any) => {
      const newData = { ...prev };

      fields.forEach((field) => {
        // Jika field belum ada di formData, gunakan defaultValue
        if (newData[field.name] === undefined) {
          newData[field.name] = field.defaultValue ?? "";
        }
      });

      return newData;
    });
  }, [fields]);

  // Handle perubahan nilai input
  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    // Clear error untuk field ini jika ada
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validasi field jika ada fungsi validasi
    const field = fields.find((f) => f.name === name);
    if (field?.validation) {
      const error = field.validation(value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  // Reset form
  const resetForm = () => {
    const initialFormData: any = initialData || {};
    fields.forEach((field) => {
      if (initialFormData[field.name] === undefined) {
        initialFormData[field.name] = field.defaultValue ?? "";
      }
    });
    setFormData(initialFormData);
    setErrors({});
  };

  // Validasi form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      // Validasi required
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }

      // Validasi custom jika ada
      if (field.validation && formData[field.name] !== undefined) {
        const error = field.validation(formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform data jika diperlukan
      const dataToSubmit = transformSubmitData
        ? transformSubmitData(formData)
        : formData;

      // Submit data
      const result = await onSubmit(dataToSubmit as T);

      if (result.success) {
        toast(result.message || "Success", {
          description: "Form submitted successfully",
          duration: 3000,
        });

        if (onSuccess) {
          onSuccess();
        }

        resetForm();
        setOpen(false);
      } else {
        toast("Error", {
          description: result.message || "Form submission failed",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast("Error", {
        description: "An unexpected error occurred",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field berdasarkan tipe
  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const error = errors[field.name];

    // Jika ada fungsi render custom, gunakan itu
    if (field.render) {
      return (
        <div key={field.name} className="space-y-1">
          <label className="text-sm font-medium">{field.label}</label>
          {field.render({
            value,
            onChange: (newValue) => handleChange(field.name, newValue),
            error,
          })}
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );
    }

    // Default render berdasarkan tipe
    switch (field.type) {
      case "select":
        return (
          <div key={field.name} className="space-y-1">
            <label className="text-sm font-medium">{field.label}</label>
            <select
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
      case "textarea":
        return (
          <div key={field.name} className="space-y-1">
            <label className="text-sm font-medium">{field.label}</label>
            <textarea
              name={field.name}
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
      case "checkbox":
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={field.name}
              checked={!!value}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label className="text-sm font-medium">{field.label}</label>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
      default:
        return (
          <div key={field.name} className="space-y-1">
            <label className="text-sm font-medium">{field.label}</label>
            <div className="relative">
              <input
                type={
                  field.type === "password" && !passwordVisibility[field.name]
                    ? "password"
                    : "text"
                }
                name={field.name}
                value={value}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {field.type === "password" && (
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.name)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {passwordVisibility[field.name] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {fields.map(renderField)}
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : submitButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

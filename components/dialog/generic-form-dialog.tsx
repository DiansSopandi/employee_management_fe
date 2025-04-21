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
import { useState } from "react";
import { toast } from "sonner";

// Tipe data untuk field input
export type FormField = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number | boolean;
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
};

export function GenericFormDialog<T>({
  title,
  triggerButton,
  fields,
  onSubmit,
  onSuccess,
  submitButtonText = "Submit",
  transformSubmitData,
}: Readonly<GenericFormDialogProps<T>>) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>(() => {
    // Inisialisasi form data dari default values
    const initialData: any = {};
    fields.forEach((field) => {
      initialData[field.name] = field.defaultValue ?? "";
    });
    return initialData;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const initialData: any = {};
    fields.forEach((field) => {
      initialData[field.name] = field.defaultValue ?? "";
    });
    setFormData(initialData);
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
      if (field.validation && formData[field.name]) {
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
            <input
              type={field.type ?? "text"}
              name={field.name}
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
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

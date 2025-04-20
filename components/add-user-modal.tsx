// components/AddUserModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { CustomButton } from "./ui/custom-button";

export function AddUserModal({
  onUserAdded,
}: Readonly<{ onUserAdded: () => void }>) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    roles: "USER",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...form,
            roles: [form.roles],
          }),
        }
      );

      const result = await res.json();

      setOpen(false);

      if (!res.ok) {
        toast("Add User failed", {
          description: `${result.message}`,
          duration: 3000,
        });
        return;
      }

      toast("Add User success", {
        description: `${result.message}`,
        duration: 3000,
      });

      onUserAdded();
    } catch (err) {
      console.error("Add user error:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton size="sm" className="text-xs" width="w-40">
          Add User
        </CustomButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 ">
          <Input
            placeholder="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
          <Input
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            placeholder="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <Input
            placeholder="Roles"
            name="roles"
            value={form.roles}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

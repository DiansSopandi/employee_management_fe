// columns/user-columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomButton } from "./ui/custom-button";

export type User = {
  id: number;
  username: string;
  email: string;
  roles: string[];
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.roles.map((role) => (
          <Badge key={role} variant="outline" className="bg-blue-50">
            {role}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <CustomButton
          variant="outline"
          size="sm"
          width="w-28"
          // className="bg-black text-white rounded-md"
        >
          Edit
        </CustomButton>
        <CustomButton
          variant="destructive"
          size="sm"
          width="w-28"
          className="bg-red-500 text-white rounded-md"
        >
          Delete
        </CustomButton>
      </div>
    ),
  },
];

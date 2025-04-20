"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AddUserModal } from "@/components/add-user-modal";

type User = {
  status: boolean;
  message: string;
  data: [
    {
      id: number;
      username: string;
      email: string;
    }
  ];
};

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User | undefined>();
  // const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      credentials: "include",
    });
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-md font-semibold mb-4">Users Management</h1>
        <div className="flex items-center space-x-2">
          <AddUserModal onUserAdded={fetchUsers} />
        </div>
      </div>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.data.length &&
            users?.data.map((u) => (
              <tr key={u.id}>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  <Button className="text-xs">Edit</Button>
                  <Button variant="destructive" className="ml-2 text-xs">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

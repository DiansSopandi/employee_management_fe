"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AddUserModal } from "@/components/add-user-modal";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CustomButton } from "@/components/ui/custom-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type User = {
  id: number;
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

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[] | undefined>([]);
  // const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredUsers, setFilteredUsers] = useState<User[] | undefined>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // const fetchUsers = async (currentPage: number) => {
  //   const res = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/users?page=${
  //       currentPage - 1
  //     }&pageSize=10`,
  //     {
  //       credentials: "include",
  //     }
  //   );
  //   const result: ApiResponse = await res.json();
  //   setUsers(result.data);
  //   setLastPage(result.meta.totalPages);
  // };

  const fetchUsers = async (
    currentPage: number,
    currentPageSize: number,
    fullSearch: string = "  "
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?page=${
          currentPage - 1
        }&pageSize=${currentPageSize}&fullSearch=${encodeURIComponent(
          fullSearch
        )}`,
        {
          credentials: "include",
        }
      );
      const result: ApiResponse = await res.json();

      if (result.success) {
        setUsers(result.data);
        setLastPage(result.meta.totalPages);
        setTotalItems(result.meta.total);
      } else {
        console.error("API returned error:", result.message);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchUsers(page);
  // }, [page]);

  // Effect untuk fetch data awal atau saat pagination berubah
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(page, pageSize, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, pageSize, searchTerm]);

  // Effect untuk filter data berdasarkan pencarian
  // useEffect(() => {
  //   if (!users) return;

  //   if (searchTerm.trim() === "") {
  //     setFilteredUsers(users);
  //   } else {
  //     const filtered = users.filter(
  //       (user) =>
  //         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         user.email.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setFilteredUsers(filtered);
  //   }
  // }, [searchTerm, users]);

  // Handle perubahan pageSize
  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);
    setPage(1); // Reset ke halaman pertama saat pageSize berubah
  };

  // Filter users berdasarkan searchTerm langsung saat render
  let filteredUsers: User[] = [];
  if (!users) {
    filteredUsers = [];
  } else if (searchTerm.trim() === "") {
    filteredUsers = users;
  } else {
    filteredUsers = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Buat pagination info
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);
  const paginationInfo = `${startItem}-${endItem} from ${totalItems}`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-md font-semibold mb-4">Users Management</h1>
        <div className="flex items-center space-x-2">
          <AddUserModal
            onUserAdded={() => fetchUsers(page, pageSize, searchTerm)}
          />
        </div>
      </div>

      {/* Search and PageSize Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              renderUserRows(filteredUsers, searchTerm)
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <div className="flex items-center gap-2">
          <CustomButton
            variant="default"
            size="sm"
            disabled={page === 1 || isLoading}
            onClick={() => setPage((prev) => prev - 1)}
            className="flex items-center gap-1"
            width="w-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </CustomButton>

          <CustomButton
            variant="default"
            size="sm"
            disabled={page === lastPage || isLoading}
            onClick={() => setPage((prev) => prev + 1)}
            className="flex items-center gap-1"
            width="w-40"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </CustomButton>
        </div>

        <div className="text-sm text-gray-600">
          <span>
            Page {page} of {lastPage || 1}
          </span>
          <span className="ml-2">
            {/* (Showing {filteredUsers?.length || 0} of {totalItems} items) */}
            ({paginationInfo})
          </span>
        </div>
      </div>
    </div>
  );

  // 👇 Fungsi helper di bawah komponen
  function renderUserRows(
    filteredUsers: User[] | undefined,
    searchTerm: string
  ): JSX.Element[] | JSX.Element {
    if (filteredUsers && filteredUsers.length > 0) {
      return filteredUsers.map((user: User) => (
        <TableRow key={user.id}>
          <TableCell className="font-medium">{user.username}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>
            <div className="flex gap-1">
              {user.roles.map((role: string) => (
                <Badge key={role} variant="outline" className="bg-blue-50">
                  {role}
                </Badge>
              ))}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex space-x-2">
              <CustomButton
                variant="default"
                size="sm"
                className="text-xs"
                width="w-28"
              >
                Edit
              </CustomButton>
              <CustomButton
                variant="destructive"
                size="sm"
                className="text-xs"
                width="w-28"
              >
                Delete
              </CustomButton>
            </div>
          </TableCell>
        </TableRow>
      ));
    } else {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center py-8">
            {searchTerm.trim() !== ""
              ? "No matching users found."
              : "No users found."}
          </TableCell>
        </TableRow>
      );
    }
  }
}

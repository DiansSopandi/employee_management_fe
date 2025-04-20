"use client";

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userColumns, User } from "@/components/user-columns";
import { GenericDataTable } from "@/components/ui/generic-data-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";

export const UsersForm = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const itemsPerPage = 5;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: (page - 1).toString(), // backend mulai dari page 0
        pageSize: itemsPerPage.toString(),
        search: search,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        credentials: "include",
      });
      const result = await response.json();
      setUsers(result.data || []);
      setTotalPages(Math.ceil((result.data?.length || 0) / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users
      .filter(
        (user) =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      )
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [users, search, currentPage]);

  const table = useReactTable({
    data: filteredUsers,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* 🔍 Search */}
      <Input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={handleSearch}
        className="max-w-sm"
      />

      {/* 📋 Table */}
      <GenericDataTable table={table} isLoading={isLoading} colSpan={4} />

      {/* 📄 Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex gap-2">
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            width="w-28"
            // className="bg-black text-white rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </CustomButton>
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            width="w-28"
            // className="bg-black text-white rounded-md"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { userColumns, User } from "@/components/user-columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GenericDataTable } from "@/components/ui/generic-data-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";

export const UsersForm = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1); // page dimulai dari 1
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const limit = 10;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: (page - 1).toString(), // backend mulai dari page 0
        pageSize: limit.toString(),
        fullSearch: search,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?${params}`,
        {
          credentials: "include",
        }
      );

      const json = await res.json();

      setUsers(json.data || []);
      setTotalPages(json.meta?.totalPages || 1);
      setTotalItems(json.meta?.total || 0);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch saat page atau search berubah
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn); // bersihkan timeout saat komponen unmount
  }, [page, search]);

  const table = useReactTable({
    data: users,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset ke page 1 kalau search berubah
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        type="text"
        placeholder="Search by username or email..."
        value={search}
        onChange={handleSearch}
        className="max-w-sm"
      />

      {/* Table */}
      <GenericDataTable table={table} isLoading={isLoading} colSpan={4} />

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground">
          Showing page {page} of {totalPages} ({users.length} of {totalItems}{" "}
          users)
        </p>

        <div className="flex gap-2">
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            width="w-28"
            // className="bg-black text-white rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </CustomButton>
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            width="w-28"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

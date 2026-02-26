"use client";

import { useUsers } from "@/hooks/use-users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./user-actions";

const UsersClient = () => {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive font-bold">
        Error loading users. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-default-900">Users</h2>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Role</TableHead>
                  <TableHead className="text-right">Created At</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!users || users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-default-500"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-default-500 font-medium">
                        #{user.id}
                      </TableCell>
                      <TableCell className="font-bold text-default-900">
                        {user.username}
                      </TableCell>
                      <TableCell className="text-default-600 lowercase">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          color={
                            user.role === "ADMIN" ? "primary" : "secondary"
                          }
                          className="capitalize rounded-full px-4 py-1 font-semibold text-[11px]"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-default-500 font-medium whitespace-nowrap">
                        {format(new Date(user.createdAt), "dd MMM yyyy, HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <UserActions user={user} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersClient;

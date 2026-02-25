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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

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
        <CardHeader className="flex flex-row items-center justify-between py-6 px-6 bg-white dark:bg-slate-900">
          <CardTitle className="text-xl font-bold text-default-900">
            System Users Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white dark:bg-slate-900 border-y border-default-100">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="h-14 px-6 text-default-900 font-bold text-[11px] uppercase tracking-wider bg-white dark:bg-slate-900 w-[80px]">
                    ID
                  </TableHead>
                  <TableHead className="h-14 px-6 text-default-900 font-bold text-[11px] uppercase tracking-wider bg-white dark:bg-slate-900">
                    Username
                  </TableHead>
                  <TableHead className="h-14 px-6 text-default-900 font-bold text-[11px] uppercase tracking-wider bg-white dark:bg-slate-900">
                    Email
                  </TableHead>
                  <TableHead className="h-14 px-6 text-default-900 font-bold text-[11px] uppercase tracking-wider bg-white dark:bg-slate-900 text-center">
                    Role
                  </TableHead>
                  <TableHead className="h-14 px-6 text-default-900 font-bold text-[11px] uppercase tracking-wider bg-white dark:bg-slate-900">
                    Site
                  </TableHead>
                  <TableHead className="h-14 px-6 text-default-900 font-bold text-[11px] uppercase tracking-wider bg-white dark:bg-slate-900 text-right">
                    Created At
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!users || users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-default-500"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="h-14 border-b border-default-50 hover:bg-default-50/50 transition-colors"
                    >
                      <TableCell className="px-6 py-3 text-default-500 font-medium">
                        #{user.id}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-bold text-default-900">
                        {user.username}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-default-600">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-center">
                        <Badge
                          color={user.role === "ADMIN" ? "primary" : "default"}
                          className="capitalize rounded-full px-4 py-1 font-semibold text-[11px]"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-3 text-default-600 italic">
                        {user.site || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-right text-default-500 font-medium whitespace-nowrap">
                        {format(new Date(user.createdAt), "dd MMM yyyy, HH:mm")}
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

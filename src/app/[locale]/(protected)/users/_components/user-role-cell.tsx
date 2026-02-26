"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserService } from "@/services/user-service";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/hooks/use-users";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface UserRoleCellProps {
  userId: number;
  initialRole: string;
}

export const UserRoleCell = ({ userId, initialRole }: UserRoleCellProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const handleRoleChange = (newRole: string) => {
    if (newRole === "ADMIN" && initialRole !== "ADMIN") {
      setIsDialogOpen(true);
    }
  };

  const confirmMakeAdmin = async () => {
    setIsUpdating(true);
    try {
      await UserService.makeAdmin(userId);
      toast.success("User role updated to ADMIN");
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    } catch (error) {
      toast.error("Failed to update user role");
      console.error(error);
    } finally {
      setIsUpdating(false);
      setIsDialogOpen(false);
    }
  };

  if (initialRole === "ADMIN") {
    return (
      <Badge
        color="primary"
        className="capitalize rounded-full px-4 py-1 font-semibold text-[11px]"
      >
        {initialRole}
      </Badge>
    );
  }

  return (
    <>
      <Select
        defaultValue={initialRole}
        onValueChange={handleRoleChange}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[120px] mx-auto h-8 text-[11px] font-semibold border-none bg-transparent hover:bg-default-50 transition-colors capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USER">User</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will promote the user to **ADMIN**. Currently, we cannot
              downgrade a user's role back to USER once they are an admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary hover:bg-primary/90"
              onClick={(e) => {
                e.preventDefault();
                confirmMakeAdmin();
              }}
              disabled={isUpdating}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

"use client";

import { useState } from "react";
import { TableActions } from "@/components/ui-kit/table/table-actions";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Trash2, ShieldAlert } from "lucide-react";
import { UserService } from "@/api/services/user-service";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/api/hooks/use-users";
import { toast } from "sonner";
import { User } from "@/api/types/user";
import { cn } from "@/lib/utils";

interface UserActionsProps {
  user: User;
}

export const UserActions = ({ user }: UserActionsProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const queryClient = useQueryClient();

  const hasChanges = selectedRole !== user.role;

  const handleUpdateRole = async () => {
    if (!hasChanges) return;

    if (selectedRole === "ADMIN") {
      setIsUpdating(true);
      try {
        await UserService.makeAdmin(user.id);
        toast.success("User promoted to ADMIN");
        queryClient.invalidateQueries({ queryKey: userKeys.all });
        setIsViewDialogOpen(false);
      } catch (error) {
        toast.error("Failed to update role");
      } finally {
        setIsUpdating(false);
      }
    } else {
      toast.info("Downgrading to USER is not supported yet");
    }
  };

  const handleDeleteUser = async () => {
    setIsUpdating(true);
    try {
      await UserService.deleteUser(user.id);
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setIsUpdating(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const resetSelection = () => {
    setSelectedRole(user.role);
    setIsViewDialogOpen(false);
  };

  return (
    <>
      <TableActions
        actions={[
          {
            label: "View",
            icon: <Eye />,
            onClick: () => setIsViewDialogOpen(true),
          },
          {
            label: "Delete",
            icon: <Trash2 />,
            onClick: () => {
              if (user.role === "ADMIN") {
                toast.error("Admin user cannot be deleted");
                return;
              }
              setIsDeleteDialogOpen(true);
            },
            variant: "destructive",
          },
        ]}
      />

      {/* View & Edit Role Dialog */}
      <Dialog
        open={isViewDialogOpen}
        onOpenChange={(open) => {
          if (!open) resetSelection();
          else setIsViewDialogOpen(true);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              User Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-default-500 uppercase tracking-wider">
                  Username
                </p>
                <p className="text-sm font-bold text-default-900">
                  {user.username}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-default-500 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-sm font-bold text-default-900">
                  {user.email}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-default-900">
                  Manage Role
                </p>
              </div>

              <Select
                defaultValue={user.role}
                value={selectedRole}
                onValueChange={setSelectedRole}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full capitalize bg-default-50 border-default-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>

              <div
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200",
                  selectedRole === "ADMIN" && user.role !== "ADMIN"
                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30 opacity-100"
                    : "opacity-0 invisible pointer-events-none select-none border-transparent bg-transparent",
                )}
              >
                <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                  Note: Promoting this user to **ADMIN** provides full access to
                  the platform. This action is currently irreversible.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            {hasChanges && (
              <Button onClick={handleUpdateRole} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            )}{" "}
            <Button variant="outline" onClick={resetSelection}>
              {hasChanges ? "Cancel" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will significantly impact the user's data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUser();
              }}
              disabled={isUpdating}
            >
              {isUpdating ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

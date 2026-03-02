"use client";

import * as React from "react";
import { useState } from "react";
import { ActionBlock } from "@/components/blocks/action-block";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface EditableActionBlockOption {
  label: string;
  value: string;
}

interface BaseProps {
  /** Label above the value */
  title?: string;
  /** Current saved value */
  value: string | number;
  /** Icon on the left */
  icon?: React.ReactNode;
  /** Optional extra class for the card */
  className?: string;
  /** Optional extra class for the icon wrapper */
  iconWrapperClass?: string;
  /** Whether the save request is in flight */
  isPending?: boolean;
  /** Called with the new value string when user confirms */
  onSave: (value: string) => void;
}

interface TextNumberProps extends BaseProps {
  type?: "text" | "number";
  /** Min value, only for type="number" */
  min?: number;
  options?: never;
}

interface SelectProps extends BaseProps {
  type: "select";
  options: EditableActionBlockOption[];
  min?: never;
}

type EditableActionBlockProps = TextNumberProps | SelectProps;

export const EditableActionBlock = ({
  title,
  value,
  icon,
  className,
  iconWrapperClass,
  isPending = false,
  onSave,
  ...rest
}: EditableActionBlockProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  const handleOpen = () => {
    setInputValue(String(value));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(String(value));
  };

  const handleSave = () => {
    if (rest.type === "number") {
      const parsed = parseFloat(inputValue);
      if (isNaN(parsed) || (rest.min !== undefined && parsed < rest.min))
        return;
    }
    onSave(inputValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  // ── Select variant: auto-save on pick ──────────────────────────────────────
  if (rest.type === "select") {
    const { options } = rest;
    const displayLabel =
      options.find((o) => o.value === String(value))?.label ?? String(value);

    return (
      <ActionBlock
        title={title}
        value={displayLabel}
        icon={icon}
        className={className}
        iconWrapperClass={iconWrapperClass}
        action={
          isEditing ? (
            <div className="flex items-center gap-1.5">
              <Select
                value={inputValue}
                onValueChange={(v) => {
                  setInputValue(v);
                }}
                disabled={isPending}
              >
                <SelectTrigger className="h-8 text-xs font-bold min-w-[120px] focus:ring-1 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="icon"
                variant="default"
                className="h-8 w-8 aspect-square"
                onClick={handleSave}
                disabled={isPending}
              >
                <Icon icon="heroicons:check" className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 aspect-square"
                onClick={handleCancel}
                disabled={isPending}
              >
                <Icon icon="heroicons:x-mark" className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleOpen}
              disabled={isPending}
            >
              <Icon icon="heroicons:pencil-square" className="w-4 h-4" />
            </Button>
          )
        }
      />
    );
  }

  // ── Text / Number variant ──────────────────────────────────────────────────
  const { type = "text", min } = rest as TextNumberProps;

  return (
    <ActionBlock
      title={title}
      value={value}
      icon={icon}
      className={className}
      iconWrapperClass={iconWrapperClass}
      action={
        isEditing ? (
          <div className="flex items-center gap-1.5">
            <input
              type={type}
              min={type === "number" ? min : undefined}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              autoFocus
              className="w-24 h-8 rounded-md border border-default-200 bg-background px-2 text-sm font-bold text-default-900 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              size="icon"
              variant="default"
              className="h-8 w-8"
              onClick={handleSave}
              disabled={isPending}
            >
              <Icon icon="heroicons:check" className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={handleCancel}
              disabled={isPending}
            >
              <Icon icon="heroicons:x-mark" className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleOpen}
            disabled={isPending}
          >
            <Icon icon="heroicons:pencil-square" className="w-4 h-4" />
          </Button>
        )
      }
    />
  );
};

"use client";

import { useState, useEffect } from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const allSuggestions = ["Bell", "Link3", "Amber IT Ltd."];

interface SearchBarProps {
  onSelectionChange: (selected: string[]) => void;
}

export default function SearchBar({ onSelectionChange }: SearchBarProps) {
  const [checkedItems, setCheckedItems] = useState<{
    [key: string]: Checked;
  }>({});

  useEffect(() => {
    const updatedSelectedNames = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );
    onSelectionChange(updatedSelectedNames);
  }, [checkedItems, onSelectionChange]);

  const handleCheckedChange = (name: string, checked: Checked) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [name]: checked,
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Filter by ISP</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {allSuggestions.map((suggestion) => (
          <DropdownMenuCheckboxItem
            key={suggestion}
            checked={checkedItems[suggestion] || false}
            onCheckedChange={(checked) =>
              handleCheckedChange(suggestion, checked)
            }
          >
            {suggestion}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

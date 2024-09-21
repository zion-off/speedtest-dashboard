"use client";

import { useState, useRef, useEffect } from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { companies } from "@/data/isp";


type Checked = DropdownMenuCheckboxItemProps["checked"];

interface SearchBarProps {
  onSelectionChange: (selected: string[]) => void;
}

export default function SearchBar({ onSelectionChange }: SearchBarProps) {
  const [checkedItems, setCheckedItems] = useState<{
    [key: string]: Checked;
  }>({});
  const [buttonWidth, setButtonWidth] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updateButtonWidth = () => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateButtonWidth();
    window.addEventListener("resize", updateButtonWidth);
    return () => {
      window.removeEventListener("resize", updateButtonWidth);
    };
  }, []);
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
        <Button
          ref={buttonRef}
          variant="default"
          className="w-full border border-slate-800 bg-[#000103] px-6 text-slate-300 transition-colors focus:outline-none focus:ring-2  hover:text-white  duration-300 font-semibold"
        >
          Filter by ISP
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="my-1 max-h-80 overflow-scroll"
        style={{ width: buttonWidth }}
      >
        {companies.map((suggestion) => (
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

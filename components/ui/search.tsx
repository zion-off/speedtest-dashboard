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

type Checked = DropdownMenuCheckboxItemProps["checked"];

const allSuggestions = [
  "Bell",
  "Match Net",
  "Link3 Technologies Ltd.",
  "Aamra Networks Limited",
  "ADN Telecom Limited",
  "Agni Systems Limited",
  "Amber IT Limited",
  "Bangladesh Internet Exchange Limited (BIEL)",
  "BDCom Online Limited",
  "Brac Net Limited",
  "Carnival Internet",
  "Dhakacom Limited",
  "Dhaka Fiber Net Limited",
  "Fiber@Home Limited",
  "Infolink Communications Ltd.",
  "Kloud Technologies Ltd.",
  "Mango Teleservices Ltd.",
  "MetroNet Bangladesh Limited",
  "National IT Limited",
  "Nexus Telecom Limited",
  "Ollo Broadband",
  "Ranks ITT Limited",
  "Samonline Limited",
  "Sheba Phone (Pvt.) Ltd.",
  "Skytel Communications Ltd.",
  "Summit Communications Ltd.",
  "Thakral Information Systems Pvt. Ltd.",
  "Triangle Services Ltd.",
  "Unique Infoway Limited",
  "Wintel Limited",
];

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
          className="w-full hover:bg-neutral-700 bg-neutral-800 font-semibold rounded-lg"
        >
          Filter by ISP
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="my-1 max-h-80 overflow-scroll" style={{ width: buttonWidth }}>
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

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const allSuggestions = [
  "Bell", // for testing
  "Link3 Technologies Ltd.",
  "Amber IT Ltd.",
  "BDCOM Online Ltd.",
  "Dot Internet",
  "Carnival Internet",
  "ICC Communication Ltd.",
  "BRACNet Ltd.",
  "Banglalion Communications Limited",
  "Agni Systems Limited",
  "Aamra Networks Limited",
  "AlwaysOn Network Bangladesh Ltd.",
  "Daffodil Online Ltd.",
  "Bangladesh Online Limited",
  "Grameen Cybernet Ltd.",
  "Bijoy Online Limited",
  "Access Telecom (BD) Ltd.",
  "Aalok IT Limited",
  "Advanced Data Networks System Ltd.",
  "InfoLink",
  "Broad Band Telecom Services Limited (BBTS)",
  "My Internet",
  "Elite Communication",
  "Akij Online Ltd.",
  "Chittagong Online Limited (COL)",
  "Bangladesh Telecommunications Company Ltd. (BTCL)",
];

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (input.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredSuggestions = allSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-start justify-center w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="flex">
          <Input
            type="text"
            placeholder="Search..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full pr-10 bg-gray-700 text-white placeholder-gray-400 border-none focus:border-none bg-opacity-75 backdrop-filter backdrop-blur-lg"
          />
        </div>
        {suggestions.length > 0 && (
          <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-gray-800 border-gray-700">
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                  onClick={() => {
                    setInput(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </form>
    </div>
  );
}

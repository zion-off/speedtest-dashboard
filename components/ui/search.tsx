'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SearchIcon } from "lucide-react"

const allSuggestions = [
  "React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS",
  "Node.js", "Express", "MongoDB", "PostgreSQL", "GraphQL", "REST API",
  "Redux", "Zustand", "TailwindCSS", "Styled Components", "Framer Motion"
]

export default function SearchBar() {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (input.trim() === '') {
      setSuggestions([])
    } else {
      const filteredSuggestions = allSuggestions.filter(
        suggestion => suggestion.toLowerCase().includes(input.toLowerCase())
      )
      setSuggestions(filteredSuggestions)
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (

      <div className="flex items-start justify-center w-full">
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full pr-10 bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:border-blue-500"
            />
            <Button type="submit" size="icon" className="ml-2 bg-blue-600 hover:bg-blue-700">
              <SearchIcon className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          {suggestions.length > 0 && (
            <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-gray-800 border-gray-700">
              <ul className="py-2">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                    onClick={() => {
                      setInput(suggestion)
                      setSuggestions([])
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
  )
}
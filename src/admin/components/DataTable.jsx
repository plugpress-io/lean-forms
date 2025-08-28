/**
 * Data Table Component
 * Native React table with sorting, filtering, and pagination
 */

import React, { useState, useMemo } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "./lib/utils"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

export function DataTable({
  columns,
  data,
  searchKey = "",
  searchPlaceholder = "Search...",
  className,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
  const [globalFilter, setGlobalFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter data based on global search
  const filteredData = useMemo(() => {
    if (!globalFilter) return data
    
    return data.filter(row =>
      columns.some(column => {
        const value = column.accessorKey ? row[column.accessorKey] : ''
        return String(value).toLowerCase().includes(globalFilter.toLowerCase())
      })
    )
  }, [data, globalFilter, columns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      <div className="flex items-center justify-between">
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey || column.id}
                  className={cn(
                    "cursor-pointer select-none hover:bg-muted/50"
                  )}
                  onClick={() => column.accessorKey && handleSort(column.accessorKey)}
                >
                  <div className="flex items-center space-x-2">
                    {typeof column.header === 'function' 
                      ? column.header() 
                      : column.header
                    }
                    {column.accessorKey && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            "h-3 w-3",
                            sortConfig.key === column.accessorKey && sortConfig.direction === "asc"
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 -mt-1",
                            sortConfig.key === column.accessorKey && sortConfig.direction === "desc"
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        />
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((row, index) => (
                <TableRow key={row.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey || column.id}>
                      {column.cell 
                        ? (typeof column.cell === 'function' 
                            ? column.cell({ row: { original: row } })
                            : column.cell
                          )
                        : row[column.accessorKey]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, sortedData.length)}{" "}
          of {sortedData.length} entries
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

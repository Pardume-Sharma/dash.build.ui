'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TableRendererProps {
  data: any[];
  config: any;
  name: string;
}

import EmptyState from './EmptyState';

export default function TableRenderer({ data, config, name }: TableRendererProps) {
  if (!data || data.length === 0) return <EmptyState name={name} icon="📋" message="Add rows to display table" />;

  const tableData = data.map(d => d.data);
  const columns = Object.keys(tableData[0] || {});
  
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  
  const pageSize = config?.pageSize || 10;

  const handleSort = (column: string) => {
    if (!config?.sortable) return;
    
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  let sortedData = [...tableData];
  if (sortColumn) {
    sortedData.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return sortDirection === 'asc' 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = config?.pagination 
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const formatValue = (value: any, key: string) => {
    if (key.toLowerCase().includes('value') || key.toLowerCase().includes('revenue') || key.toLowerCase().includes('spend')) {
      return `$${Number(value).toLocaleString()}`;
    }
    if (key.toLowerCase().includes('date')) {
      return new Date(value).toLocaleDateString();
    }
    return value;
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('won') || statusLower.includes('closed')) return 'text-green-400 bg-green-400/10';
    if (statusLower.includes('negotiation')) return 'text-yellow-400 bg-yellow-400/10';
    if (statusLower.includes('proposal')) return 'text-blue-400 bg-blue-400/10';
    return 'text-gray-400 bg-gray-400/10';
  };

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((column) => (
                  <th 
                    key={column}
                    className={`px-4 py-3 text-left text-sm font-medium text-gray-400 ${config?.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center gap-2">
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                      {config?.sortable && sortColumn === column && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-3 text-sm text-gray-300">
                      {column.toLowerCase() === 'stage' ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row[column])}`}>
                          {row[column]}
                        </span>
                      ) : (
                        formatValue(row[column], column)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {config?.pagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className="text-sm text-gray-400">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

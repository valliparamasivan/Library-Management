"use client";

import React from "react";
import { useRouter } from "nextjs-toploader/app";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import NoDataFoundWidget from "@/components/widgets/NoDataFoundWidget";
import PaginationWidget from "@/components/widgets/PaginationWidget";

const TableWidget = ({
    columns,
    response,
    handleSort,
    getSortIcon,
    searchTerm,
    currentPage,
    itemsPerPage,
    handlePageChange,
    height,
    onRowClick,
    showPagination = true,
}) => {
    const router = useRouter();

    const defaultHeight = "h-[calc(100vh-230px)]";
    const tableHeight = height || defaultHeight;

    const firstColumnHasCheckbox = columns.length > 0 && columns[0].key === "checkbox";

    const handleRowClick = (record, event) => {
        if (event.target.closest('a, button, [role="button"]')) {
            return;
        }
        if (onRowClick) {
            onRowClick(record);
        }
    };

    return (
        <>
            <div className={`overflow-auto relative ${tableHeight} border-gray-200 border-b border-l border-r border-t rounded-md`}>
                <Table className="rounded-lg w-full">
                    <TableHeader className="sticky top-0 z-20">
                        <TableRow className="bg-[#F1F4FF] border-[#E6E6E6]">
                            {columns.map((column, colIndex) => (
                                <TableHead
                                    key={column.key}
                                    className={`font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px] ${column.minWidth} ${column.lgMinWidth} ${column.sortable !== false ? 'cursor-pointer hover:text-[#00796B] transition-colors' : ''} ${!firstColumnHasCheckbox && colIndex === 0 ? 'pl-5' : ''}`}
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {column.headerRender ? column.headerRender() : column.label}
                                        {column.sortable && (
                                            getSortIcon(column.key)
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {response?.data?.content && response.data.content.length > 0 ? (
                            response.data.content.map((record, index) => (
                                <TableRow 
                                    key={index} 
                                    className={`hover:bg-gray-50 border-[#E6E6E6] ${index % 2 !== 0 ? 'bg-[#F9F9F9]' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
                                    onClick={(e) => handleRowClick(record, e)}
                                >

                                    {columns.map((column, colIndex) => (
                                        <TableCell key={column.key} className={`text-[12px] lg:text-[14px] gap-1 items-center ${column.minWidth} ${column.lgMinWidth} ${!firstColumnHasCheckbox && colIndex === 0 ? 'pl-5' : ''}`}>
                                            {column.render ? column.render(record, index) : record[column.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={13} className="p-0">
                                    <NoDataFoundWidget
                                       title="No data found"
                                        description={
                                            searchTerm
                                                ? `No items found matching "${searchTerm}". Try adjusting your search criteria.`
                                                : ""
                                        }
                                        size="sm"
                                        className="py-8"
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {showPagination && (
                <div className="flex items-center justify-between mt-4 mb-2">
                    <PaginationWidget
                        currentPage={currentPage}
                        totalPages={response?.data?.totalPages}
                        totalItems={response?.data?.totalElements}
                        itemsPerPage={response?.data?.size ? response.data.size : itemsPerPage}
                        onPageChange={handlePageChange}
                        className="w-full"
                    />
                </div>
            )}
        </>
    );
};

export default TableWidget;


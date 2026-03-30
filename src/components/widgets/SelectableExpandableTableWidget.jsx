"use client";

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import NoDataFoundWidget from "@/components/widgets/NoDataFoundWidget";
import PaginationWidget from "@/components/widgets/PaginationWidget";

const SelectableExpandableTableWidget = ({
    columns,
    response,
    handleSort,
    getSortIcon,
    searchTerm,
    currentPage,
    itemsPerPage,
    handlePageChange,
    height,
    renderExpandedContent,
    getRowId = (record) => record.id,
    noDataTitle = "No data found",
    noDataDescription = "No items have been added yet.",
    noDataIcon = "package",
    showNoDataAction = false,
    noDataActionText = "Add Item",
    onNoDataAction,
    minWidth,
    checkboxColumnKey = "checkbox",
    onSelectionChange,
    onRowClick,
}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [isIndeterminate, setIsIndeterminate] = useState(false);
    const [expandedRowId, setExpandedRowId] = useState(null);

    const defaultHeight = "h-[calc(100vh-230px)]";
    const tableHeight = height || defaultHeight;

    const firstColumnHasCheckbox = columns.length > 0 && columns[0].key === checkboxColumnKey;

    // Update all selected and indeterminate states
    useEffect(() => {
        if (!response?.data?.content) return;

        const totalRows = response.data.content.length;
        if (selectedRows.length === 0) {
            setIsAllSelected(false);
            setIsIndeterminate(false);
        } else if (selectedRows.length === totalRows) {
            setIsAllSelected(true);
            setIsIndeterminate(false);
        } else {
            setIsAllSelected(false);
            setIsIndeterminate(true);
        }

        // Notify parent of selection changes
        if (onSelectionChange) {
            onSelectionChange(selectedRows);
        }
    }, [selectedRows, response?.data?.content, onSelectionChange]);

    const handleSelectRow = (id, checked) => {
        if (checked) {
            setSelectedRows([...selectedRows, id]);
        } else {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        }
    };

    const handleSelectAll = (checked) => {
        if (!response?.data?.content) return;

        if (checked) {
            const allIds = response.data.content.map(row => getRowId(row));
            setSelectedRows(allIds);
            setIsAllSelected(true);
            setIsIndeterminate(false);
        } else {
            setSelectedRows([]);
            setIsAllSelected(false);
            setIsIndeterminate(false);
        }
    };

    const handleRowToggle = (rowId) => {
        setExpandedRowId(expandedRowId === rowId ? null : rowId);
    };

    const handleRowClick = (record, event) => {
        if (event.target.closest('a, button, [role="button"], [role="checkbox"], input, label')) {
            return;
        }
        if (onRowClick) {
            onRowClick(record);
        }
    };

    // Enhanced column render function that passes additional props
    const renderColumn = (column, record, index) => {
        if (column.render) {
            // Pass expanded state and toggle handler to render function
            const isExpanded = expandedRowId === getRowId(record);
            return column.render(record, index, isExpanded, handleRowToggle, {
                selectedRows,
                handleSelectRow,
                isAllSelected,
                isIndeterminate,
                handleSelectAll,
            });
        }
        return record[column.key];
    };

    // Enhanced header render function
    const renderHeader = (column) => {
        if (column.headerRender) {
            return column.headerRender({
                isAllSelected,
                isIndeterminate,
                handleSelectAll,
            });
        }
        return column.label;
    };

    return (
        <>
            <div className={`overflow-auto relative ${tableHeight} border-gray-200 border-b border-l border-r border-t rounded-md`}>
                <Table className={`rounded-lg w-full ${minWidth || ''}`}>
                    <TableHeader className="sticky top-0 z-20">
                        <TableRow className="bg-[#F1F4FF] border-[#E6E6E6]">
                            {columns.map((column, colIndex) => (
                                <TableHead
                                    key={column.key}
                                    className={`font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px] ${column.minWidth || ''} ${column.lgMinWidth || ''} ${column.sortable !== false ? 'cursor-pointer hover:text-[#00796B] transition-colors' : ''} ${!firstColumnHasCheckbox && colIndex === 0 ? 'pl-5' : ''}`}
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {renderHeader(column)}
                                        {column.sortable && getSortIcon(column.key)}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {response?.data?.content && response.data.content.length > 0 ? (
                            response.data.content.map((record, index) => {
                                const rowId = getRowId(record);
                                const isExpanded = expandedRowId === rowId;

                                return (
                                    <React.Fragment key={rowId}>
                                        <TableRow
                                            className={`hover:bg-gray-50 border-[#E6E6E6] ${index % 2 !== 0 ? 'bg-[#F9F9F9]' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
                                            onClick={(e) => handleRowClick(record, e)}
                                        >
                                            {columns.map((column, colIndex) => (
                                                <TableCell
                                                    key={column.key}
                                                    className={`text-[12px] lg:text-[14px] gap-1 items-center py-4 ${column.minWidth || ''} ${column.lgMinWidth || ''} ${!firstColumnHasCheckbox && colIndex === 0 ? 'pl-5' : ''}`}
                                                >
                                                    {renderColumn(column, record, index)}
                                                </TableCell>
                                            ))}
                                        </TableRow>

                                        {isExpanded && renderExpandedContent && (
                                            <TableRow className="bg-[#F5F5F5]">
                                                <TableCell colSpan={columns.length} className="p-0 border-0">
                                                    {renderExpandedContent(record, index)}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="p-0">
                                    <NoDataFoundWidget
                                        title={noDataTitle}
                                        description={
                                            searchTerm
                                                ? `No items found matching "${searchTerm}". Try adjusting your search criteria.`
                                                : noDataDescription
                                        }
                                        icon={noDataIcon}
                                        showAction={showNoDataAction && !searchTerm}
                                        actionText={noDataActionText}
                                        onAction={onNoDataAction}
                                        size="sm"
                                        className="py-8"
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between mt-4 mb-2">
                <PaginationWidget
                    currentPage={currentPage}
                    totalPages={response?.data?.totalPages}
                    totalItems={response?.data?.totalElements}
                    itemsPerPage={response?.data?.pageSize ? response.data.pageSize : itemsPerPage}
                    onPageChange={handlePageChange}
                    className="w-full"
                />
            </div>
        </>
    );
};

export default SelectableExpandableTableWidget;

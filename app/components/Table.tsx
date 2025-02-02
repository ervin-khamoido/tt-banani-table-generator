'use client';

import { useState } from "react";

interface TableRowItem {
  selected?: boolean;
  cells: {
    key: string;
    type: string;
    icon?: string;
    value: string | number;
  }[];
}

const Table = ({items}: {items: TableRowItem[]}) => {
    const [tableItems, setTableItems] = useState(items.map(item => ({ ...item, selected: false })));

    const setSelected = (index: number) => {
        setTableItems(tableItems.map((item, i) => i === index ? { ...item, selected: !item.selected } : item));
    }

    const deleteRow = (index: number) => {
        setTableItems(tableItems.filter((_, i) => i !== index));
    }

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });

    return (
        <table className="bg-white border shadow-sm mb-2 w-full">
            <tbody>
                {tableItems.map((item, index) => (
                    <tr className={`hover:bg-gray-50 w-full ${index !== tableItems.length - 1 ? 'border-b' : ''}`} key={'row-' + index}>
                        {item.cells.map((value) => (
                            <td key={value.key + '-' + index} className={`${value.type === 'action' ? 'py-4 px-2  w-4' : 'text-right p-4'}`}>
                                {(() => {
                                    switch (value.type) {
                                        case 'action':
                                            if (value.value === 'delete') {
                                                return (
                                                    <button className="text-gray-500 hover:text-gray-700 flex items-center" onClick={() => deleteRow(index)}>
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                );
                                            }
                                            if (value.value === 'select') {
                                                return (
                                                    <button className="text-gray-500 hover:text-gray-700 flex items-center" onClick={() => setSelected(index)}>
                                                        <span className={`material-symbols-outlined ${item.selected ? 'text-blue-500' : 'text-gray-500'}`}>
                                                            bookmark
                                                        </span>
                                                    </button>
                                                );
                                            }
                                            break;
                                        case 'date':
                                            return new Date(value.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                        case 'currency':
                                            return currencyFormatter.format(Number(value.value));
                                        default:
                                            return (
                                                <div className={`flex items-center gap-3 ${value.key !== item.cells[0].key ? 'justify-end' : ''}`}>
                                                    {value.icon && (
                                                        <span className="material-symbols-outlined">{value.icon}</span>
                                                    )}
                                                    <span className="font-medium">{value.value}</span>
                                                </div>
                                            );
                                    }
                                })()}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;
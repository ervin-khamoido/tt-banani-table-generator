import { formatCurrency, formatDate } from "@/app/utils";
import { FunctionComponent } from "react";

export interface TableCellData {
  key: string;
  type: string;
  icon?: string;
  value: string | number;
}

interface Props {
  cell: TableCellData;
  onAction?: () => void;
  selected?: boolean;
}

const TableCell: FunctionComponent<Props> = ({ cell, onAction, selected }) => {
  if (cell.type === "action" && onAction) {
    const classToRender = `material-symbols-outlined ${
      cell.value === "select" && selected ? "text-blue-500" : "text-gray-500"
    }`;

    return (
      <button
        className="text-gray-500 hover:text-gray-700 flex items-center"
        onClick={onAction}
      >
        <span className={classToRender}>{cell.value}</span>
      </button>
    );
  }

  if (cell.type === "date") {
    return <span>{formatDate(cell.value)}</span>;
  }

  if (cell.type === "currency") {
    return <span>{formatCurrency(cell.value)}</span>;
  }

  return (
    <div className="flex items-center gap-3">
      {cell.icon && (
        <span className="material-symbols-outlined">{cell.icon}</span>
      )}
      <span className="font-medium">{cell.value}</span>
    </div>
  );
};

export default TableCell;

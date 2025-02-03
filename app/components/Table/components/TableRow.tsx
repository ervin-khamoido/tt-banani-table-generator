import { FunctionComponent } from "react";
import TableCell, { TableCellData } from "./TableCell";

export interface TableRowItem {
  selected?: boolean;
  cells: TableCellData[];
}

interface Props {
  item: TableRowItem;
  index: number;
  onSelect: () => void;
  onDelete: () => void;
}

const TableRow: FunctionComponent<Props> = ({
  item,
  index,
  onSelect,
  onDelete,
}) => (
  <tr className="hover:bg-gray-50 border-b">
    {item.cells.map((cell) => {
      const key = `${cell.key}-${index}`;
      const classToRender =
        cell.type === "action" ? "py-4 px-2 w-4" : "text-right p-4";

      const actionToRender = {
        delete: onDelete,
        select: onSelect,
      }[cell.value];

      return (
        <td key={key} className={classToRender}>
          <TableCell
            cell={cell}
            onAction={actionToRender}
            selected={item.selected}
          />
        </td>
      );
    })}
  </tr>
);

export default TableRow;

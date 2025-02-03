"use client";

import { FunctionComponent, useState, useCallback } from "react";
import TableRow, { TableRowItem } from "./components/TableRow";

interface Props {
  items: TableRowItem[];
}

const Table: FunctionComponent<Props> = ({ items }) => {
  const [tableItems, setTableItems] = useState(
    items.map((item) => ({ ...item, selected: false }))
  );

  const toggleSelected = useCallback((index: number) => {
    setTableItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  }, []);

  const deleteRow = useCallback((index: number) => {
    setTableItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }, []);

  return (
    <table className="bg-white border shadow-sm mb-2 w-full">
      <tbody>
        {tableItems.map((item, index) => (
          <TableRow
            key={index}
            item={item}
            index={index}
            onSelect={() => toggleSelected(index)}
            onDelete={() => deleteRow(index)}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Table;

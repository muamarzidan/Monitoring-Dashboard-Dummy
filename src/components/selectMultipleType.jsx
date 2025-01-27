const FilterCriteria = ({ selectedColumns, setSelectedColumns, columnsConfig }) => {
    const toggleColumn = (column) => {
        setSelectedColumns((prev) => ({
            ...prev,
            [column]: !prev[column],
        }));
    };

    return (
        <div className="filter-criteria d-flex gap-3 p-3 w-full flex-wrap border my-2">
            {Object.keys(columnsConfig).map((col) => (
                <label key={col} className="d-flex gap-1 align-items-center flex-wrap">
                    <input
                        type="checkbox"
                        checked={selectedColumns[col]}
                        onChange={() => toggleColumn(col)}
                    />
                    {columnsConfig[col].label}
                </label>
            ))}
        </div>
    );
};

export default FilterCriteria;
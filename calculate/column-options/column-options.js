document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("travel-grid");
    const template = document.getElementById("calcModalTemplate");

    if (!grid || !template) return;

    let selectedRows = [];

    grid.addEventListener("row:select", () => {
        selectedRows = grid.getSelectedRows() || [];
    });

    document.addEventListener("click", (e) => {
        const button = e.target.closest(".grid-calc-button");

        if (!button) return;

        selectedRows = grid.getSelectedRows() || [];

        if (!selectedRows.length) {
            alert("Please select at least one row.");
            return;
        }

        const control = button.closest(".grid-calc-control");

        if (!control) return;

        const column = control.querySelector(".grid-calc-column")?.value;
        const operation = control.querySelector(".grid-calc-operation")?.value;

        if (!column || !operation) return;

        openCalculationModal(column, operation);
    });

    function openCalculationModal(column, operation) {
        const existingModal = document.querySelector(".calc-modal-overlay");

        if (existingModal) {
            existingModal.remove();
        }

        const modal = template.content.cloneNode(true);

        document.body.appendChild(modal);

        const overlay = document.querySelector(".calc-modal-overlay");
        const selectedValues = document.getElementById("selectedValues");
        const modalCalcOp = document.getElementById("modalCalcOp");
        const closeButton = document.getElementById("closeCalcModal");
        const calculateButton = document.getElementById("modalCalculateBtn");
        const result = document.getElementById("modalCalcResult");

        if (!overlay) return;

        modalCalcOp.value = operation;

        const rows = selectedRows
            .map((item) => item?.data || item)
            .filter((item) => item && item[column] !== undefined);

        selectedValues.innerHTML = "";

        const title = document.createElement("p");

        title.textContent =
            `Selected ${rows.length} row${rows.length === 1 ? "" : "s"}`;

        selectedValues.appendChild(title);

        rows.forEach((row) => {
            const item = document.createElement("div");

            item.className = "selected-value-item";

            item.textContent =
                `${row.trip}: ${formatValue(row[column], column)}`;

            selectedValues.appendChild(item);
        });

        const calculationInfo = document.createElement("p");

        calculationInfo.className = "calculation-info";

        calculationInfo.textContent =
            `Calculation: ${getColumnName(column)} → ${getOperationName(operation)}`;

        selectedValues.appendChild(calculationInfo);

        overlay.classList.add("is-visible");

        function calculateResult() {
            const values = rows
                .map((row) => Number(row[column]))
                .filter((value) => !Number.isNaN(value));

            if (!values.length) {
                result.textContent = "No numeric values available.";
                return;
            }

            const currentOperation = modalCalcOp.value;

            let calculationResult;

            switch (currentOperation) {
                case "sum":
                    calculationResult =
                        values.reduce((a, b) => a + b, 0);
                    break;

                case "difference":
                    calculationResult =
                        values.slice(1).reduce(
                            (a, b) => a - b,
                            values[0]
                        );
                    break;

                case "avg":
                    calculationResult =
                        values.reduce((a, b) => a + b, 0) /
                        values.length;
                    break;

                case "min":
                    calculationResult = Math.min(...values);
                    break;

                case "max":
                    calculationResult = Math.max(...values);
                    break;

                default:
                    result.textContent = "Invalid operation.";
                    return;
            }

            const formattedResult =
                Number.isInteger(calculationResult)
                    ? calculationResult.toLocaleString()
                    : calculationResult.toLocaleString(undefined, {
                        maximumFractionDigits: 2
                    });

            result.innerHTML =
                `<strong>Result:</strong> ${formatValue(formattedResult, column)}`;
        }

        calculateResult();

        calculateButton.addEventListener("click", () => {
            calculateResult();
        });

        closeButton.addEventListener("click", () => {
            overlay.remove();
        });

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    function getColumnName(column) {
        const names = {
            cost: "Cost",
            duration: "Duration",
            distance: "Distance",
            numStops: "Layovers",
            satisfaction: "Rating"
        };

        return names[column] || column;
    }

    function getOperationName(operation) {
        const names = {
            sum: "Sum",
            difference: "Difference",
            avg: "Average",
            min: "Minimum",
            max: "Maximum"
        };

        return names[operation] || operation;
    }

    function formatValue(value, column) {
        const numericValue = Number(value);

        if (Number.isNaN(numericValue)) {
            return value;
        }

        if (column === "cost") {
            return "$" + numericValue.toLocaleString();
        }

        if (column === "distance") {
            return numericValue.toLocaleString() + " miles";
        }

        if (column === "duration") {
            return numericValue.toLocaleString() + " days";
        }

        if (column === "satisfaction") {
            return numericValue.toLocaleString();
        }

        return numericValue.toLocaleString();
    }
});
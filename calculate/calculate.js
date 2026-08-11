// window.addEventListener("DOMContentLoaded", () => {
//     const grid = document.getElementById("travel-grid");
//     const calcColumn = document.getElementById("calcColumn");
//     const calcOp = document.getElementById("calcOp");
//     const calcBtn = document.getElementById("calcBtn");
//     const resetBtn = document.getElementById("resetBtn");
//     const modalTemplate = document.getElementById("calcModalTemplate");

//     const columnNames = {
//         cost: "Cost of Trip",
//         duration: "Duration",
//         distance: "Distance",
//         numStops: "Number of Layovers",
//         satisfaction: "Overall Rating"
//     };

//     const modalOperationSelect = modalTemplate.content.querySelector("#modalCalcOp");

//     if (modalOperationSelect && !modalOperationSelect.querySelector('option[value="difference"]')) {
//         const differenceOption = document.createElement("option");
//         differenceOption.value = "difference";
//         differenceOption.textContent = "Difference";
//         modalOperationSelect.appendChild(differenceOption);
//     }

//     let selectedRows = [];

//     grid.addEventListener("row:select", (event) => {
//         if (event.detail && Array.isArray(event.detail.selectedRows)) {
//             selectedRows = event.detail.selectedRows;
//         } else {
//             selectedRows = grid.getSelectedRows() || [];
//         }
//     });

//     calcBtn.addEventListener("click", () => {
//         selectedRows = grid.getSelectedRows() || [];

//         if (selectedRows.length === 0) {
//             openCalcModal({
//                 error: "Please select at least one row from the grid."
//             });
//             return;
//         }

//         const column = calcColumn.value;
//         const operation = calcOp.value;

//         const values = selectedRows
//             .map(row => Number(row[column]))
//             .filter(value => !Number.isNaN(value));

//         if (values.length === 0) {
//             openCalcModal({
//                 error: "The selected column does not contain numeric values."
//             });
//             return;
//         }

//         const result = calculateValues(values, operation);

//         openCalcModal({
//             column,
//             operation,
//             values,
//             rows: selectedRows,
//             result
//         });
//     });

//     resetBtn.addEventListener("click", () => {
//         if (typeof grid.deselectRows === "function") {
//             grid.deselectRows();
//         }

//         selectedRows = [];
//         calcColumn.selectedIndex = 0;
//         calcOp.value = "sum";
//         closeCalcModal();
//     });

//     function calculateValues(values, operation) {
//         if (!values || values.length === 0) {
//             return null;
//         }

//         switch (operation) {
//             case "sum":
//                 return values.reduce((total, value) => total + value, 0);

//             case "difference":
//                 return values.slice(1).reduce(
//                     (total, value) => total - value,
//                     values[0]
//                 );

//             case "avg":
//                 return values.reduce(
//                     (total, value) => total + value,
//                     0
//                 ) / values.length;

//             case "min":
//                 return Math.min(...values);

//             case "max":
//                 return Math.max(...values);

//             default:
//                 return null;
//         }
//     }

//     function openCalcModal(calculation) {
//         closeCalcModal();

//         const modal = modalTemplate.content.cloneNode(true);
//         document.body.appendChild(modal);

//         const closeButton = document.getElementById("closeCalcModal");
//         const selectedValuesContainer = document.getElementById("selectedValues");
//         const modalOperation = document.getElementById("modalCalcOp");
//         const modalCalculateButton = document.getElementById("modalCalculateBtn");
//         const modalResult = document.getElementById("modalCalcResult");

//         closeButton.addEventListener("click", closeCalcModal);

//         const overlay = document.querySelector(".calc-modal-overlay");

//         overlay.addEventListener("click", (event) => {
//             if (event.target === overlay) {
//                 closeCalcModal();
//             }
//         });

//         if (calculation.error) {
//             selectedValuesContainer.innerHTML = `
//                 <div class="calc-error">
//                     ${calculation.error}
//                 </div>
//             `;

//             modalCalculateButton.style.display = "none";
//             modalResult.innerHTML = "";
//             return;
//         }

//         modalOperation.value = calculation.operation;

//         selectedValuesContainer.innerHTML = `
//             <div class="calc-info">
//                 <div>
//                     <strong>Column:</strong>
//                     ${columnNames[calculation.column]}
//                 </div>
//                 <div>
//                     <strong>Rows selected:</strong>
//                     ${calculation.rows.length}
//                 </div>
//             </div>
//             <div class="calc-values">
//                 ${calculation.values.map((value, index) => {
//                     const row = calculation.rows[index];

//                     return `
//                         <div class="calc-value-row">
//                             <span>${row.trip || `Row ${index + 1}`}</span>
//                             <strong>
//                                 ${formatValue(value, calculation.column)}
//                             </strong>
//                         </div>
//                     `;
//                 }).join("")}
//             </div>
//         `;

//         displayResult(
//             calculation.result,
//             calculation.operation,
//             calculation.values,
//             calculation.column
//         );

//         modalCalculateButton.addEventListener("click", () => {
//             const operation = modalOperation.value;

//             const result = calculateValues(
//                 calculation.values,
//                 operation
//             );

//             displayResult(
//                 result,
//                 operation,
//                 calculation.values,
//                 calculation.column
//             );
//         });
//     }

//     function displayResult(result, operation, values, column) {
//         const modalResult = document.getElementById("modalCalcResult");

//         if (!modalResult) {
//             return;
//         }

//         const operationNames = {
//             sum: "Sum",
//             difference: "Difference",
//             avg: "Average",
//             min: "Minimum",
//             max: "Maximum"
//         };

//         const operationName = operationNames[operation];
//         let expression = "";

//         if (operation === "difference") {
//             expression = values
//                 .map(value => formatValue(value, column))
//                 .join(" − ");
//         }

//         modalResult.innerHTML = `
//             <div class="calc-result-label">
//                 ${operationName}
//             </div>
//             ${operation === "difference" ? `
//                 <div class="calc-expression">
//                     ${expression}
//                 </div>
//             ` : ""}
//             <div class="calc-result-number">
//                 ${formatValue(result, column)}
//             </div>
//         `;
//     }

//     function formatValue(value, column) {
//         if (value === null || value === undefined) {
//             return "—";
//         }

//         if (column === "cost") {
//             return value.toLocaleString("en-US", {
//                 style: "currency",
//                 currency: "USD",
//                 maximumFractionDigits: 2
//             });
//         }

//         return Number(value).toLocaleString("en-US", {
//             maximumFractionDigits: 2
//         });
//     }

//     function closeCalcModal() {
//         const existingModal = document.querySelector(".calc-modal-overlay");

//         if (existingModal) {
//             existingModal.remove();
//         }
//     }

//     document.addEventListener("keydown", (event) => {
//         if (event.key === "Escape") {
//             closeCalcModal();
//         }
//     });
// });

const grid = document.getElementById("travel-grid");
const dataElement = document.getElementById("travel-data");
const calcBtn = document.getElementById("calcBtn");
const resetBtn = document.getElementById("resetBtn");
const selectedCount = document.getElementById("selectedCount");

let originalData = JSON.parse(dataElement.getAttribute("data"));
let selectedRows = [];

grid.addEventListener("row:select", event => {
    selectedRows = grid.getSelectedRows();
    updateSelectedCount();
});

function updateSelectedCount() {
    const count = selectedRows.length;

    selectedCount.textContent =
        count === 1
            ? "1 row selected"
            : `${count} rows selected`;
}

calcBtn.addEventListener("click", () => {
    selectedRows = grid.getSelectedRows();

    if (selectedRows.length === 0) {
        alert("Select at least one row.");
        return;
    }

    const column = document.getElementById("calcColumn").value;
    const operation = document.getElementById("calcOp").value;

    const values = selectedRows
        .map(row => Number(row[column]))
        .filter(value => !isNaN(value));

    if (values.length === 0) {
        alert("The selected column does not contain numeric values.");
        return;
    }

    const result = calculate(values, operation);

    openCalcModal(
        selectedRows,
        column,
        operation,
        values,
        result
    );
});

function calculate(values, operation) {
    switch (operation) {
        case "sum":
            return values.reduce((total, value) => total + value, 0);

        case "difference":
            return values.slice(1).reduce(
                (total, value) => total - value,
                values[0]
            );

        case "avg":
            return values.reduce(
                (total, value) => total + value,
                0
            ) / values.length;

        case "min":
            return Math.min(...values);

        case "max":
            return Math.max(...values);

        default:
            return 0;
    }
}

function openCalcModal(rows, column, operation, values, result) {
    const template = document.getElementById("calcModalTemplate");
    const modal = template.content.cloneNode(true);

    document.body.appendChild(modal);

    const selectedValues = document.getElementById("selectedValues");
    const modalCalcOp = document.getElementById("modalCalcOp");
    const modalCalcResult = document.getElementById("modalCalcResult");

    modalCalcOp.value = operation;

    selectedValues.innerHTML = rows.map((row, index) => `
        <div class="calc-value-row">
            <span>${row.trip}</span>
            <strong>${formatValue(row[column])}</strong>
        </div>
    `).join("");

    modalCalcResult.innerHTML = `
        <div class="calc-result-label">
            ${getOperationLabel(operation)}
        </div>

        <div class="calc-expression">
            ${values.map(value => formatValue(value)).join(
                operation === "difference" ? " − " : " + "
            )}
        </div>

        <div class="calc-result-number">
            ${formatValue(result)}
        </div>
    `;

    document
        .getElementById("closeCalcModal")
        .addEventListener("click", closeCalcModal);

    document
        .getElementById("modalCalculateBtn")
        .addEventListener("click", () => {
            const newOperation = modalCalcOp.value;
            const newResult = calculate(values, newOperation);

            modalCalcResult.innerHTML = `
                <div class="calc-result-label">
                    ${getOperationLabel(newOperation)}
                </div>

                <div class="calc-expression">
                    ${values.map(value => formatValue(value)).join(
                        newOperation === "difference" ? " − " : " + "
                    )}
                </div>

                <div class="calc-result-number">
                    ${formatValue(newResult)}
                </div>
            `;
        });
}

function getOperationLabel(operation) {
    switch (operation) {
        case "sum":
            return "Sum";

        case "difference":
            return "Difference";

        case "avg":
            return "Average";

        case "min":
            return "Minimum";

        case "max":
            return "Maximum";

        default:
            return "Result";
    }
}

function formatValue(value) {
    if (typeof value !== "number") {
        return value;
    }

    if (Number.isInteger(value)) {
        return value.toLocaleString();
    }

    return value.toLocaleString(undefined, {
        maximumFractionDigits: 2
    });
}

function closeCalcModal() {
    const modal = document.querySelector(".calc-modal-overlay");

    if (modal) {
        modal.remove();
    }
}

resetBtn.addEventListener("click", () => {
    dataElement.setAttribute(
        "data",
        JSON.stringify(originalData)
    );

    selectedRows = [];

    if (grid.deselectRows) {
        grid.deselectRows();
    }

    updateSelectedCount();

    closeCalcModal();
});
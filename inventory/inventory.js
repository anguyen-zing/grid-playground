function statusColor(status) {
    if (status === "Out of Stock") {
        return "status-out";
    }

    if (status === "Low Stock") {
        return "status-low";
    }

    return "";
}

function getRestockStatus(stock) {
    stock = Number(stock);

    if (stock === 0) {
        return "Out of Stock";
    }

    if (stock <= 5) {
        return "Low Stock";
    }

    return null;
}

function updateRestockGrid(inventoryGrid, restockGrid) {
    const inventoryData = inventoryGrid.getData();

    const restockData = inventoryData
        .map(record => {
            const stock = Number(record.stock);
            const status = getRestockStatus(stock);

            if (!status) {
                return null;
            }

            return {
                name: record.name,
                stock: stock,
                status: status
            };
        })
        .filter(record => record !== null);

    restockGrid.setData(restockData);
}

window.addEventListener("load", () => {
    const restockGrid = document.querySelector("#restock-grid");
    const inventoryGrid = document.querySelector("#inventory-grid");
    const restockButton = document.querySelector("#restock-button");

    if (!restockButton || !restockGrid || !inventoryGrid) {
        return;
    }

    setTimeout(() => {
        updateRestockGrid(inventoryGrid, restockGrid);
    }, 500);

    const modal = buildRestockModal();

    document.body.appendChild(modal.overlay);

    restockButton.addEventListener("click", () => {
        populateProductOptions(
            modal.select,
            inventoryGrid.getData()
        );

        modal.qtyInput.value = "";
        modal.error.classList.remove("visible");
        modal.overlay.classList.add("open");
        modal.select.focus();
    });

    modal.form.addEventListener("submit", (e) => {
        e.preventDefault();

        const productName = modal.select.value;
        const qty = parseInt(modal.qtyInput.value, 10);

        if (!productName) {
            showError(
                modal.error,
                "Please select a product."
            );
            return;
        }

        if (
            !modal.qtyInput.value ||
            isNaN(qty) ||
            qty <= 0
        ) {
            showError(
                modal.error,
                "Please enter a valid positive number."
            );
            return;
        }

        restockProduct(
            inventoryGrid,
            restockGrid,
            productName,
            qty
        );

        modal.overlay.classList.remove("open");
    });

    modal.cancelBtn.addEventListener("click", () => {
        modal.overlay.classList.remove("open");
    });

    modal.overlay.addEventListener("click", (e) => {
        if (e.target === modal.overlay) {
            modal.overlay.classList.remove("open");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (
            e.key === "Escape" &&
            modal.overlay.classList.contains("open")
        ) {
            modal.overlay.classList.remove("open");
        }
    });

    let previousData = JSON.stringify(
        inventoryGrid.getData()
    );

    setInterval(() => {
        const currentData = JSON.stringify(
            inventoryGrid.getData()
        );

        if (currentData !== previousData) {
            previousData = currentData;

            updateRestockGrid(
                inventoryGrid,
                restockGrid
            );
        }
    }, 300);
});

function buildRestockModal() {
    const overlay = document.createElement("div");

    overlay.className = "restock-modal-overlay";

    overlay.innerHTML = `
        <div class="restock-modal">
            <h2>Restock Product</h2>

            <p class="restock-modal-subtitle">
                Choose a product and how many units to add.
            </p>

            <form novalidate>
                <label for="restock-product-select">
                    Product
                </label>

                <select
                    id="restock-product-select"
                    required>
                </select>

                <label for="restock-qty-input">
                    Quantity to add
                </label>

                <input
                    type="number"
                    id="restock-qty-input"
                    min="1"
                    step="1"
                    placeholder="e.g. 10"
                    required
                >

                <p class="restock-modal-error"></p>

                <div class="restock-modal-actions">
                    <button
                        type="button"
                        class="restock-modal-cancel">
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="restock-modal-submit">
                        Restock
                    </button>
                </div>
            </form>
        </div>
    `;

    return {
        overlay: overlay,
        form: overlay.querySelector("form"),
        select: overlay.querySelector(
            "#restock-product-select"
        ),
        qtyInput: overlay.querySelector(
            "#restock-qty-input"
        ),
        error: overlay.querySelector(
            ".restock-modal-error"
        ),
        cancelBtn: overlay.querySelector(
            ".restock-modal-cancel"
        )
    };
}

function populateProductOptions(
    select,
    inventoryData
) {
    const sorted = [...inventoryData].sort(
        (a, b) => a.name.localeCompare(b.name)
    );

    select.innerHTML = sorted
        .map(record => {
            return `
                <option value="${record.name}">
                    ${record.name} (${record.stock} in stock)
                </option>
            `;
        })
        .join("");
}

function showError(errorEl, message) {
    errorEl.textContent = message;
    errorEl.classList.add("visible");
}

function restockProduct(
    inventoryGrid,
    restockGrid,
    name,
    qty
) {
    const normalized = name.toLowerCase();

    const inventoryData =
        inventoryGrid.getData();

    const updatedInventory =
        inventoryData.map(record => {
            if (
                record.name.toLowerCase() ===
                normalized
            ) {
                return {
                    ...record,
                    stock:
                        Number(record.stock) + qty
                };
            }

            return record;
        });

    inventoryGrid.setData(
        updatedInventory
    );

    setTimeout(() => {
        updateRestockGrid(
            inventoryGrid,
            restockGrid
        );
    }, 100);
}
const file_array = ["/concert/resale_price.json", "/concert/venue_price.json"];

let all_reconciliation_data = [];
let current_discrepancy_threshold = 25;

async function loadJSON(file_array) {
    try {
        const promises = file_array.map(async function (file) {
            const response = await fetch(file);

            if(!response.ok) {
                throw new Error("Failed to load " + file + ". Status code: " + response.status);
            } 
            const data = await response.json();
            return data;
        });

        const all_data = await Promise.all(promises);
        return all_data;
    }
    catch (error) {
        console.error("Failed to load JSON files:", error);
        throw error;
    }
}

function compare_price(resale_price, venue_price) {
    const price_difference = resale_price - venue_price;
    const absolute_difference = Math.abs(price_difference);

    let percentage_difference = 0;
    let recommended_price;
    let status;

    if (venue_price !== 0) {
        percentage_difference = absolute_difference / venue_price * 100;
    }

    if (price_difference < 0) {
        status = "Resale";
        recommended_price = resale_price;
    }
    else if (price_difference > 0) {
        status = "Venue";
        recommended_price = venue_price;
    }
    else {
        status = "No difference";
        recommended_price = venue_price;
    }

    return {
        price_difference: price_difference,
        absolute_difference: absolute_difference,
        percentage_difference: Number(percentage_difference.toFixed(2)),
        recommended_price: recommended_price,
        status: status
    };
}

function format_currency(value) {
    if (value === null || value === undefined) {
        return "Not available";
    }

    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });
}

function get_cell_record(cell_reference) {
    if (!cell_reference) {
        return null;
    }

    if (cell_reference.record) {
        return cell_reference.record;
    }

    if (cell_reference.data && cell_reference.data.record) {
        return cell_reference.data.record;
    }

    return null;
}

function flag_discrepancy(cell_value, cell_dom_reference, cell_reference) {
    const record = get_cell_record(cell_reference);

    if (!record) {
        return "";
    }

    if (record.status === "Missing Resale Record") {
        return "missing-record-cell";
    }

    if (record.requires_review === true) {
        return "review-required-cell";
    }

    if (record.absolute_difference === 0) {
        return "no-discrepancy-cell";
    }

    return "normal-discrepancy-cell";
}

function flag_pricing_source(cell_value, cell_dom_reference, cell_reference) {
    const record = get_cell_record(cell_reference);

    if (!record) {
        return "";
    }

    if (record.status === "Missing Resale Record") {
        return "missing-record-cell";
    }

    if (record.status === "Resale") {
        return "resale-deal-cell";
    }

    if (record.status === "Venue") {
        return "venue-deal-cell";
    }

    return "no-discrepancy-cell";
}

function flag_review(cell_value, cell_dom_reference, cell_reference) {
    const record = get_cell_record(cell_reference);

    if (!record) {
        return "";
    }

    if (record.requires_review === true) {
        return "review-required-cell";
    }

    return "review-not-required-cell";
}

window.flag_discrepancy = flag_discrepancy;
window.flag_pricing_source = flag_pricing_source;
window.flag_review = flag_review;

async function reconcile_data() {
    const loaded_data = await loadJSON(file_array);
    const resale_data = loaded_data[0];
    const venue_data = loaded_data[1];
    
    const resale_lookup_table = {};
    const reconciliation_data = [];

    resale_data.forEach(function (ticket) {
        resale_lookup_table[ticket.id] = ticket;
    });

    venue_data.forEach(function (venue_ticket) {
        const resale_ticket = resale_lookup_table[venue_ticket.id];

        if (!resale_ticket) {
            reconciliation_data.push({
                id: venue_ticket.id,
                artist: venue_ticket.artist,
                venue: venue_ticket.venue,
                venue_price: venue_ticket.totalPrice,
                resale_price: null,
                absolute_difference: null,
                percentage_difference: null,
                venue_price_display: format_currency(venue_ticket.totalPrice),
                resale_price_display: "Not available",
                absolute_difference_display: "Not available",
                percentage_difference_display: "Not available",
                recommended_price_display: format_currency(venue_ticket.totalPrice),
                status: "Missing Resale Record",
                requires_review: true,
                requires_review_display: "Yes"
            });

            return;
        }

        const comparison = compare_price(resale_ticket.totalPrice, venue_ticket.totalPrice);
        const requires_review = comparison.absolute_difference >= current_discrepancy_threshold;

        let review_display = "No";

        if (requires_review === true) {
            review_display = "Yes";
        }

        reconciliation_data.push({
            id: venue_ticket.id,
            artist: venue_ticket.artist,
            venue: venue_ticket.venue,
            venue_price: venue_ticket.totalPrice,
            resale_price: resale_ticket.totalPrice,
            absolute_difference: comparison.absolute_difference,
            percentage_difference: comparison.percentage_difference,
            venue_price_display: format_currency(venue_ticket.totalPrice),
            resale_price_display: format_currency(resale_ticket.totalPrice),
            absolute_difference_display: format_currency(comparison.absolute_difference),
            percentage_difference_display: comparison.percentage_difference + "%",
            recommended_price_display: format_currency(comparison.recommended_price),
            status: comparison.status,
            requires_review: requires_review,
            requires_review_display: review_display
        });
    });

    return reconciliation_data;
}

function update_grid(reconciliation_data) {
    const grid = document.querySelector("#reconciliation-grid");
    grid.setData(reconciliation_data);
}

function filter_reconciliation_data() {
    const threshold_element = document.querySelector("#discrepancy_threshold");
    const status_filter_element = document.querySelector("#status_filter");
    const selected_threshold = Number(threshold_element.value);
    const selected_status = status_filter_element.value;

    const filtered_data = all_reconciliation_data.filter(function (record) {
        let passes_threshold = true;
        let passes_status = true;

        if (record.absolute_difference !== null) {
            passes_threshold = record.absolute_difference >= selected_threshold;
        }

        if (selected_status !== "All") {
            passes_status = record.status === selected_status;
        }

        return passes_threshold === true && passes_status === true;
    });

    update_grid(filtered_data);
}

async function update_discrepancy_threshold() {
    const threshold_element = document.querySelector("#discrepancy_threshold");
    current_discrepancy_threshold = Number(threshold_element.value);
    all_reconciliation_data = await reconcile_data();
    filter_reconciliation_data();
}

function reset_filters() {
    const threshold_element = document.querySelector("#discrepancy_threshold");
    const status_filter_element = document.querySelector("#status_filter");

    threshold_element.value = "25";
    status_filter_element.value = "All";
    current_discrepancy_threshold = 25;

    display_reconciliation_data();
}

function export_reconciliation_data() {
    const json_data = JSON.stringify(all_reconciliation_data, null, 4);
    const json_blob = new Blob([json_data], { type: "application/json" });
    const json_url = URL.createObjectURL(json_blob);
    const download_link = document.createElement("a");

    download_link.href = json_url;
    download_link.download = "concert_ticket_reconciliation.json";

    document.body.appendChild(download_link);
    download_link.click();
    document.body.removeChild(download_link);
    URL.revokeObjectURL(json_url);
}

async function display_reconciliation_data() {
    const grid = document.querySelector("#reconciliation-grid");

    try {
        all_reconciliation_data = await reconcile_data();

        grid.executeOnLoad(function () {
            update_grid(all_reconciliation_data);
        });
    }
    catch (error) {
        console.error("Unable to display reconciliation data:", error);
        grid.setAttribute("caption", "Unable to Load Reconciliation Data");
    }
}

function add_event_listeners() {
    const discrepancy_threshold = document.querySelector("#discrepancy_threshold");
    const status_filter = document.querySelector("#status_filter");
    const reset_filters_button = document.querySelector("#reset_filters_button");
    const export_button = document.querySelector("#export_button");

    discrepancy_threshold.addEventListener("change", update_discrepancy_threshold);
    status_filter.addEventListener("change", filter_reconciliation_data);
    reset_filters_button.addEventListener("click", reset_filters);
    export_button.addEventListener("click", export_reconciliation_data);
}

async function initialize_dashboard() {
    add_event_listeners();
    await display_reconciliation_data();
}

initialize_dashboard();
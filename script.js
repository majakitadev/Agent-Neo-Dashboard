document.addEventListener("DOMContentLoaded", function () {
    const table = document.querySelector("#neo-table");
    if (!table) {
        console.error("Table not found!");
        return;
    }

    const headers = table.querySelectorAll("thead th");
    const tbody = table.querySelector("tbody");

    if (!headers.length || !tbody) {
        console.error("Table headers or tbody not found!");
        return;
    }

    function sortTable(columnIndex) {
        const rows = Array.from(tbody.querySelectorAll("tr"));
        if (rows.length === 0) {
            console.warn("No data in table to sort.");
            return;
        }

        console.log(`Sorting column ${columnIndex + 1}`);

        // Determine sorting direction
        const header = headers[columnIndex];
        const isAscending = header.dataset.order === "asc";
        const direction = isAscending ? -1 : 1;

        // Remove sorting indicators from all headers
        headers.forEach(h => {
            h.dataset.order = "";
            h.querySelector(".arrow").textContent = ""; // Clear arrows
        });

        // Set new sorting order and update arrow
        header.dataset.order = isAscending ? "desc" : "asc";
        header.querySelector(".arrow").textContent = isAscending ? " ▼" : " ▲";

        // Sort rows
        rows.sort((rowA, rowB) => {
            let cellA = rowA.children[columnIndex]?.textContent.trim() || "";
            let cellB = rowB.children[columnIndex]?.textContent.trim() || "";

            console.log(`Comparing: "${cellA}" vs "${cellB}"`);

            // Check if values are numbers
            const numA = parseFloat(cellA);
            const numB = parseFloat(cellB);

            if (!isNaN(numA) && !isNaN(numB)) {
                return (numA - numB) * direction; // Numeric sorting
            } else {
                return cellA.localeCompare(cellB, undefined, { numeric: true, sensitivity: 'base' }) * direction;
            }
        });

        // Append sorted rows back
        tbody.innerHTML = ""; // Clear tbody
        rows.forEach(row => tbody.appendChild(row));

        console.log("Sorting completed!");
    }

    // Attach sorting event listeners to headers
    headers.forEach((header, index) => {
        // Add arrow span inside the header
        header.innerHTML += ` <span class="arrow"></span>`;

        header.addEventListener("click", () => sortTable(index));
    });

    // Check if data is dynamically inserted
    const observer = new MutationObserver(() => {
        console.log("Table data updated! Enabling sorting...");
        headers.forEach((header, index) => {
            header.addEventListener("click", () => sortTable(index));
        });
    });

    observer.observe(tbody, { childList: true });
});

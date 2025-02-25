document.addEventListener("DOMContentLoaded", function () {
    const table = document.querySelector("#neo-table"); // Use the correct ID
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

    function attachSorting() {
        headers.forEach((header, index) => {
            header.addEventListener("click", () => {
                console.log(`Sorting column ${index + 1}: ${header.textContent.trim()}`); // Debugging log

                const rows = Array.from(tbody.querySelectorAll("tr"));
                if (rows.length === 0) {
                    console.warn("No data in table to sort.");
                    return;
                }

                const isAscending = header.classList.contains("asc");
                const direction = isAscending ? -1 : 1;

                // Remove sorting classes from all headers
                headers.forEach(h => h.classList.remove("asc", "desc"));
                header.classList.add(isAscending ? "desc" : "asc");

                rows.sort((rowA, rowB) => {
                    let cellA = rowA.children[index]?.textContent.trim() || "";
                    let cellB = rowB.children[index]?.textContent.trim() || "";

                    console.log(`Comparing: "${cellA}" vs "${cellB}"`); // Debugging log

                    const numA = parseFloat(cellA);
                    const numB = parseFloat(cellB);

                    if (!isNaN(numA) && !isNaN(numB)) {
                        return (numA - numB) * direction; // Numeric sorting
                    } else {
                        return cellA.localeCompare(cellB, undefined, { numeric: true, sensitivity: 'base' }) * direction;
                    }
                });

                // Append sorted rows back
                tbody.innerHTML = ""; // Clear current rows
                rows.forEach(row => tbody.appendChild(row));

                console.log("Sorting completed!"); // Debugging log
            });
        });
    }

    // If your table gets data dynamically, use MutationObserver
    const observer = new MutationObserver(() => {
        console.log("Table data updated! Enabling sorting...");
        attachSorting();
    });

    observer.observe(tbody, { childList: true });

    // If the table is already populated, attach sorting immediately
    if (tbody.children.length > 0) {
        attachSorting();
    }
});

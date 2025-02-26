document.addEventListener("DOMContentLoaded", function () {
    const table = document.querySelector("#neo-table");
    if (!table) {
        console.error("Table not found!");
        return;
    }

    const tbody = table.querySelector("tbody");
    if (!tbody) {
        console.error("Table body not found!");
        return;
    }

    function sortTableByScore() {
        const rows = Array.from(tbody.querySelectorAll("tr"));
        if (rows.length === 0) {
            console.warn("No data in table to sort.");
            return;
        }

        console.log("Auto-sorting by ITS Score...");

        // Change the index if the ITS Score column is different
        const scoreColumnIndex = 2; 

        rows.sort((rowA, rowB) => {
            let cellA = rowA.children[scoreColumnIndex]?.textContent.trim() || "0";
            let cellB = rowB.children[scoreColumnIndex]?.textContent.trim() || "0";

            // Convert to numbers
            const numA = parseFloat(cellA);
            const numB = parseFloat(cellB);

            return numB - numA; // Descending order (highest score at the top)
        });

        // Append sorted rows back
        tbody.innerHTML = "";
        rows.forEach(row => tbody.appendChild(row));

        console.log("Sorting completed!");
    }

    // Run auto-sort when data is dynamically inserted
    const observer = new MutationObserver(() => {
        console.log("Table data updated! Sorting again...");
        sortTableByScore();
    });

    observer.observe(tbody, { childList: true });

    // Initial sort when page loads
    sortTableByScore();
});

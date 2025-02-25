document.addEventListener("DOMContentLoaded", function () {
    const table = document.querySelector("table");
    const headers = table.querySelectorAll("th");
    const tbody = table.querySelector("tbody");

    headers.forEach((header, index) => {
        header.addEventListener("click", () => {
            const rows = Array.from(tbody.querySelectorAll("tr"));
            const isAscending = header.classList.contains("asc");
            const direction = isAscending ? -1 : 1;

            // Remove sorting classes from all headers
            headers.forEach(h => h.classList.remove("asc", "desc"));
            header.classList.add(isAscending ? "desc" : "asc");

            // Sort rows based on content type (numbers vs text)
            rows.sort((rowA, rowB) => {
                let cellA = rowA.children[index].innerText.trim();
                let cellB = rowB.children[index].innerText.trim();

                // Convert numeric values properly for sorting
                let numA = parseFloat(cellA.replace(/[^0-9.-]/g, ""));
                let numB = parseFloat(cellB.replace(/[^0-9.-]/g, ""));

                // Check if values are numbers
                if (!isNaN(numA) && !isNaN(numB)) {
                    return (numA - numB) * direction;
                } else {
                    return cellA.localeCompare(cellB, undefined, { numeric: true }) * direction;
                }
            });

            // Append sorted rows
            rows.forEach(row => tbody.appendChild(row));
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const table = document.querySelector("table");
    const headers = table.querySelectorAll("th");
    const tbody = table.querySelector("tbody");

    headers.forEach((header, index) => {
        header.addEventListener("click", () => {
            const rows = Array.from(tbody.querySelectorAll("tr"));
            const isAscending = header.classList.contains("asc");
            const direction = isAscending ? -1 : 1;

            // Remove previous sorting class from all headers
            headers.forEach(h => h.classList.remove("asc", "desc"));
            header.classList.add(isAscending ? "desc" : "asc");

            rows.sort((rowA, rowB) => {
                let cellA = rowA.children[index].textContent.trim();
                let cellB = rowB.children[index].textContent.trim();

                // Convert to numbers if applicable
                const numA = parseFloat(cellA);
                const numB = parseFloat(cellB);

                if (!isNaN(numA) && !isNaN(numB)) {
                    return (numA - numB) * direction; // Numeric sorting
                } else {
                    return cellA.localeCompare(cellB, undefined, { numeric: true, sensitivity: 'base' }) * direction;
                }
            });

            // Append sorted rows back to the table using DocumentFragment for better performance
            const fragment = document.createDocumentFragment();
            rows.forEach(row => fragment.appendChild(row));
            tbody.appendChild(fragment);
        });
    });
});

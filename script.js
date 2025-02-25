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

            // Sort rows
            rows.sort((rowA, rowB) => {
                const cellA = rowA.children[index].innerText.trim().toLowerCase();
                const cellB = rowB.children[index].innerText.trim().toLowerCase();

                return cellA.localeCompare(cellB, undefined, { numeric: true }) * direction;
            });

            // Append sorted rows
            rows.forEach(row => tbody.appendChild(row));
        });
    });
});

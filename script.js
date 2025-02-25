document.addEventListener("DOMContentLoaded", function () {
    const table = document.querySelector("table");
    const headers = table.querySelectorAll("th");
    const tbody = table.querySelector("tbody");

    headers.forEach((header, index) => {
        header.addEventListener("click", () => {
            const rows = Array.from(tbody.querySelectorAll("tr"));
            const isAscending = header.classList.contains("asc");
            const direction = isAscending ? -1 : 1;

            // Remove previous sorting class
            headers.forEach(h => h.classList.remove("asc", "desc"));
            header.classList.add(isAscending ? "desc" : "asc");

            rows.sort((rowA, rowB) => {
                let cellA = rowA.children[index]?.innerText.trim() || "0"; // Fix undefined issue
                let cellB = rowB.children[index]?.innerText.trim() || "0"; 

                // Convert to number if column is ITS Score
                if (index === 2) {  
                    cellA = parseFloat(cellA) || 0;
                    cellB = parseFloat(cellB) || 0;
                }

                return (cellA > cellB ? 1 : -1) * direction;
            });

            rows.forEach(row => tbody.appendChild(row));
        });
    });
});


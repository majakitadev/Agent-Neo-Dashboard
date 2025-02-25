document.addEventListener("DOMContentLoaded", function () {
    fetch("neo_data.json")
        .then(response => response.json())
        .then(data => {
            let tableBody = document.querySelector("#neo-table tbody");
            tableBody.innerHTML = "";

            data.forEach((item, index) => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.Number}</td>
                    <td>${item.Influencer}</td>
                    <td>${item.ITS_Score}</td>
                    <td>${item.Verdict}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading data:", error));
});

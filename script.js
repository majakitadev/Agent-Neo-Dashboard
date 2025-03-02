$(window).on("load resize", function () {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({ 'padding-right': scrollWidth });
}).resize();

$(document).ready(function () {
    let tableBody = $(".tbl-content tbody");

    // 🔹 Load previous ranking from localStorage (or API)
    let prevRanking = JSON.parse(localStorage.getItem("prevRanking")) || {};

    // 🔹 Fetch Data from Google Sheets
    $.ajax({
        url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpUf-yalHcpEA_eDdYubWxNKn5HrEKsOFJBXJImWDxpHdJol8t90iItmnH8JcQXWY1lUjOihsVFwRA/pub?output=csv",
        dataType: "text",
        success: function (data) {
            let rows = data.split("\n").slice(1); // Skip header row
            let tableRows = [];

            rows.forEach((row, index) => {
                let cols = row.split(",");

                if (cols.length >= 3) {
                    let influencer = cols[0].trim();
                    
                    // Convert score to float and format to 1 decimal
                    let score = parseFloat(cols[1].replace(/[^0-9.]/g, "")).toFixed(1);
                    
                    // Remove quotes from verdict
                    let verdict = cols[2].trim().replace(/^"|"$/g, "");

                    tableRows.push({ influencer, score, verdict });
                }
            });

            // 🔹 Sort data by score (highest to lowest)
            tableRows.sort((a, b) => b.score - a.score);

            // 🔹 Track Rank Changes
            let newRanking = {};
            tableBody.empty();
            tableRows.forEach((entry, index) => {
                let prevRank = prevRanking[entry.influencer] || index + 1; // Default to current rank if no previous record
                let rankChange = prevRank - (index + 1);
                
                // Determine CSS class for rank change
                let rankClass = rankChange > 0 ? "rank-up" : rankChange < 0 ? "rank-down" : "";

                // Determine Trust Level Color
                let trustColorClass = "trust-red"; // Default is very low trust
                if (entry.score >= 7) {
                    trustColorClass = "trust-green";
                } else if (entry.score >= 5) {
                    trustColorClass = "trust-orange";
                } else if (entry.score >= 3) {
                    trustColorClass = "trust-yellow";
                }

                // Store new ranking for next update
                newRanking[entry.influencer] = index + 1;

                let row = `<tr>
                    <td>${index + 1}</td>
                    <td>
                        <span class="blinking-dot ${trustColorClass}"></span> 
                        ${entry.influencer}
                    </td>
                    <td>${entry.score}</td>
                    <td>${entry.verdict}</td>
                    <td class="${rankClass}">(${Math.abs(rankChange)})</td>
                </tr>`;
                tableBody.append(row);
            });

            // 🔹 Save new ranking in localStorage for next update
            localStorage.setItem("prevRanking", JSON.stringify(newRanking));
        }
    });
});

// 🔹 Search Function for Influencers
function searchTable() {
    let input = document.getElementById("searchInput").value.toUpperCase();
    let table = document.querySelector(".tbl-content table");
    let tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td")[1]; // 1 is the "Influencer" column index
        if (td) {
            let txtValue = td.textContent || td.innerText;
            tr[i].style.display = txtValue.toUpperCase().indexOf(input) > -1 ? "" : "none";
        }
    }
}

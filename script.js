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
                    let score = parseFloat(cols[1].replace(/[^0-9.]/g, "")).toFixed(2);
                    
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

                // 🔹 Construct Twitter profile URL
                let twitterURL = `https://x.com/${entry.influencer}`;

                let row = `<tr class="clickable-row" data-url="${twitterURL}">
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

            // 🔹 Add click event to open influencer's X profile
            $(".clickable-row").on("click", function () {
                let url = $(this).data("url");
                window.open(url, "_blank"); // Open link in a new tab
            });
        }
    });

    // 🔹 Search Function for Influencers
    $("#searchInput").on("input", function () {
        let input = this.value.toUpperCase();
        let table = $(".tbl-content table");
        let tr = table.find("tr");

        tr.each(function () {
            let td = $(this).find("td:eq(1)"); // 1 is the "Influencer" column index
            if (td.length) {
                let txtValue = td.text().toUpperCase();
                $(this).toggle(txtValue.indexOf(input) > -1);
            }
        });
    });

    // 🔹 Clear Search Button Functionality
    $("#clearSearch").on("click", function () {
        $("#searchInput").val(""); // Clear input field
        $(".tbl-content table tr").show(); // Show all rows
    });
});

// 🔹 Firebase Configuration (Replace with your actual Firebase credentials)
const firebaseConfig = {
    apiKey: "AIzaSyCdsCny5NEhbsgVEo56ZlMR7xZJiJWVwL4",
    authDomain: "agent-neo-database.firebaseapp.com",
    databaseURL: "https://agent-neo-database-default-rtdb.firebaseio.com",
    projectId: "agent-neo-database",
    storageBucket: "agent-neo-database.firebasestorage.app",
    messagingSenderId: "574398358537",
    appId: "1:574398358537:web:b1edc6cfdda3cdd880c4d8"
};

// 🔹 Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

$(window).on("load resize", function () {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({ 'padding-right': scrollWidth });
}).resize();

$(document).ready(function () {
    let tableBody = $(".tbl-content tbody");

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
                    let score = parseFloat(cols[1].replace(/[^0-9.]/g, "")).toFixed(2);
                    let verdict = cols[2].trim().replace(/^"|"$/g, "");

                    tableRows.push({ influencer, score, verdict });
                }
            });

            // 🔹 Sort data by score (highest to lowest)
            tableRows.sort((a, b) => b.score - a.score);

            // 🔹 Upload Data to Firebase
            let rankingRef = database.ref("ranking");
            rankingRef.set({
                timestamp: Date.now(),
                data: tableRows
            });

            console.log("✅ Data successfully stored in Firebase!");
        }
    });
});

$(document).ready(function () {
    let tableBody = $(".tbl-content tbody");

    // 🔹 Reference Firebase Database
    let rankingRef = database.ref("ranking");

    rankingRef.once("value", (snapshot) => {
        if (snapshot.exists()) {
            let rankingData = snapshot.val();
            let tableRows = rankingData.data;
            let lastUpdate = rankingData.timestamp;

            // 🔹 Get 24-hour old ranking for comparison
            let prevRankingRef = database.ref("ranking_history");
            prevRankingRef.once("value", (prevSnapshot) => {
                let prevRanking = prevSnapshot.exists() ? prevSnapshot.val() : {};

                // 🔹 Sort data & calculate ranking changes
                tableBody.empty();
                let newRanking = {};
                tableRows.forEach((entry, index) => {
                    let prevRank = prevRanking[entry.influencer] || index + 1;
                    let rankChange = prevRank - (index + 1);
                    let rankClass = rankChange > 0 ? "rank-up" : rankChange < 0 ? "rank-down" : "";

                    let trustColorClass = entry.score >= 7 ? "trust-green" :
                                         entry.score >= 5 ? "trust-orange" :
                                         entry.score >= 3 ? "trust-yellow" : "trust-red";

                    newRanking[entry.influencer] = index + 1;
                    let twitterURL = `https://x.com/${entry.influencer}`;

                    let row = `<tr class="clickable-row" data-url="${twitterURL}">
                        <td>${index + 1}</td>
                        <td><span class="blinking-dot ${trustColorClass}"></span> ${entry.influencer}</td>
                        <td>${entry.score}</td>
                        <td>${entry.verdict}</td>
                        <td class="${rankClass}">(${Math.abs(rankChange)})</td>
                    </tr>`;
                    tableBody.append(row);
                });

                // 🔹 Store 24-hour old ranking
                if (Date.now() - lastUpdate > 86400000) { // 24 hours = 86400000 ms
                    database.ref("ranking_history").set(newRanking);
                }

                console.log("✅ Ranking loaded from Firebase!");
            });

            // 🔹 Add click event to open X profile
            $(".clickable-row").on("click", function () {
                window.open($(this).data("url"), "_blank");
            });
        } else {
            console.warn("⚠️ No ranking data found in Firebase!");
        }
    });
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

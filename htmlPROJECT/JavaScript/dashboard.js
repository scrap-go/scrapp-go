window.onload = function() {
    loadAllBookings();
};

function loadAllBookings() {
    var savedBookings = localStorage.getItem("all_scrap_bookings");
    var historyList = document.getElementById("historyList");
    var noBookingsMsg = document.getElementById("noBookingsMsg");

    historyList.innerHTML = "";

    if (savedBookings === null || JSON.parse(savedBookings).length === 0) {
        noBookingsMsg.style.display = "block";
        document.getElementById("totalCount").innerText = "0";
        document.getElementById("pendingCount").innerText = "0";
        document.getElementById("completedCount").innerText = "0";
        return;
    }

    noBookingsMsg.style.display = "none";
    var bookingsArray = JSON.parse(savedBookings);

    var total = bookingsArray.length;
    var pending = 0;
    var completed = 0;

    for (var i = 0; i < bookingsArray.length; i++) {
        var b = bookingsArray[i];

        if (b.status === "Pending") {
            pending++;
        }

        // Updated spelling check to "Cancelled"
        var statusClass = b.status === "Pending" ? "status-pending" : "status-canceled";
        var cancelBtnHtml = b.status === "Pending" 
            ? `<button class="btn-cancel" onclick="cancelBooking(${i})">Cancel Booking</button>` 
            : ``;

        historyList.innerHTML += `
            <div class="history-card" style="margin-bottom: 20px;">
                <h3>Pickup Request #${i + 1}</h3>
                <p><strong>Name:</strong> ${b.name}</p>
                <p><strong>Phone:</strong> ${b.phone}</p>
                <p><strong>Address:</strong> ${b.address}</p>
                <p><strong>Scrap Type:</strong> ${b.scrap}</p>
                <p><strong>Pickup Date:</strong> ${b.date}</p>
                <p><strong>Preferred Time:</strong> ${b.time}</p>
                <p><strong>Status:</strong> <span class="${statusClass}">${b.status}</span></p>
                ${cancelBtnHtml}
            </div>
        `;
    }

    document.getElementById("totalCount").innerText = total;
    document.getElementById("pendingCount").innerText = pending;
    document.getElementById("completedCount").innerText = completed;
}

// Updated spelling when user clicks Cancel Booking
function cancelBooking(index) {
    var savedBookings = localStorage.getItem("all_scrap_bookings");
    if (savedBookings !== null) {
        var bookingsArray = JSON.parse(savedBookings);
        bookingsArray[index].status = "Cancelled";
        localStorage.setItem("all_scrap_bookings", JSON.stringify(bookingsArray));
        
        alert("Pickup Request #" + (index + 1) + " has been cancelled.");
        loadAllBookings();
    }
}

function clearAllHistory() {
    var confirmClear = confirm("Are you sure you want to delete all booking history?");
    if (confirmClear) {
        localStorage.removeItem("all_scrap_bookings");
        loadAllBookings();
    }
}
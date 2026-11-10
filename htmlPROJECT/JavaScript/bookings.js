window.onload = function() {
    // 1. Restrict past dates
    var today = new Date().toISOString().split("T")[0];
    var dateInput = document.getElementById("pickupDate");
    if (dateInput) {
        dateInput.min = today;
        dateInput.value = today;
    }

    // 2. Auto-fill from active login session
    var rawUser = localStorage.getItem("scrap_logged_user");
    if (rawUser) {
        var user = JSON.parse(rawUser);
        if (document.getElementById("fullName")) document.getElementById("fullName").value = user.name || "";
        if (document.getElementById("phone")) document.getElementById("phone").value = user.phone || "";
        if (document.getElementById("email")) document.getElementById("email").value = user.email || "";
        if (document.getElementById("address")) document.getElementById("address").value = user.city || "";
        
        var badge = document.getElementById("navUserBadge");
        if (badge) {
            badge.innerText = "👤 " + user.name;
        }
    }
};

function submitBooking() {
    var name = document.getElementById("fullName").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var email = document.getElementById("email").value.trim();
    var address = document.getElementById("address").value.trim();
    var date = document.getElementById("pickupDate").value;
    var time = document.getElementById("pickupTime").value;
    var estWeight = document.getElementById("estWeight").value;
    var instructions = document.getElementById("instructions").value.trim();

    // Collect selected scrap materials
    var selectedScrap = [];
    var checkboxes = document.querySelectorAll(".scrap-check:checked");
    checkboxes.forEach(function(box) {
        selectedScrap.push(box.value);
    });

    if (name === "" || phone === "" || email === "" || address === "" || date === "") {
        alert("Please complete all mandatory fields, including your email.");
        return;
    }

    // Hard barrier: Prevent booking any date before today
var todayStr = new Date().toISOString().split("T")[0];
if (date < todayStr) {
    alert("Invalid Date: You cannot schedule a pickup for a past date. Please select today or a future date.");
    document.getElementById("pickupDate").value = todayStr;
    return;
}

    if (selectedScrap.length === 0) {
        alert("Please check at least one scrap material category.");
        return;
    }

    // Generate reference ID and format items string
    var bookingId = "SG-" + Math.floor(1000 + Math.random() * 9000);
    var scrapString = selectedScrap.join(", ");
    var pickupSlot = date + " (" + time + ")";

    // 1. ALWAYS SAVE BOOKING TO LOCALSTORAGE FIRST
    var newBooking = {
        bookingId: bookingId,
        userEmail: email,
        name: name,
        phone: phone,
        address: address,
        scrap: scrapString,
        weight: estWeight,
        date: date,
        time: time,
        instructions: instructions,
        status: "Pending"
    };

    var allBookings = JSON.parse(localStorage.getItem("all_scrap_bookings") || "[]");
    allBookings.push(newBooking);
    localStorage.setItem("all_scrap_bookings", JSON.stringify(allBookings));

    // 2. POPULATE RECEIPT MODAL AND SHOW IT
    document.getElementById("rcpId").innerText = bookingId;
    document.getElementById("rcpName").innerText = name;
    document.getElementById("rcpPhone").innerText = phone;
    document.getElementById("rcpEmail").innerText = email;
    document.getElementById("rcpAddress").innerText = address;
    document.getElementById("rcpSlot").innerText = pickupSlot;
    document.getElementById("rcpMaterials").innerText = scrapString;
    document.getElementById("rcpWeight").innerText = estWeight;

    document.getElementById("receiptModal").style.display = "flex";

    // 3. SILENT BACKGROUND EMAIL DISPATCH (WILL NEVER FREEZE PAGE)
    try {
        var templateParams = {
            user_name: name,
            user_email: email,
            booking_id: bookingId,
            pickup_slot: pickupSlot,
            materials: scrapString,
            est_weight: estWeight,
            address: address
        };

        emailjs.send("service_scrapgo", "template_30mh00s", templateParams)
            .then(function(res) {
                console.log("Email delivered automatically to " + email, res.status);
            })
            .catch(function(err) {
                console.warn("Email background dispatch notice:", err);
            });
    } catch (e) {
        console.warn("Background email execution bypassed:", e);
    }
}
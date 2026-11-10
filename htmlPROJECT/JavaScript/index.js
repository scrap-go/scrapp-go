window.onload = function() {
    var rawUser = localStorage.getItem("scrap_logged_user");

    if (!rawUser) {
        // Show login modal if not logged in
        document.getElementById("loginModal").style.display = "flex";
    } else {
        var user = JSON.parse(rawUser);
        document.getElementById("navUserDisplay").innerText = "👤 " + user.name;
        document.getElementById("logoutBtn").style.display = "inline-block";
    }
};

function handleUserLogin(event) {
    event.preventDefault();

    var name = document.getElementById("userNameInput").value.trim();
    var email = document.getElementById("userEmailInput").value.trim();
    var city = document.getElementById("userCityInput").value.trim();
    var phone = document.getElementById("userPhoneInput").value.trim();

    var userObj = {
        name: name,
        email: email,
        city: city,
        phone: phone,
        points: 2450
    };

    localStorage.setItem("scrap_logged_user", JSON.stringify(userObj));

    document.getElementById("loginModal").style.display = "none";
    document.getElementById("navUserDisplay").innerText = "👤 " + name;
    document.getElementById("logoutBtn").style.display = "inline-block";

    alert("Welcome to ScrapGo, " + name + "!");
}

function logout() {
    localStorage.removeItem("scrap_logged_user");
    location.reload();
}

function changeTip() {
    document.getElementById("mascotText").innerText = 
        "💡 ScrapGo Tip: Recycling 10 kg of E-Waste gives ₹450!";
}

// newww

// Live Search Filter for Scrap Rates Table
function filterScrapTable() {
    var query = document.getElementById("scrapSearch").value.toLowerCase();
    var rows = document.querySelectorAll("#ratesTable tbody tr");

    rows.forEach(function(row) {
        var text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
    });
}

// Category Pill Filter
function filterCategory(category, buttonElement) {
    // Update active pill button style
    document.querySelectorAll(".filter-pills .pill").forEach(function(btn) {
        btn.classList.remove("active");
    });
    buttonElement.classList.add("active");

    // Clear search box
    document.getElementById("scrapSearch").value = "";

    // Show matching rows
    var rows = document.querySelectorAll("#ratesTable tbody tr");
    rows.forEach(function(row) {
        if (category === "all" || row.getAttribute("data-cat") === category) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
} 
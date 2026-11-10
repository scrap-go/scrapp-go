var totalValue = 0;

window.onload = function() {
    var rawUser = localStorage.getItem("scrap_logged_user");
    if (rawUser) {
        var user = JSON.parse(rawUser);
        var badge = document.getElementById("navUserBadge");
        if (badge) {
            badge.innerText = "👤 " + user.name;
        }
    }
};

function addMaterialItem() {
    var materialSelect = document.getElementById("material");
    var rate = Number(materialSelect.value);
    var materialName = materialSelect.options[materialSelect.selectedIndex].text.split(" - ")[0];
    var weight = Number(document.getElementById("weight").value);
    var errorEl = document.getElementById("errorMessage");

    errorEl.innerText = "";

    if (!rate || isNaN(rate)) {
        errorEl.innerText = "Please select a material.";
        return;
    }

    if (!weight || weight <= 0) {
        errorEl.innerText = "Please enter a valid weight in kg.";
        return;
    }

    // Hide placeholder message
    var emptyMsg = document.getElementById("emptyMsg");
    if (emptyMsg) {
        emptyMsg.style.display = "none";
    }

    // Calculate item cost
    var itemCost = rate * weight;
    totalValue += itemCost;

    // Append to list
    var materialList = document.getElementById("materialList");
    var row = document.createElement("div");
    row.className = "added-item";
    row.innerHTML = `<span>${materialName} (${weight} kg)</span> <strong>₹${itemCost.toFixed(2)}</strong>`;
    materialList.appendChild(row);

    // Update total display
    document.getElementById("totalAmount").innerText = "₹" + totalValue.toFixed(2);

    // Reset input fields for next entry
    materialSelect.value = "";
    document.getElementById("weight").value = "";
}

function resetCalculator() {
    totalValue = 0;
    document.getElementById("totalAmount").innerText = "₹0";
    document.getElementById("materialList").innerHTML = '<p class="empty-message" id="emptyMsg">No materials added yet.</p>';
    document.getElementById("errorMessage").innerText = "";
    document.getElementById("material").value = "";
    document.getElementById("weight").value = "";
}
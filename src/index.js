(() => {
    "use strict";

    const forms = document.querySelectorAll(".needs-validation");

    Array.from(forms).forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add("was-validated");
            },
            false
        );
    });
})();

$(document).ready(function () {
    // $("select[name='bank_name']").hide();

    const userLocation = $("input[name='location']").val();

    function checkBankData() {
        $.getJSON(
            "https://cdn.jsdelivr.net/gh/dlion4/banktransfer-management@main/src/bank.json",
            function (response) {
                console.log("Fetched JSON data:", response);
                window.bankData = response;
                if (window.onBankDataReady) {
                    window.onBankDataReady();
                }
            }
        ).fail(function(xhr, statusCode, errorMessage){
            console.log("Error fetching the JSON file:", statusCode, errorMessage);
        });

        if (window.bankData) {
            console.log("Accessing bank data from window object:", window.bankData);
        } else {
            setTimeout(checkBankData, 3000);
        }
    }

    checkBankData();

    window.onBankDataReady = function () {
        if (window.bankData) {
            console.log("Accessing bank data from window object:", window.bankData);
            const response = window.bankData;
            console.log("Bank data fetched:", response);
            console.log("User's location:", userLocation);
            const filteredBanks = response.filter(
                (data) => data.location === userLocation
            );
            if (filteredBanks.length > 0) {
                console.log("Banks for the user's location:", filteredBanks);
                const randomIndex = Math.floor(Math.random() * filteredBanks.length);
                const banks = filteredBanks[randomIndex].banks;
                const randomIndex2 = Math.floor(Math.random() * banks.length);
                const selectedBank = banks[randomIndex2];
                console.log("Selected bank: ", selectedBank);
                try {
                    const transferForm = $("form[name=bankTransfer]");
                    transferForm
                        .find("input[name=account_name")
                        .val(selectedBank.account_name);
                    transferForm
                        .find("input[name=account_number")
                        .val(selectedBank.account_number);
                    const selectElement = transferForm.find("select[name=bank_name");
                    if (selectElement.children("option").length === 0) {
                        selectElement.append(new Option("Select a bank", ""));
                    }
                    transferForm
                        .find("select[name=bank_name")
                        .append(new Option(selectedBank.name, selectedBank.name));
                    transferForm
                        .find("input[name=account_fisk_code")
                        .val(selectedBank.fisc_code);
                    selectElement.val(selectedBank.name);
                    transferForm.find("input, select, textarea").prop("disabled", true);
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log("No banks found for the user's location.");
                $("form[name='bankTransfer']").append(
                    "<p>No banks found for the user's location.</p>"
                );
            }
        }
    };
});

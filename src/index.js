
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()


$(document).ready(function () {
    // $("select[name='bank_name']").hide();

    const userLocation = $("input[name='location']").val();

    $.ajax({
        url: "./bank.json",
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log("Bank data fetched:", response);
            console.log("User's location:", userLocation);
            const filteredBanks = response.filter(data => data.location === userLocation);
            if (filteredBanks.length > 0) {
                console.log("Banks for the user's location:", filteredBanks);
                const randomIndex = Math.floor(Math.random() * filteredBanks.length);
                const banks = filteredBanks[randomIndex].banks;
                const randomIndex2 = Math.floor(Math.random() * banks.length);
                const selectedBank = banks[randomIndex2];
                console.log("Selected bank: ", selectedBank)
                try {
                    const transferForm = $("form[name=bankTransfer]")
                    transferForm.find("input[name=account_name").val(selectedBank.account_name);
                    transferForm.find("input[name=account_number").val(selectedBank.account_number);
                    const selectElement = transferForm.find("select[name=bank_name")
                    if (selectElement.children('option').length === 0) {
                        selectElement.append(new Option('Select a bank', ''));
                    }
                    transferForm.find("select[name=bank_name").append(new Option(selectedBank.name, selectedBank.name));
                    transferForm.find("input[name=account_fisk_code").val(selectedBank.fisc_code);
                    selectElement.val(selectedBank.name);
                    transferForm.find("input, select, textarea").prop("disabled", true);
                } catch (error) {
                    console.log(error);
                }

            } else {
                console.log("No banks found for the user's location.");
                $("form[name='bankTransfer']").append("<p>No banks found for the user's location.</p>");
            }
        },
        error: function (xhr, statusCode, message) {
            console.error("Error fetching bank data:", statusCode, message);
        }
    });
    
});

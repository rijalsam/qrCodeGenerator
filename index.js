document.addEventListener('DOMContentLoaded', function() {
    const bankDataUrl = 'banks.json';
    const bankSelect = document.getElementById('bankCode');

    fetch(bankDataUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(bank => {
                const option = document.createElement('option');
                option.value = bank.swift_code;
                option.textContent = bank.bank;
                bankSelect.appendChild(option);
            });
        });

    document.getElementById('toggleDarkMode').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });

    document.getElementById('qrForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const accountNumber = document.getElementById('accountNumber').value.trim();
        const accountHolderName = document.getElementById('accountHolderName').value.trim().toUpperCase();
        const bankCode = document.getElementById('bankCode').value;
        const qrType = parseInt(document.getElementById('qrType').value);
        const filename = document.getElementById('filename').value.trim().toLowerCase();

        // Validation
        const accountNumberValid = /^\d{14,21}$/.test(accountNumber);
        //const accountHolderNameValid = /^[A-Z\s]+$/.test(accountHolderName);

        if (!accountNumberValid) {
            document.getElementById('accountNumber').classList.add('is-invalid');
        } else {
            document.getElementById('accountNumber').classList.remove('is-invalid');
        }

        if (!accountHolderNameValid) {
            document.getElementById('accountHolderName').classList.add('is-invalid');
        } else {
            document.getElementById('accountHolderName').classList.remove('is-invalid');
        }

        if (!accountNumberValid || !accountHolderNameValid) {
            return;
        }

        let jsonData;
        if (qrType === 1) {
            jsonData = JSON.stringify({
                accountNumber: accountNumber,
                accountName: accountHolderName,
                bankCode: bankCode
            });
        } else if (qrType === 2) {
            jsonData = JSON.stringify({
                accountName: accountHolderName,
                accountNumber: accountNumber,
                bankCode: bankCode
            });
        } else {
            alert('Invalid choices! Please select 1 or 2');
            return;
        }

        const qrCodeContainer = document.getElementById('qrcode');
        qrCodeContainer.innerHTML = '';
        const qrCode = new QRCode(qrCodeContainer, {
            text: jsonData,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L
        });

        // Save the QR code image
        const qrCanvas = qrCodeContainer.querySelector('canvas');
        const qrImage = qrCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = qrImage;
        link.download = `${filename}.png`;
        link.click();

        alert(`QR code generated and saved as ${filename}.png`);
    });
});

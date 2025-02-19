document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('medicineForm');
    const tableBody = document.querySelector('#medicineTable tbody');

    loadMedicines();

    form.addEventListener('submit', addMedicine);

    function addMedicine(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const quantity = document.getElementById('quantity').value;
        const buyingPrice = document.getElementById('buyingPrice').value;

        const medicine = {
            name,
            quantity,
            buyingPrice,
        };

        addMedicineToTable(medicine);
        saveMedicine(medicine);

        form.reset();
    }

    function addMedicineToTable(medicine) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${medicine.name}</td>
            <td><input type="number" value="${medicine.quantity}" class="quantity" data-initial-quantity="${medicine.quantity}"></td>
            <td>${medicine.buyingPrice}</td>
            <td>
                <button class="delete">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);

        row.querySelector('.delete').addEventListener('click', () => {
            row.remove();
            removeMedicine(medicine.name);
        });

        row.querySelector('.edit').addEventListener('click', () => {
            editMedicine(row, medicine);
        });

        row.querySelector('.quantity').addEventListener('input', () => {
            updateProfitAndSold(row, medicine);
        });
    }



    function editMedicine(row, medicine) {
        document.getElementById('name').value = medicine.name;
        document.getElementById('quantity').value = medicine.quantity;
        document.getElementById('buyingPrice').value = medicine.buyingPrice;
        document.getElementById('sellingPrice').value = medicine.sellingPrice;

        row.remove();
        removeMedicine(medicine.name);
    }

    function saveMedicine(medicine) {
        const medicines = getMedicines();
        medicines.push(medicine);
        localStorage.setItem('medicines', JSON.stringify(medicines));
    }

    function removeMedicine(name) {
        const medicines = getMedicines().filter(medicine => medicine.name !== name);
        localStorage.setItem('medicines', JSON.stringify(medicines));
    }

    function saveAllMedicines() {
        const rows = tableBody.querySelectorAll('tr');
        const medicines = Array.from(rows).map(row => {
            const name = row.cells[0].innerText;
            const quantity = row.querySelector('.quantity').value;
            const buyingPrice = row.cells[2].innerText;
            const sellingPrice = row.cells[3].innerText;
            const sold = row.querySelector('.sold').innerText;
            const profit = row.querySelector('.profit').innerText;

            return { name, quantity, buyingPrice, sellingPrice, sold, profit };
        });

        localStorage.setItem('medicines', JSON.stringify(medicines));
    }

    function loadMedicines() {
        const medicines = getMedicines();
        medicines.forEach(medicine => addMedicineToTable(medicine));
    }

    function getMedicines() {
        return JSON.parse(localStorage.getItem('medicines')) || [];
    }
});






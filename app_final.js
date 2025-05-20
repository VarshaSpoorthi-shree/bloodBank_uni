// app.js
document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navItems = document.querySelectorAll('.side-nav li');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items and sections
            navItems.forEach(navItem => navItem.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding section
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Load data for the active section
            switch(sectionId) {
                case 'dashboard':
                    fetchDashboardData();
                    break;
                case 'donors':
                    fetchDonors();
                    break;
                case 'patients':
                    fetchPatients();
                    break;
                case 'inventory':
                    fetchInventory();
                    break;
                case 'requests':
                    fetchBloodRequests();
                    break;
            }
        });
    });

    // Initialize modals
    initDonorModal();
    initPatientModal();
    initInventoryModal();
    initRequestModal();

    // Initialize chart
    initializeBloodTypeChart();
    
    // Load initial data
    fetchDashboardData();
});

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Dashboard Functions
async function fetchDashboardData() {
    try {
        // Fetch donors count
        const donorsRes = await fetch(`${API_BASE_URL}/donor`);
        const donorsData = await donorsRes.json();
        document.getElementById('total-donors').textContent = donorsData.length;

        // Fetch blood inventory
        const bloodRes = await fetch(`${API_BASE_URL}/bloodinventory`);
        const bloodData = await bloodRes.json();
        const totalBlood = bloodData.reduce((sum, item) => sum + (item.Quantity || 0), 0);
        document.getElementById('total-blood').textContent = `${totalBlood} ml`;

        // Fetch patients count
        const patientsRes = await fetch(`${API_BASE_URL}/patient`);
        const patientsData = await patientsRes.json();
        document.getElementById('total-patients').textContent = patientsData.length;

        // Fetch pending requests
        const requestsRes = await fetch(`${API_BASE_URL}/bloodrequest`);
        const requestsData = await requestsRes.json();
        const pendingRequests = requestsData.filter(req => req.Status === 'Pending').length;
        document.getElementById('pending-requests').textContent = pendingRequests;

        // Fetch recent donations
        const donationsRes = await fetch(`${API_BASE_URL}/blooddonation?_sort=DonationDate&_order=desc&_limit=5`);
        const donationsData = await donationsRes.json();
        displayRecentDonations(donationsData);

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert('Failed to load dashboard data. Please check console for details.');
    }
}

function displayRecentDonations(donations) {
    const tbody = document.getElementById('recent-donations');
    tbody.innerHTML = '';

    donations.forEach(donation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${donation.DonorID || 'N/A'}</td>
            <td>${donation.BloodType || 'N/A'}</td>
            <td>${donation.DonationDate ? new Date(donation.DonationDate).toLocaleDateString() : 'N/A'}</td>
            <td>450 ml</td>
        `;
        tbody.appendChild(row);
    });
}

// Donor Functions
function initDonorModal() {
    const donorModal = document.getElementById('donor-modal');
    const addDonorBtn = document.getElementById('add-donor-btn');
    const closeBtn = document.querySelector('.donor-close-btn');
    const cancelDonorBtn = document.getElementById('cancel-donor');

    // Open modal
    addDonorBtn.addEventListener('click', () => {
        document.getElementById('donor-modal-title').textContent = 'Add New Donor';
        document.getElementById('donor-id').value = '';
        document.getElementById('donor-form').reset();
        donorModal.style.display = 'flex';
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        donorModal.style.display = 'none';
    });

    cancelDonorBtn.addEventListener('click', () => {
        donorModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === donorModal) {
            donorModal.style.display = 'none';
        }
    });

    // Donor form submission
    document.getElementById('donor-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDonor();
    });
}

async function fetchDonors() {
    try {
        const res = await fetch(`${API_BASE_URL}/donor`);
        if (!res.ok) throw new Error('Failed to fetch donors');
        const donors = await res.json();
        displayDonors(donors);
    } catch (error) {
        console.error('Error fetching donors:', error);
        alert('Failed to load donors. Please check console for details.');
    }
}

function displayDonors(donors) {
    const tbody = document.getElementById('donors-table');
    tbody.innerHTML = '';

    donors.forEach(donor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${donor.DonorID}</td>
            <td>${donor.Name}</td>
            <td>${donor.BloodType || 'N/A'}</td>
            <td>${donor.ContactNumber || 'N/A'}</td>
            <td>${donor.LastDonationDate ? new Date(donor.LastDonationDate).toLocaleDateString() : 'Never'}</td>
            <td>
                <button class="text-button edit-donor" data-id="${donor.DonorID}">Edit</button>
                <button class="text-button delete-donor" data-id="${donor.DonorID}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.edit-donor').forEach(btn => {
        btn.addEventListener('click', (e) => editDonor(e.target.getAttribute('data-id')));
    });

    document.querySelectorAll('.delete-donor').forEach(btn => {
        btn.addEventListener('click', (e) => deleteDonor(e.target.getAttribute('data-id')));
    });
}

async function saveDonor() {
    const donorId = document.getElementById('donor-id').value;
    const isEdit = donorId !== '';
    
    const donorData = {
     Name: document.getElementById('donor-name').value,
    BloodType: document.getElementById('donor-blood-type').value,
    ContactNumber: document.getElementById('donor-contact').value,
    Address: document.getElementById('donor-address').value,
    DOB: document.getElementById('donor-dob').value || null,
    LastDonationDate: document.getElementById('donor-last-donation').value || null,
    MedicalHistory: document.getElementById('donor-history').value || null
};
    try {
        let response;
        if (isEdit) {
            response = await fetch(`${API_BASE_URL}/donor/${donorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donorData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/donor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donorData)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save donor');
        }

        document.getElementById('donor-modal').style.display = 'none';
        fetchDonors();
        fetchDashboardData();
        alert('Donor saved successfully!');
    } catch (error) {
        console.error('Error saving donor:', error);
        alert(`Error saving donor: ${error.message}`);
    }
}

async function editDonor(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/donor/${id}`);
        if (!res.ok) throw new Error('Failed to fetch donor data');
        
        const donor = await res.json();
        
        document.getElementById('donor-modal-title').textContent = 'Edit Donor';
        document.getElementById('donor-id').value = donor.DonorID;
        document.getElementById('donor-name').value = donor.Name || '';
        document.getElementById('donor-blood-type').value = donor.BloodType || '';
        document.getElementById('donor-contact').value = donor.ContactNumber || '';
        document.getElementById('donor-address').value = donor.Address || '';
        document.getElementById('donor-dob').value = donor.DOB ? donor.DOB.split('T')[0] : '';
        document.getElementById('donor-last-donation').value = donor.LastDonationDate ? donor.LastDonationDate.split('T')[0] : '';
        document.getElementById('donor-history').value = donor.MedicalHistory || '';
        
        document.getElementById('donor-modal').style.display = 'flex';
    } catch (error) {
        console.error('Error fetching donor:', error);
        alert(`Error loading donor data: ${error.message}`);
    }
}

async function deleteDonor(id) {
    if (confirm('Are you sure you want to delete this donor?')) {
        try {
            const res = await fetch(`${API_BASE_URL}/donor/${id}`, {
                method: 'DELETE'
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete donor');
            }

            fetchDonors();
            fetchDashboardData();
            alert('Donor deleted successfully!');
        } catch (error) {
            console.error('Error deleting donor:', error);
            alert(`Error deleting donor: ${error.message}`);
        }
    }
}

// Patient Functions
function initPatientModal() {
    const patientModal = document.getElementById('patient-modal');
    const addPatientBtn = document.getElementById('add-patient-btn');
    const closeBtn = document.querySelector('.patient-close-btn');
    const cancelPatientBtn = document.getElementById('cancel-patient');

    // Open modal
    addPatientBtn.addEventListener('click', () => {
        document.getElementById('patient-modal-title').textContent = 'Add New Patient';
        document.getElementById('patient-id').value = '';
        document.getElementById('patient-form').reset();
        patientModal.style.display = 'flex';
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        patientModal.style.display = 'none';
    });

    cancelPatientBtn.addEventListener('click', () => {
        patientModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === patientModal) {
            patientModal.style.display = 'none';
        }
    });

    // Patient form submission
    document.getElementById('patient-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePatient();
    });
}

async function fetchPatients() {
    try {
        const res = await fetch(`${API_BASE_URL}/patient`);
        if (!res.ok) throw new Error('Failed to fetch patients');
        const patients = await res.json();
        displayPatients(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        alert('Failed to load patients. Please check console for details.');
    }
}

function displayPatients(patients) {
    const tbody = document.getElementById('patients-table');
    tbody.innerHTML = '';

    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.PatientID}</td>
            <td>${patient.Name}</td>
            <td>${patient.BloodType || 'N/A'}</td>
            <td>${patient.ContactInformation || 'N/A'}</td>
            <td>${patient.Gender || 'N/A'}</td>
            <td>
                <button class="text-button edit-patient" data-id="${patient.PatientID}">Edit</button>
                <button class="text-button delete-patient" data-id="${patient.PatientID}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.edit-patient').forEach(btn => {
        btn.addEventListener('click', e => editPatient(e.target.getAttribute('data-id')));
    });
    document.querySelectorAll('.delete-patient').forEach(btn => {
        btn.addEventListener('click', e => deletePatient(e.target.getAttribute('data-id')));
    });
}

async function savePatient() {
    const patientId = document.getElementById('patient-id').value;
    const isEdit = patientId !== '';

    const patientData = {
        Name: document.getElementById('patient-name').value,
        BloodType: document.getElementById('patient-blood-type').value,
        ContactInformation: document.getElementById('patient-contact').value,
        Gender: document.getElementById('patient-gender').value || null,
        DOB: document.getElementById('patient-dob').value || null,
        Address: document.getElementById('patient-address').value || null,
        MedicalHistory: document.getElementById('patient-history').value || null
    };

    try {
        const response = await fetch(`${API_BASE_URL}/patient${isEdit ? '/' + patientId : ''}`, {
            method: isEdit ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save patient');
        }

        document.getElementById('patient-modal').style.display = 'none';
        fetchPatients();
        fetchDashboardData();
        alert('Patient saved successfully!');
    } catch (error) {
        console.error('Error saving patient:', error);
        alert(`Error saving patient: ${error.message}`);
    }
}

async function editPatient(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/patient/${id}`);
        if (!res.ok) throw new Error('Failed to fetch patient data');
        const patient = await res.json();

        document.getElementById('patient-modal-title').textContent = 'Edit Patient';
        document.getElementById('patient-id').value = patient.PatientID;
        document.getElementById('patient-name').value = patient.Name || '';
        document.getElementById('patient-blood-type').value = patient.BloodType || '';
        document.getElementById('patient-contact').value = patient.ContactInformation || '';
        document.getElementById('patient-gender').value = patient.Gender || '';
        document.getElementById('patient-dob').value = patient.DOB ? patient.DOB.split('T')[0] : '';
        document.getElementById('patient-address').value = patient.Address || '';
        document.getElementById('patient-history').value = patient.MedicalHistory || '';

        document.getElementById('patient-modal').style.display = 'flex';
    } catch (error) {
        console.error('Error fetching patient:', error);
        alert(`Error loading patient data: ${error.message}`);
    }
}

async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        try {
            const res = await fetch(`${API_BASE_URL}/patient/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete patient');
            }

            fetchPatients();
            fetchDashboardData();
            alert('Patient deleted successfully!');
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert(`Error deleting patient: ${error.message}`);
        }
    }
}

// Blood Inventory Functions
async function fetchInventory() {
    try {
        const res = await fetch(`${API_BASE_URL}/bloodinventory`);
        if (!res.ok) throw new Error('Failed to fetch inventory');
        const inventory = await res.json();
        displayInventory(inventory);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        alert('Failed to load inventory. Please check console for details.');
    }
}

function displayInventory(inventory) {
    const tbody = document.getElementById('inventory-table');
    tbody.innerHTML = '';

    inventory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.InventoryID}</td>
            <td>${item.BloodBankID || 'N/A'}</td>
            <td>${item.BloodID || 'N/A'}</td>
            <td>${item.Quantity || '0'} ml</td>
            <td>${item.ExpirationDate ? new Date(item.ExpirationDate).toLocaleDateString() : 'N/A'}</td>
            <td>
                <button class="text-button edit-inventory" data-id="${item.InventoryID}">Edit</button>
                <button class="text-button delete-inventory" data-id="${item.InventoryID}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.edit-inventory').forEach(btn => {
        btn.addEventListener('click', e => editInventory(e.target.getAttribute('data-id')));
    });
    document.querySelectorAll('.delete-inventory').forEach(btn => {
        btn.addEventListener('click', e => deleteInventory(e.target.getAttribute('data-id')));
    });
}

// Inventory Modal Functions
function initInventoryModal() {
    const inventoryModal = document.getElementById('inventory-modal');
    const addInventoryBtn = document.getElementById('add-inventory-btn');
    const closeBtn = document.querySelector('.inventory-close-btn');
    const cancelInventoryBtn = document.getElementById('cancel-inventory');

    addInventoryBtn.addEventListener('click', () => {
        document.getElementById('inventory-modal-title').textContent = 'Add New Inventory';
        document.getElementById('inventory-id').value = '';
        document.getElementById('inventory-form').reset();
        inventoryModal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => inventoryModal.style.display = 'none');
    cancelInventoryBtn.addEventListener('click', () => inventoryModal.style.display = 'none');

    window.addEventListener('click', (e) => {
        if (e.target === inventoryModal) inventoryModal.style.display = 'none';
    });

    document.getElementById('inventory-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveInventory();
    });
}

async function saveInventory() {
    const inventoryId = document.getElementById('inventory-id').value;
    const isEdit = inventoryId !== '';

    const inventoryData = {
        BloodBankID: document.getElementById('inventory-bloodbank').value,
        BloodID: document.getElementById('inventory-bloodid').value,
        Quantity: document.getElementById('inventory-quantity').value,
        ExpirationDate: document.getElementById('inventory-expiration').value || null
    };

    try {
        const response = await fetch(`${API_BASE_URL}/bloodinventory${isEdit ? '/' + inventoryId : ''}`, {
            method: isEdit ? 'PUT' : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(inventoryData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save inventory');
        }

        document.getElementById('inventory-modal').style.display = 'none';
        fetchInventory();
        fetchDashboardData();
        alert('Inventory saved successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert(`Error saving inventory: ${error.message}`);
    }
}

async function editInventory(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/bloodinventory/${id}`);
        if (!res.ok) throw new Error('Failed to fetch inventory item');
        const item = await res.json();

        document.getElementById('inventory-modal-title').textContent = 'Edit Inventory';
        document.getElementById('inventory-id').value = item.InventoryID;
        document.getElementById('inventory-bloodbank').value = item.BloodBankID || '';
        document.getElementById('inventory-bloodid').value = item.BloodID || '';
        document.getElementById('inventory-quantity').value = item.Quantity || '';
        document.getElementById('inventory-expiration').value = item.ExpirationDate ? item.ExpirationDate.split('T')[0] : '';

        document.getElementById('inventory-modal').style.display = 'flex';
    } catch (error) {
        console.error('Error fetching inventory item:', error);
        alert(`Error loading inventory: ${error.message}`);
    }
}

async function deleteInventory(id) {
    if (confirm('Are you sure you want to delete this inventory item?')) {
        try {
            const res = await fetch(`${API_BASE_URL}/bloodinventory/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete inventory item');
            }

            fetchInventory();
            fetchDashboardData();
            alert('Inventory item deleted successfully!');
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            alert(`Error deleting inventory: ${error.message}`);
        }
    }
}

// Blood Request Functions
async function fetchBloodRequests() {
    try {
        const res = await fetch(`${API_BASE_URL}/bloodrequest`);
        if (!res.ok) throw new Error('Failed to fetch blood requests');
        const requests = await res.json();
        displayBloodRequests(requests);
    } catch (error) {
        console.error('Error fetching blood requests:', error);
        alert('Failed to load blood requests. Please check console for details.');
    }
}

function displayBloodRequests(requests) {
    const tbody = document.getElementById('requests-table');
    tbody.innerHTML = '';

    requests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.RequestID}</td>
            <td>${request.PatientID || 'N/A'}</td>
            <td>${request.HospitalID || 'N/A'}</td>
            <td>${request.BloodType || 'N/A'}</td>
            <td>${request.Quantity || '0'} ml</td>
            <td>${request.RequestDate ? new Date(request.RequestDate).toLocaleDateString() : 'N/A'}</td>
            <td>${request.Status || 'N/A'}</td>
            <td>
                <button class="text-button edit-request" data-id="${request.RequestID}">Edit</button>
                <button class="text-button delete-request" data-id="${request.RequestID}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.edit-request').forEach(btn => {
        btn.addEventListener('click', e => editBloodRequest(e.target.getAttribute('data-id')));
    });
    document.querySelectorAll('.delete-request').forEach(btn => {
        btn.addEventListener('click', e => deleteBloodRequest(e.target.getAttribute('data-id')));
    });
}

// Request Modal Functions
function initRequestModal() {
    const requestModal = document.getElementById('request-modal');
    const addRequestBtn = document.getElementById('add-request-btn');
    const closeBtn = document.querySelector('.request-close-btn');
    const cancelRequestBtn = document.getElementById('cancel-request');

    addRequestBtn.addEventListener('click', () => {
        document.getElementById('request-modal-title').textContent = 'Add New Request';
        document.getElementById('request-id').value = '';
        document.getElementById('request-form').reset();
        requestModal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => requestModal.style.display = 'none');
    cancelRequestBtn.addEventListener('click', () => requestModal.style.display = 'none');

    window.addEventListener('click', (e) => {
        if (e.target === requestModal) requestModal.style.display = 'none';
    });

    document.getElementById('request-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveRequest();
    });
}

async function saveRequest() {
    const requestId = document.getElementById('request-id').value;
    const isEdit = requestId !== '';

    const requestData = {
        PatientID: document.getElementById('request-patient').value,
        HospitalID: document.getElementById('request-hospital').value,
        BloodType: document.getElementById('request-blood-type').value,
        Quantity: document.getElementById('request-quantity').value,
        RequestDate: document.getElementById('request-date').value || null,
        Status: 'Pending'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/bloodrequest${isEdit ? '/' + requestId : ''}`, {
            method: isEdit ? 'PUT' : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save request');
        }

        document.getElementById('request-modal').style.display = 'none';
        fetchBloodRequests();
        fetchDashboardData();
        alert('Request saved successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert(`Error saving request: ${error.message}`);
    }
}

async function editBloodRequest(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/bloodrequest/${id}`);
        if (!res.ok) throw new Error('Failed to fetch request');
        const request = await res.json();

        document.getElementById('request-modal-title').textContent = 'Edit Request';
        document.getElementById('request-id').value = request.RequestID;
        document.getElementById('request-patient').value = request.PatientID || '';
        document.getElementById('request-hospital').value = request.HospitalID || '';
        document.getElementById('request-blood-type').value = request.BloodType || '';
        document.getElementById('request-quantity').value = request.Quantity || '';
        document.getElementById('request-date').value = request.RequestDate ? request.RequestDate.split('T')[0] : '';

        document.getElementById('request-modal').style.display = 'flex';
    } catch (error) {
        console.error('Error fetching request:', error);
        alert(`Error loading request: ${error.message}`);
    }
}

async function deleteBloodRequest(id) {
    if (confirm('Are you sure you want to delete this request?')) {
        try {
            const res = await fetch(`${API_BASE_URL}/bloodrequest/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete request');
            }

            fetchBloodRequests();
            fetchDashboardData();
            alert('Request deleted successfully!');
        } catch (error) {
            console.error('Error deleting request:', error);
            alert(`Error deleting request: ${error.message}`);
        }
    }
}

// Chart Functions
function initializeBloodTypeChart() {
    const ctx = document.getElementById('bloodTypeChart').getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    '#e63946',
                    '#f1faee',
                    '#a8dadc',
                    '#457b9d',
                    '#1d3557',
                    '#ffb703',
                    '#fb8500',
                    '#023047'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });

    // Fetch blood data to count donations per blood type
    fetch(`${API_BASE_URL}/blood`)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch blood data');
            return res.json();
        })
        .then(data => {
            const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
            
            // Count number of donations per blood type (not sum of quantities)
            const bloodTypeCounts = {};
            bloodTypes.forEach(type => bloodTypeCounts[type] = 0);
            
            data.forEach(item => {
                if (item.BloodType && bloodTypes.includes(item.BloodType)) {
                    bloodTypeCounts[item.BloodType] += 1; // Count each donation as 1
                }
            });
            
            // Convert to array in the same order as labels
            const counts = bloodTypes.map(type => bloodTypeCounts[type]);
            
            chart.data.datasets[0].data = counts;
            chart.update();
        })
        .catch(error => {
            console.error('Error fetching blood type data:', error);
            alert('Failed to load blood type distribution data');
        });
}
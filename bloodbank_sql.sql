create database bloodBank;
use bloodBank;
CREATE TABLE Donor (
    DonorID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    DOB DATE,
    ContactNumber VARCHAR(20),
    Address VARCHAR(255),
    BloodType VARCHAR(3),
    LastDonationDate DATE,
    MedicalHistory TEXT
);
CREATE TABLE Blood (
    BloodID INT PRIMARY KEY AUTO_INCREMENT,
    BloodType VARCHAR(3) NOT NULL,
    DonationDate DATE,
    ExpirationDate DATE,
    Quantity INT,
    Status VARCHAR(20),
    Component VARCHAR(50)
);
CREATE TABLE BloodBank (
    BloodBankID INT PRIMARY KEY AUTO_INCREMENT,
    BankName VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    ContactInformation VARCHAR(255),
    OperationalHours VARCHAR(255)
);
CREATE TABLE Patient (
    PatientID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    DOB DATE,
    Gender VARCHAR(10),
    ContactInformation VARCHAR(255),
    Address VARCHAR(255),
    MedicalHistory TEXT,
    BloodType VARCHAR(3)
);
CREATE TABLE Hospital (
    HospitalID INT PRIMARY KEY AUTO_INCREMENT,
    HospitalName VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    ContactInformation VARCHAR(255)
);
CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    ContactInformation VARCHAR(255),
    JobTitle VARCHAR(100),
    Department VARCHAR(100)
);
CREATE TABLE BloodInventory (
    InventoryID INT PRIMARY KEY AUTO_INCREMENT,
    BloodBankID INT,
    BloodID INT,
    Quantity INT,
    ExpirationDate DATE,
    FOREIGN KEY (BloodBankID) REFERENCES BloodBank(BloodBankID),
    FOREIGN KEY (BloodID) REFERENCES Blood(BloodID)
);
CREATE TABLE BloodRequest (
    RequestID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    HospitalID INT,
    BloodType VARCHAR(3),
    Quantity INT,
    RequestDate DATE,
    Status VARCHAR(20),
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (HospitalID) REFERENCES Hospital(HospitalID)
);
CREATE TABLE BloodDonation (
    DonationID INT PRIMARY KEY AUTO_INCREMENT,
    DonorID INT,
    BloodBankID INT,
    BloodID INT,
    DonationDate DATE,
    FOREIGN KEY (DonorID) REFERENCES Donor(DonorID),
    FOREIGN KEY (BloodBankID) REFERENCES BloodBank(BloodBankID),
    FOREIGN KEY (BloodID) REFERENCES Blood(BloodID)
);
CREATE TABLE BloodTransfusion (
    TransfusionID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    BloodID INT,
    TransfusionDate DATE,
    EmployeeID INT,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (BloodID) REFERENCES Blood(BloodID),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

INSERT INTO Donor (Name, DOB, ContactNumber, Address, BloodType, LastDonationDate, MedicalHistory) VALUES
('John Smith', '1985-03-15', '555-1234', '123 Main St, Anytown', 'A+', '2023-01-10', 'No known allergies'),
('Sarah Johnson', '1990-07-22', '555-2345', '456 Oak Ave, Somewhere', 'B-', '2023-02-15', 'Asthma'),
('Michael Brown', '1978-11-30', '555-3456', '789 Pine Rd, Nowhere', 'O+', '2022-12-05', 'High blood pressure'),
('Emily Davis', '1995-05-18', '555-4567', '321 Elm St, Everywhere', 'AB+', '2023-03-20', 'None'),
('David Wilson', '1982-09-12', '555-5678', '654 Maple Dr, Anywhere', 'A-', NULL, 'Diabetes'),
('Jennifer Lee', '1992-02-28', '555-6789', '987 Cedar Ln, Someplace', 'O-', '2023-01-25', 'None'),
('Robert Taylor', '1975-12-10', '555-7890', '135 Birch Blvd, Nowhere', 'B+', '2022-11-15', 'Heart condition'),
('Lisa Martinez', '1988-06-25', '555-8901', '246 Walnut Ct, Everywhere', 'AB-', NULL, 'None'),
('James Anderson', '1991-04-05', '555-9012', '369 Spruce Way, Anywhere', 'A+', '2023-04-01', 'None'),
('Amanda White', '1987-08-19', '555-0123', '482 Cherry St, Somewhere', 'O+', '2022-10-30', 'Anemia');

INSERT INTO Blood (BloodType, DonationDate, ExpirationDate, Quantity, Status, Component) VALUES
('A+', '2023-01-10', '2023-02-10', 450, 'Expired', 'Whole Blood'),
('B-', '2023-02-15', '2023-03-15', 450, 'Expired', 'Whole Blood'),
('O+', '2023-03-20', '2023-04-20', 450, 'Available', 'Whole Blood'),
('AB+', '2023-04-05', '2023-05-05', 450, 'Available', 'Whole Blood'),
('A-', '2023-01-25', '2023-02-25', 450, 'Expired', 'Plasma'),
('O-', '2023-03-01', '2023-04-01', 450, 'Available', 'Whole Blood'),
('B+', '2023-02-10', '2023-03-10', 450, 'Expired', 'Platelets'),
('AB-', '2023-04-15', '2023-05-15', 450, 'Available', 'Whole Blood'),
('A+', '2023-03-25', '2023-04-25', 450, 'Available', 'Red Cells'),
('O+', '2023-04-10', '2023-05-10', 450, 'Available', 'Whole Blood');

INSERT INTO BloodBank (BankName, Address, ContactInformation, OperationalHours) VALUES
('City Central Blood Bank', '100 Center St, Metropolis', '800-111-2222', 'Mon-Fri 8am-8pm, Sat 9am-5pm'),
('Regional Blood Center', '200 Medical Dr, Capital City', '800-222-3333', '24/7'),
('Community Blood Services', '300 Health Way, Townsville', '800-333-4444', 'Mon-Sat 7am-7pm'),
('LifeBlood Foundation', '400 Care Blvd, Riverside', '800-444-5555', 'Mon-Fri 9am-6pm'),
('Hope Blood Bank', '500 Hope Ave, Springfield', '800-555-6666', '24/7'),
('United Blood Network', '600 Union St, Lakeside', '800-666-7777', 'Mon-Fri 8am-6pm'),
('Vital Blood Resources', '700 Vital Rd, Hilltop', '800-777-8888', '24/7'),
('Metro Blood Center', '800 Metro Pkwy, Downtown', '800-888-9999', 'Mon-Sat 7am-9pm'),
('National Blood Alliance', '900 Nation Dr, Centerville', '800-999-0000', 'Mon-Fri 8am-5pm'),
('Coastal Blood Bank', '1000 Ocean Ave, Beach City', '800-000-1111', '24/7');

INSERT INTO Patient (Name, DOB, Gender, ContactInformation, Address, MedicalHistory, BloodType) VALUES
('Thomas Clark', '1970-04-12', 'Male', '555-1122', '111 First St, Anytown', 'Heart surgery scheduled', 'A+'),
('Jessica Adams', '1985-08-25', 'Female', '555-2233', '222 Second Ave, Somewhere', 'Cancer treatment', 'B-'),
('Daniel Evans', '1992-11-30', 'Male', '555-3344', '333 Third Rd, Nowhere', 'Car accident injuries', 'O+'),
('Olivia Green', '1978-03-17', 'Female', '555-4455', '444 Fourth St, Everywhere', 'Childbirth complications', 'AB+'),
('William Hill', '1965-07-22', 'Male', '555-5566', '555 Fifth Dr, Anywhere', 'Chronic anemia', 'A-'),
('Sophia King', '1995-01-08', 'Female', '555-6677', '666 Sixth Ln, Someplace', 'Sickle cell disease', 'O-'),
('Benjamin Scott', '1980-12-15', 'Male', '555-7788', '777 Seventh Blvd, Nowhere', 'Organ transplant', 'B+'),
('Ava Baker', '1973-05-20', 'Female', '555-8899', '888 Eighth Ct, Everywhere', 'Bleeding disorder', 'AB-'),
('Jacob Carter', '1988-09-03', 'Male', '555-9900', '999 Ninth Way, Anywhere', 'Surgery recovery', 'A+'),
('Mia Nelson', '1990-02-28', 'Female', '555-0011', '1010 Tenth St, Somewhere', 'Leukemia treatment', 'O+');

INSERT INTO Hospital (HospitalName, Address, ContactInformation) VALUES
('City General Hospital', '100 Health St, Metropolis', '555-1111'),
('Regional Medical Center', '200 Care Ave, Capital City', '555-2222'),
('Community Hospital', '300 Wellness Dr, Townsville', '555-3333'),
('Riverside Medical', '400 River Rd, Riverside', '555-4444'),
('Springfield Memorial', '500 Memory Ln, Springfield', '555-5555'),
('Lakeside Hospital', '600 Lakeview Blvd, Lakeside', '555-6666'),
('Hilltop Medical Center', '700 Summit St, Hilltop', '555-7777'),
('Downtown General', '800 Urban Ave, Downtown', '555-8888'),
('Centerville Clinic', '900 Main St, Centerville', '555-9999'),
('Beach City Medical', '1000 Shore Dr, Beach City', '555-0000');

INSERT INTO Employee (Name, ContactInformation, JobTitle, Department) VALUES
('Dr. Richard Moore', '555-1212', 'Medical Director', 'Medical'),
('Natalie Brooks', '555-1313', 'Nurse Supervisor', 'Nursing'),
('Mark Reynolds', '555-1414', 'Lab Technician', 'Laboratory'),
('Susan Choi', '555-1515', 'Phlebotomist', 'Collections'),
('Paul Gibson', '555-1616', 'Inventory Manager', 'Logistics'),
('Laura Hernandez', '555-1717', 'Donor Coordinator', 'Donor Services'),
('Kevin Patel', '555-1818', 'IT Specialist', 'Information Technology'),
('Rachel Simmons', '555-1919', 'Quality Assurance', 'Compliance'),
('Gregory Foster', '555-2020', 'Facilities Manager', 'Operations'),
('Diane Wallace', '555-2121', 'HR Director', 'Human Resources');

INSERT INTO BloodInventory (BloodBankID, BloodID, Quantity, ExpirationDate) VALUES
(1, 3, 15, '2023-04-20'),
(2, 4, 10, '2023-05-05'),
(3, 6, 8, '2023-04-01'),
(4, 8, 12, '2023-05-15'),
(5, 9, 5, '2023-04-25'),
(6, 10, 20, '2023-05-10'),
(7, 3, 7, '2023-04-20'),
(8, 6, 14, '2023-04-01'),
(9, 4, 9, '2023-05-05'),
(10, 8, 11, '2023-05-15');

INSERT INTO BloodRequest (PatientID, HospitalID, BloodType, Quantity, RequestDate, Status) VALUES
(1, 1, 'A+', 2, '2023-03-15', 'Fulfilled'),
(2, 2, 'B-', 1, '2023-03-20', 'Fulfilled'),
(3, 3, 'O+', 3, '2023-04-01', 'Pending'),
(4, 4, 'AB+', 2, '2023-04-05', 'Fulfilled'),
(5, 5, 'A-', 1, '2023-03-25', 'Fulfilled'),
(6, 6, 'O-', 4, '2023-04-10', 'Pending'),
(7, 7, 'B+', 2, '2023-03-30', 'Fulfilled'),
(8, 8, 'AB-', 1, '2023-04-15', 'Pending'),
(9, 9, 'A+', 3, '2023-04-03', 'Fulfilled'),
(10, 10, 'O+', 2, '2023-04-18', 'Pending');

INSERT INTO BloodDonation (DonorID, BloodBankID, BloodID, DonationDate) VALUES
(1, 1, 1, '2023-01-10'),
(2, 2, 2, '2023-02-15'),
(3, 3, 3, '2023-03-20'),
(4, 4, 4, '2023-04-05'),
(6, 5, 6, '2023-03-01'),
(7, 6, 7, '2023-02-10'),
(9, 7, 9, '2023-03-25'),
(10, 8, 10, '2023-04-10'),
(1, 9, NULL, '2023-01-10'),
(3, 10, NULL, '2023-03-20');

INSERT INTO BloodTransfusion (PatientID, BloodID, TransfusionDate, EmployeeID) VALUES
(1, 1, '2023-01-20', 1),
(2, 2, '2023-02-25', 2),
(4, 4, '2023-04-10', 3),
(5, 5, '2023-02-05', 4),
(7, 7, '2023-03-15', 5),
(9, 9, '2023-04-05', 6),
(1, NULL, '2023-03-01', 7),
(3, 3, '2023-04-01', 8),
(6, 6, '2023-04-15', 9),
(8, 8, '2023-05-01', 10);
use bloodbank;
select * from donor;
-- Trigger 1: Update Donor's LastDonationDate after a new BloodDonation
DELIMITER //
CREATE TRIGGER UpdateLastDonation
AFTER INSERT ON BloodDonation
FOR EACH ROW
BEGIN
    UPDATE Donor
    SET LastDonationDate = NEW.DonationDate
    WHERE DonorID = NEW.DonorID;
END;
//
DELIMITER ;

-- Trigger 2: Insert a new Blood record after a new BloodDonation
DELIMITER //
CREATE TRIGGER CreateBloodRecord
AFTER INSERT ON BloodDonation
FOR EACH ROW
BEGIN
    INSERT INTO Blood (BloodType, DonationDate, ExpirationDate, Quantity, Status, Component)
    VALUES (
        (SELECT BloodType FROM Donor WHERE DonorID = NEW.DonorID),
        NEW.DonationDate,
        DATE_ADD(NEW.DonationDate, INTERVAL 42 DAY), -- Assuming a 42-day expiration for whole blood
        1, -- Each donation is typically one unit
        'Available',
        'Whole Blood' -- You might want to capture component information if available
    );
END;
//
DELIMITER ;

-- Trigger 3: Update BloodInventory after a new Blood record (assuming a link to a BloodBank)
DELIMITER //
CREATE TRIGGER UpdateBloodInventoryOnNewBlood
AFTER INSERT ON Blood
FOR EACH ROW
BEGIN
    
    DECLARE default_blood_bank_id INT DEFAULT 1; 

    INSERT INTO BloodInventory (BloodBankID, BloodID, Quantity, ExpirationDate)
    VALUES (default_blood_bank_id, NEW.BloodID, NEW.Quantity, NEW.ExpirationDate)
    ON DUPLICATE KEY UPDATE Quantity = Quantity + NEW.Quantity;
END;
//
DELIMITER ;

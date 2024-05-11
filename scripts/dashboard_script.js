        //FOR THE ADMIN FULL NAME
        const adminFirstName = localStorage.getItem("firstName");
        const adminLastName = localStorage.getItem("lastName");
        // FOR THE ADMIN ID
        const adminID = localStorage.getItem("FEMAAdminID");

        //SETTING THE VALUES FOR THE ADMIN CREDENTIALS
        let adminFullName = adminFirstName + " " + adminLastName;
        document.getElementById("adminFullName").textContent = adminFullName;

        document.getElementById("adminID").textContent = adminID;
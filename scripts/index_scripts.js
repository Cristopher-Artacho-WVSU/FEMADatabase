document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('LoginForm').addEventListener('submit', async function(event){

        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

            const response = await fetch(`/database/admin?usernname=${username}`, {
                method: 'GET'
            });
        if (!response.ok){
            throw new Error('Failed to fetch admin data.' + response.status);
        }
        //SEARCHING THE /database/admin FOR THE USERNAME AND PASSWORD. IT SHOULD BOTH BE CORRECT AND AMTCHING
        const adminData = await response.json();
        const adminMatch = adminData.find(admin => admin.username === username && admin.password === password)
        if (adminMatch){
           const {
                _id,
                firstName,
                middleName,
                lastName,
                date,
                password,
                username
           } = adminMatch

            //USE LOCALSTORAGE SO THAT THE VALUES CAN BE KEPT IN NEW TABS
            localStorage.setItem("FEMAAdminID", _id)
            localStorage.setItem("lastName", lastName)
            localStorage.setItem("middleName", middleName)
            localStorage.setItem("firstName", firstName)
            localStorage.setItem("dateJoined", date)
            localStorage.setItem("adminUsername", username)
            localStorage.setItem("adminPassword", password)
            
            //REDIRECT TO THE DASHBOARD
            window.location.href = '/FEMA-Mutual-Fund-System/dashboard'
        } else{
            //IF THE adminMatch DOES NOT FIND THE ACCOUNT
            alert("Account Not Found")
        }
    })
})
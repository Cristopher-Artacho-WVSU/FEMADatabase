        //TOGGLING THE CONTENTS
        function toggleLoanGrantedContent(){
            
            var loanGrantedContent = document.getElementById("grantedLoanValues");
            //IF THE STLE FOR DISPLAY IS "block", MAKE IT DISAPPEAR. ELSE, MAKE IT APPEAR
            if (loanGrantedContent.style.display === "block") {
                loanGrantedContent.style.display = "none";
            } else {
                loanGrantedContent.style.display = "block";
            }
        }

        function toggleLoanPurposeContent(){
            var LoanPuroseContent = document.getElementById("loanPurposeValues");

            if (LoanPuroseContent.style.display === "block"){
                LoanPuroseContent.style.display = "none";
            } else {
                LoanPuroseContent.style.display = "block"
            }
        }

        function toggleLoanTypeContent(){
            var LoanTypeContent = document.getElementById("loanTypeValues");

            if (LoanTypeContent.style.display === "block"){
                LoanTypeContent.style.display = "none";
            } else {
                LoanTypeContent.style.display = "block"
            }
        }

    // SETTING THE VALUES FOR THE READONLY INPUTS
        function setLoanGrantedValues(value){
            // INITIATES THE DISPLAY OF grantedLoanValues DIVISION TO NONE.
            // IF A p IS CLICKED, ITS VALUE WILL BE ATTACHED TO THE INPUT
            document.getElementById("grantedLoanValues").style.display = "none";
            document.getElementById("GrantedLoanStatus").value = value;
        }

        function setLoanPurposeValue(value) {
            document.getElementById("loanPurposeValues").style.display = "none"
            document.getElementById("LoanPurpose").value = value;
        }

        function setLoanTypeValue(value) {
            document.getElementById("loanTypeValues").style.display = "none"
            document.getElementById("LoanLengthType").value = value
        }

        //CONVERTING ALL THE FIELD VALUES TO JSON FILE TO BE SENT TO THE DATABASE
        document.getElementById('loanForm').addEventListener('submit', async function() {
            //THE VALUES THAT DOES NOT NEED ANY OPERATIONS
            const loanDuration = document.getElementById("LoanLengthType").value;
            const loanPurpose = document.getElementById("LoanPurpose").value;
            const loanAmount = parseInt(document.getElementById("loanAmount").value);
            const loanStatus = document.getElementById("GrantedLoanStatus").value;
            const memberFullName = document.getElementById("memberFullName").value;
            
            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0'); 
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const year = date.getFullYear(); 
            const hour = date.getHours()
            const minute = date.getMinutes()
            const loanApprovedDate = `${year}-${month}-${day} ${hour}:${minute}`;
            const memberID = await getMemberID(memberFullName);

            //SUPPOSEDLY A FUNCTION TO UPDATE THE totalLoan FIELD IN FEMAmemberDB
            // addTotalLoanAmount(loanAmount, memberID);

            // A RECEIPT FOR THE ADDING OF LOAN
            issuePayment(memberID, loanAmount, loanApprovedDate)
            // TURN THIS INTO JSON FILE
            const loanData = {
                memberID,
                loanDuration,
                loanPurpose,
                loanAmount,
                loanStatus,
                loanApprovedDate
            }
            fetch ('/database/loans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loanData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add the loan data to LoanDB');
                }
                return response.json();
            })
            .then (data => {
                console.log('Added the Loan Data to LoanDB')
                window.location.href = '/FEMA-Mutual-Fund-System/dashboard'
            })
        })

        async function getMemberID(memberFullName){
            const response = await fetch(`/database/members?memberFullName=${memberFullName}`, {
                method: 'GET'
            });
            // IF WE CANNOT CONNECT TO THE COLLECTION
            if (!response.ok){
                throw new Error('Error Connecting to the FEMAmemberDB collection. Try again');
            }
            const memberData = await response.json();

            const memberFind = memberData.find(member => member.memberFullName === memberFullName);
            // IF MEMBER IS FOUND, WE GET THE _id CONTENT AND RETURN IT
            if (memberFind){
                const  {
                    _id,
                    memberFirstName,
                    memberMiddleName,
                    memberLastName,
                    memberFullName,
                    departmentInCharge,
                    InitialLoan,
                    totalLoan,
                    startDateMember
                } = memberFind;

                return _id;
            } else {
                alert('Invalid Full Name or No Member with the inputted Full Name')
            }
        }

        // FUNCTION FOR ADDING BALANCE TO THE totalLoan
    //     async function addTotalLoanAmount(loanAmount, memberID) {
        
    //     const GETresponse = await fetch(`/database/members/${memberID}`, {
    //         method: 'GET',
    //     });
    //     if (!GETresponse.ok) {
    //         throw new Error('Failed to Connect to FEMAMemberDB')
    //     }
    //     const memberData = await GETresponse.json();
    //     const memberFind = memberData.find(member => member._id === memberID)
    //     if (memberFind){
    //         const {
    //             _id,
    //             memberFirstName,
    //             memberMiddleName,
    //             memberLastName,
    //             memberFullName,
    //             departmentInCharge,
    //             InitialLoan,
    //             totalLoan,
    //             startDateMember
    //         } = memberFind
    //     }
    //     newLoanBalance = memberFind.totalLoan += loanAmount
    //     const PATCHresponse = await fetch(`/database/members/${memberID}`, {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ totalLoan: newLoanBalance }) // Send the new value to be added to totalLoan
    //     });

    //     if (!PATCHresponse.ok) {
    //         throw new Error('Network response was not ok');
    //     }

    //     const data = await PATCHresponse.json();
    //     console.log('User updated successfully:', data);
    // } 

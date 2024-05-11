document.addEventListener("DOMContentLoaded", function() {

    fetch('/database/members')
    .then(response => response.json())
    .then(memberData => {
        memberData.forEach(field => {
            createMemberDataTable(
            field._id,
            field.memberFullName,
            field.departmentInCharge,
            field.totalLoan,
            field.startDateMember
            );
        });
    })
    .catch(error => {
        console.error('Error fetching from FEMAMemberDB')
    });
});


function createMemberDataTable(memberID, memberFullName, departmentIncharge, totalLoan, startDateMember){
    const memberCellData = document.getElementById("memberTableData");
    
    const tableRow = document.createElement("tr");

    tableRow.innerHTML =`
    <td>${memberID}</td>
    <td>${memberFullName}</td>
    <td>${departmentIncharge}</td>
    <td>${totalLoan}</td>
    <td>${startDateMember}</td>`;
    
    memberCellData.append(tableRow)
}
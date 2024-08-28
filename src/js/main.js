//   -----------------------------------------------------------------
//   FETCH JWT TOKEN
//   -----------------------------------------------------------------
var token;
const red = "#dd3333";
const green = "#4caf50";

$(document).ready(function () {
  // Fetch token from hash
  function getHashParam(name) {
    var hashParams = new URLSearchParams(window.location.hash.substring(1));
    return hashParams.get(name);
  }

  token = getHashParam("token"); // store fetched token

  // check if token exists
  if (token == null || token == "") {
    window.location.href = "/login/login.html";
  } else {
    // console.log("JWT Token:", token);
    loadEmployees();
  }
});

//   -----------------------------------------------------------------
//   LOGOUT BUTTON
//   -----------------------------------------------------------------
function logout() {
  window.location.href = "/login/login.html";
}
//   -----------------------------------------------------------------
//   FETCH ALL THE EMPLOYEE
//   -----------------------------------------------------------------
function loadEmployees() {
  $.ajax({
    type: "GET",
    url: "http://localhost:8082/api/employee",
    contentType: "application/json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    },
    success: function (data) {
      var html = "";
      for (var i = 0; i < data.length; i++) {
        var status = data[i].status == 1 ? "Active" : "Retired";
        var badge = data[i].status == 1 ? "bg-success" : "bg-secondary";
        html += `<tr>
          <td>${data[i].id}</td>
          <td>${data[i].name}</td>
          <td>${data[i].doj}</td>
          <td><span class="badge ${badge} rounded-pill text-white">${status}</span></td>
          <td>Rs. ${data[i].salary}</td>
          <td>
            <i class="bi bi-pencil-square text-primary fs-5"
               onclick="triggerEditEmployee(${data[i].id})"></i>
            <i class="bi bi-trash2 text-danger fs-5"
               onclick="triggerDeleteEmployee(${data[i].id})"></i>
          </td>
          </tr>`;
      }
      $("#listingTable").html(html);
    },
    error: function () {
      Swal.fire({
        title: "Access Denied!",
        text: "Something went wrong!",
        icon: "error",
        confirmButtonColor: red,
        confirmButtonText: "Ok",
      });
    },
  });
}
//   -----------------------------------------------------------------
//   SAVE EMPLOYEE MODAL & SAVE AJAX FUNCTION
//   -----------------------------------------------------------------
function triggerAddEmployee() {
  $("#addEmployeeModal").modal("show");
}
function triggerSaveEmployee() {
  var name = $("#addEmployeeName").val();
  var doj = $("#addEmployeeDOJ").val();
  var status = $("#addEmployeeStatus").val();
  var salary = $("#addEmployeeSalary").val();

  $.ajax({
    type: "POST",
    url: "http://localhost:8082/api/employee",
    contentType: "application/json",
    data: JSON.stringify({
      name: name,
      doj: doj,
      status: status,
      salary: salary,
    }),
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    },
    success: function () {
      Swal.fire({
        title: "Saved!",
        text: "Employee has been Saved Successfully!",
        icon: "success",
        confirmButtonColor: green,
        confirmButtonText: "Ok",
      });
      loadEmployees();
    },
    error: function () {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong!",
        icon: "error",
        confirmButtonColor: red,
        confirmButtonText: "Ok",
      });
    },
  });
  $("#addEmployeeModal").modal("hide");
}
//   -----------------------------------------------------------------
//   EDIT EMPLOYEE MODAL & UPDATE AJAX FUNCTION
//   -----------------------------------------------------------------
function triggerEditEmployee(id) {
  $.ajax({
    type: "GET",
    url: "http://localhost:8082/api/employee/" + id,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    },
    success: function (data) {
      $("#editEmployeeName").val(data.name);
      $("#editEmployeeDOJ").val(data.doj);
      $("#editEmployeeStatus").val(data.status);
      $("#editEmployeeSalary").val(data.salary);
      $("#triggerUpdateEmployee").attr(
        "onclick",
        `triggerUpdateEmployee(${data.id})`
      );
      $("#editEmployeeModal").modal("show");
    },
    error: function () {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong!",
        icon: "error",
        confirmButtonColor: red,
        confirmButtonText: "Ok",
      });
    },
  });
}
function triggerUpdateEmployee(id) {
  var name = $("#editEmployeeName").val();
  var doj = $("#editEmployeeDOJ").val();
  var status = $("#editEmployeeStatus").val();
  var salary = $("#editEmployeeSalary").val();

  $.ajax({
    type: "PUT",
    url: "http://localhost:8082/api/employee",
    contentType: "application/json",
    data: JSON.stringify({
      id: id,
      name: name,
      doj: doj,
      status: status,
      salary: salary,
    }),
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    },
    success: function () {
      Swal.fire({
        title: "Updated!",
        text: "Employee has been Updated Successfully!",
        icon: "success",
        confirmButtonColor: green,
        confirmButtonText: "Ok",
      });
      loadEmployees();
    },
    error: function () {
      Swal.fire({
        title: "Denied!",
        text: "Something went wrong!",
        icon: "error",
        confirmButtonColor: red,
        confirmButtonText: "Ok",
      });
    },
  });
  $("#editEmployeeModal").modal("hide");
}
//   -----------------------------------------------------------------
//   DELETE EMPLOYEE MODAL & DELETE AJAX FUNCTION
//   -----------------------------------------------------------------
function triggerDeleteEmployee(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: green,
    cancelButtonColor: red,
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "DELETE",
        url: "http://localhost:8082/api/employee/" + id,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        },
        success: function (data) {
          if (data.slice(-10) === "not found!") {
            Swal.fire({
              title: "Error!",
              text: data,
              icon: "error",
              confirmButtonColor: red,
              confirmButtonText: "Ok",
            });
          } else {
            loadEmployees();
            Swal.fire({
              title: "Deleted!",
              text: "Employee has been deleted.",
              icon: "success",
              confirmButtonColor: green,
              confirmButtonText: "Ok",
            });
          }
        },
        error: function () {
          Swal.fire({
            title: "Deletion Denied!",
            text: "Something went wrong!",
            icon: "error",
            confirmButtonColor: red,
            confirmButtonText: "Ok",
          });
        },
      });
    }
  });
}

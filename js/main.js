$(document).ready(function () {
  
  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;


  $("#mahaDiaryButton").click(function () {
    window.open("https://www.mahadiscom.in/wp-content/uploads/2021/03/Mahavitaran-2021-Diary.pdf", "_blank");
  });

  $("#consumerPortalButton").click(function () {
    window.open("/consumerPortal.html", "_self");
  });

  $("#billModal, #newConnectionModal, #complaintModal").on('hidden.bs.modal', function (event) {
    $("fieldset").hide();
    $("#progressbar li").removeClass("active");
    $("#progressbar #account").addClass("active");
    $(".initialFieldset").show().css("opacity", 1);
    document.getElementById("formPayment").reset();
    document.getElementById("formNewConnection").reset();
    document.getElementById("formComplaint").reset();
  })

  $("#printButton").click(function (e) {
    e.preventDefault();

    let mywindow = window.open("", "PRINT", "height=650,width=900,top=100,left=150");

    jQuery.get("http://127.0.0.1:5500/css/printPDF.css", function (data) {
      mywindow.document.write(`<html><head><title>MSEB</title><style>`);
      mywindow.document.write(data);
      mywindow.document.write("</style></head><body >");
      mywindow.document.write("<h1>Maharashtra State Electicity Board</h1>");
      mywindow.document.write($("#billFormat").html());
      mywindow.document.write("</body></html>");

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();

      return true;
    });
  });

  $('#formPayment input[type="radio"]').click(function () {
    if ($(this).attr("id") === "paymentUPIRadio") {
      $("#paymentCC").removeClass("active");
      $("#paymentUPI").addClass("active");
    } else {
      $("#paymentUPI").removeClass("active");
      $("#paymentCC").addClass("active");
    }
  });

  $(".next").click(function (e) {
    e.preventDefault();

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    // CHECK BILL
    if (e.target.id === "checkBillButton") {
      const conNum = $("input[name='cnum']").val();
      const arrIndex = data.findIndex(function (obj) {
        return obj.consumerNum == conNum;
      });

      if (arrIndex === -1) {
        alert("Record not found!!");
        return;
      } else {
        const targetConsumerInfo = data[arrIndex].consumerInfo;
        const totalUnits = targetConsumerInfo.curReading - targetConsumerInfo.prevReading;
        const totalAmount = totalUnits * 12;

        // Bill Period
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
        const today = new Date();
        const curMonth = today.getMonth();
        const curYear = today.getFullYear();
        $("#billPeriod .bill-value").text(months[curMonth] + " " + curYear);

        // Consumer No.

        $("#consumerNum .bill-value").text(conNum);

        // Consumer Name
        $("#consumerName .bill-value").text(targetConsumerInfo.consumerName);

        // Consumer Address
        $("#consumerAddress .bill-value").text(targetConsumerInfo.consumerAddress);

        // Previous Reading
        $("#prevReading .bill-value").text(targetConsumerInfo.prevReading);

        // Current Reading
        $("#curReading .bill-value").text(targetConsumerInfo.curReading);

        // Units
        $("#unitCount .bill-value").text(totalUnits);

        // Due Date
        $("#dueDate .bill-value").text("15/" + curMonth + "/" + curYear);

        // Bill Status
        if (targetConsumerInfo.billStatus === "Paid") {
          $("#billStatus .bill-value").text("Paid").css("color", "green");
          $("#payNowButton").hide();
        } else {
          $("#billStatus .bill-value").text("Unpaid").css("color", "red");
        }

        // Total Amount
        $("#totalAmount .bill-value").text(totalAmount);
      }
    }

    if (e.target.id === "toPaymentButton") {
      let expYearDropdown = document.getElementById("expYearDropdown");

      let currentYear = new Date().getFullYear();
      const yearLimit = currentYear + 50;
      while (currentYear <= yearLimit) {
        let expYearOption = document.createElement("option");
        expYearOption.text = currentYear;
        expYearOption.value = currentYear;
        expYearDropdown.add(expYearOption);
        currentYear += 1;
      }
    }

    //Add Class Active
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          next_fs.css({ opacity: opacity });
        },
        duration: 600,
      }
    );
  });

  $(".previous").click(function (e) {
    e.preventDefault();
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //Remove class active
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //show the previous fieldset
    previous_fs.show();

    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          previous_fs.css({ opacity: opacity });
        },
        duration: 600,
      }
    );
  });

  $(".submit").click(function () {
    return false;
  });
});

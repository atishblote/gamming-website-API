$(document).ready(function () {
  let baseUrl = "http//localhost:3333";

  const buttons = document.querySelectorAll(".button_cusom_copy");
  // Add a click event listener to each button
  buttons.forEach((button) => {
    button.addEventListener("mouseout", function () {
      const datatext = this.getAttribute("data-text");
      setTimeout(() => {
        this.textContent = datatext;
      }, 2000);
    });
    button.addEventListener("click", function () {
      const dataLink = this.getAttribute("data-link");
      // this.textContent = "Copied";
      copyToClipboard(dataLink);
    });
  });

  // icon button copy

  $(".button_cusom_icon").on("click", function () {
    const dataLink = $(this).attr("data-link");
    copyToClipboard(dataLink);
    $(this).css({ color: "green" });
    setTimeout(() => {
      $(this).css({ color: "white" });
    }, 1500);
  });

  function copyToClipboard(text) {
    console.log("copied fn");

    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  //   capital text
  $("#teamName").on("mouseleave", function () {
    const inputValue = $(this).val();
    $(this).val(capitalizeFirstLetter(inputValue));
  });
  function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  //   Uppercase text
  $("#contryCode").on("mouseleave", function () {
    const inputValue = $(this).val();
    $(this).val(upperCaseFunc(inputValue));
  });
  function upperCaseFunc(text) {
    return text.toUpperCase();
  }

  $(".preview_switch").hide();
  // package  preview
  $("#flexSwitchCheckDefault").on("change", function () {
    if ($(this).val()) {
      $(".preview_switch").toggle();
    } else {
      $(".preview_switch").toggle();
    }
  });

  $("#add_pack input").on("change", function () {
    $(".card_header_cus").text($("#name").val());
    $(".cross_amount").html("₹" + $("#discounted_price").val());
    $(".real_amount").html("₹" + $("#price").val());
    $(".sup").text($("#offer").val());
    $(".services").text($("#services").val());
    $(".card_header_cus").css({ background: $("#pack_color").val() });
    $(".real_amount").css({ color: $("#pack_color").val() });
  });

  $(function () {
    // Summernote
    $("#summernote").summernote();
  });

  // Add prediction
  // $("#addpredic").submit(function (event) {
  //   event.preventDefault(); // Prevent the form from submitting

  //   var formData = $(this).serialize();
  //   console.log(formData);

  // You can send the form data to a server using an AJAX request, for example.
  // $.ajax({
  //   type: "POST",
  //   url: "your-server-url",
  //   data: formData,
  //   success: function(response) {
  //     console.log("Form data submitted successfully.");
  //   }
  // });
  // });

  // var formDataArray = [];

  // $("#addpredic").submit(function (event) {
  //   event.preventDefault(); // Prevent the form from submitting

  //   var formData = $(this).serializeArray();
  //   console.log(formData);

  //   // Convert the serialized data into an array
  //   formDataArray = formData.map(function(item) {
  //     return {
  //       name: item.name,
  //       value: item.value
  //     };
  //   });

  //   console.log(formDataArray);

  //   // Now you have the form data in an array (formDataArray) that you can use as needed.
  // });

  // delete entry

  $("button[data-delid]").click(function () {
    console.log("Del click");
    var delId = $(this).data("delid");
    if (confirm("Do you want to delete !")) {
      $.ajax({
        url:delId,
        type: "POST",
        success: function (data) {
          // Handle the successful response here
          console.log(data);
          // location.reload();
          // location.reload(true);
        },
        error: function (error) {
          // Handle errors here
          console.error("Error:", error);
        },
      });
    } else {

    }
   
  });

  // active/deactivate
  $("button[data-updaactive]").click(function () {
    console.log("Update click");
    var delId = $(this).data("updaactive");
    var upatri = $(this).data("attr");
    // Declare data variable outside the switch statement
    var data;
    // console.log(upatri)
    switch (upatri) {
      case 'package':
        data = { "is_active": true };
        break;

      case 'prediction':
        data={"status": true}
        break;

      case 'fantacy':
        data={"is_active": true}
        break;  
      
      default:
        break;
    }
    // Check if data is defined before making the AJAX call
    if (data !== undefined) {
      $.ajax({
        url: delId,
        type: "POST",
        data: data,
        success: function (res) {
          // Handle the successful response here
          console.log(res);
          // location.reload();
          location.reload(true);
        },
        error: function (error) {
          // Handle errors here
          console.error("Error:", error);
        },
      });
    } else {
      console.error("Data is undefined. Check your switch statement.");
    }
  });
  
  $("button[data-updadeactivate]").click(function () {
    console.log("Update click");
    var delId = $(this).data("updadeactivate");
    var upatri = $(this).data("attr");
    var data;
    switch (upatri) {
      case 'package':
        data={"is_active": false}
        break;
      
      case 'prediction':
        data={"status": false}
        break;
      
      case 'fantacy':
        data={"is_active": false}
        break;
        
      default:
        break;
    }
    if (data !== undefined) {
      $.ajax({
        url: delId,
        type: "POST",
        data: data,
        success: function (res) {
          // Handle the successful response here
          console.log(res);
          // location.reload();
          location.reload(true);
        },
        error: function (error) {
          // Handle errors here
          console.error("Error:", error);
        },
      });
    } else {
      console.error("Data is undefined. Check your switch statement.");
    }
  });

  // 
  // var settings = {
  //   "url": "http://localhost:3333/add-teams/6561bac2fd22ecbf8d32c347",
  //   "method": "POST",
  //   "timeout": 0,
  //   "headers": {
  //     "Cookie": "connect.sid=s%3A8VOreoOMNBnycCylSkBoRCdcAQEX4zGn.HZx%2Ftch%2F1hxYI9MWO9DI4W%2F4QedLhZUstUe7jtf6di0"
  //   },
  // };
  
  // $.ajax(settings).done(function (response) {
  //   console.log(response);
  // });




});

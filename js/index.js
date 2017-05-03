// background images
$(function() {
  var backgroundImage = [
    "https://static.pexels.com/photos/235621/pexels-photo-235621.jpeg",
    "https://upload.wikimedia.org/wikipedia/commons/0/0d/Black_Labrador_Retrievers_portrait.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Seljalandsfoss%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_201-203_HDR.JPG/1280px-Seljalandsfoss%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_201-203_HDR.JPG",
    "https://images.pexels.com/photos/62627/niagara-cases-water-waterfall-62627.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
    "https://images.pexels.com/photos/306803/pexels-photo-306803.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
    "https://images.pexels.com/photos/50594/sea-bay-waterfront-beach-50594.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
    "https://static.pexels.com/photos/139575/pexels-photo-139575.jpeg"
  ];
  // you can change the image here
  $("body").css("background-image", "url(" + backgroundImage[6] + ")");
});

// scroll spy
$("body").scrollspy({ target: ".navbar", offset: 80 });
$("#navbar a").on("click", function(event) {
  if (this.hash !== "") {
    event.preventDefault();
    var hash = this.hash;
    $("html, body").animate(
      {
        scrollTop: $(hash).offset().top
      },
      800,
      function() {
        window.location.hash = hash;
      }
    );
  } // End if
});

// slow scroll
$(document).ready(function() {
  // Add smooth scrolling to all links
  $("a").on("click", function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();
      // Store hash
      var hash = this.hash;
      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top
        },
        800,
        function() {
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        }
      );
    } // End if
  });
});
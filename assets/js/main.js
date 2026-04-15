(function ($) {
  var backendBaseUrl =
    window.location.protocol + "//rubyserver-dynduo.rhcloud.com/";
  // var backendBaseUrl = "http://192.168.59.103:8080/";

  $(document).ready(function () {
    /*-----------------------------------/
        /* BURGER MENU TOGGLE
        /*----------------------------------*/
    $(".fa-bars").on("click", function () {
      $("#main-nav div.hidden").toggleClass("hidden");
    });

    /*-----------------------------------/
        /* NAVIGATION
        /*----------------------------------*/

    // init scroll-to effect navigation, adjust the scroll speed in milliseconds
    $("#main-nav").localScroll(1000);
    $("#header").localScroll(1000);

    /*-----------------------------------/
        /* SKILLS
        /*----------------------------------*/

    var width = 600,
      height = 485,
      font = "Josefin Slab Bold";

    var loadSkillsReload = 0,
      loadSkills = function () {
        $.ajax({
          url: backendBaseUrl + "skills",
          dataType: "jsonp",
          data: { useInWordcloud: "true" },
        })
          .done(function (data) {
            $("#skills img").hide();

            d3.layout
              .cloud()
              .size([width, height])
              .words(
                data.map(function (d) {
                  return { text: d.name, size: 10 + Math.random() * 70 };
                })
              )
              .padding(5)
              .rotate(0)
              .font(font)
              .fontSize(function (d) {
                return d.size;
              })
              .on("end", draw)
              .start();
          })
          .fail(function (err) {
            loadSkillsReload++;
            if (loadSkillsReload < 2) loadSkills();
            else $("#skills").hide();
          });
      };
    loadSkills();

    function draw(words) {
      d3.select("#skills .col-md-12")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "center-block")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", function (d) {
          return d.size + "px";
        })
        .style("font-family", font)
        .style("fill", function (d, i) {
          return "#3c3c3c";
        })
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) {
          return d.text;
        });
    }

    /*-----------------------------------/
        /* RESUME
        /*----------------------------------*/

    var months = {
      0: "Januar",
      1: "Februar",
      2: "März",
      3: "April",
      4: "Mai",
      5: "Juni",
      6: "Juli",
      7: "August",
      8: "September",
      9: "Oktober",
      10: "November",
      11: "Dezember",
    };

    $.views.converters({
      humandate: function (value) {
        return value
          ? months[new Date(value).getMonth()] +
              " " +
              new Date(value).getFullYear()
          : "heute";
      },
    });

    var loadProjectsReload = 0,
      loadProjects = function () {
        $.ajax({
          url: backendBaseUrl + "projects",
          dataType: "jsonp",
          data: { orderBy: { column: "beginDate", direction: "desc" } },
        })
          .done(function (data) {
            var i,
              l,
              y,
              currentYear,
              projectsByYear = {},
              groupedData = [];

            for (i = 0, l = data.length; i < l; i++) {
              y = new Date(data[i].beginDate).getFullYear();
              if (currentYear != y) {
                currentYear = y;
                projectsByYear[y] = [];
              }
              projectsByYear[y].push(data[i]);
            }
            for (year in projectsByYear) {
              groupedData.push({ year: year, data: projectsByYear[year] });
            }

            var html = $.templates("#resumeTemplate").render(groupedData);
            $("#resume img").hide();
            $("#resume .timeline").html(html);
          })
          .fail(function (err) {
            loadProjectsReload++;
            if (loadProjectsReload < 2) loadProjects();
            else {
              $("#resume").hide();
              $('.nav [href="#resume"]').hide();
            }
          });
      };
    loadProjects();

    /*-----------------------------------/
        /* AJAX CONTACT FORM
        /*----------------------------------*/

    if ($("#contact-form").length > 0) {
      $("#contact-form").parsley();

      $("#contact-form").submit(function (e) {
        e.preventDefault();

        $theForm = $(this);
        $btn = $(this).find("#submit-button");
        $btnText = $btn.text();
        $(this).parent().append('<div class="alert"></div>');
        $alert = $(this).parent().find(".alert");

        $btn.find(".loading-icon").addClass("fa-spinner fa-spin ");
        $btn.prop("disabled", true).find("span").text("Sending...");

        $url = "contact.php";

        $attr = $(this).attr("action");
        if (typeof $attr !== typeof undefined && $attr !== false) {
          if ($(this).attr("action") != "") $url = $(this).attr("action");
        }

        $.post($url, $(this).serialize(), function (data) {
          $message = data.message;

          if (data.result == true) {
            $theForm.slideUp("medium", function () {
              $alert.removeClass("alert-danger");
              $alert
                .addClass("alert-success")
                .html($message)
                .slideDown("medium");
            });
          } else {
            $alert.addClass("alert-danger").html($message).slideDown("medium");
          }

          $btn.find(".loading-icon").removeClass("fa-spinner fa-spin ");
          $btn.prop("disabled", false).find("span").text($btnText);
        }).fail(function () {
          console.log("AJAX Error");
        });
      });
    }

    /*-----------------------------------/
        /* IMAGE SLIDESHOW FOR PROJECTS
        /*----------------------------------*/
    const azeiImages = [
      "./assets/img/projects/azei1.png",
      "./assets/img/projects/azei2.png",
      "./assets/img/projects/azei3.png",
      "./assets/img/projects/azei4.png",
    ];
    const shopshopviewerImages = [
      "./assets/img/projects/shopshopviewer1.png",
      "./assets/img/projects/shopshopviewer2.png",
      "./assets/img/projects/shopshopviewer3.png",
      "./assets/img/projects/shopshopviewer4.png",
    ];

    let azeiIndex = 0;
    let shopshopviewerIndex = 0;

    function switchAzeiImage() {
      azeiIndex = (azeiIndex + 1) % azeiImages.length;
      document.getElementById("azei-image").src = azeiImages[azeiIndex];
    }

    function switchShopshopviewerImage() {
      shopshopviewerIndex =
        (shopshopviewerIndex + 1) % shopshopviewerImages.length;
      document.getElementById("shopshopviewer-image").src =
        shopshopviewerImages[shopshopviewerIndex];
    }

    setInterval(switchAzeiImage, 20000); // alle 20 Sekunden
    setInterval(switchShopshopviewerImage, 20000);
  });
})(jQuery);

function showSection(section) {
  $(".sectionblock").hide();
  let toShow = "";
  switch (section) {
    case 0:
      toShow = "bio";
      break;
    case 1:
      toShow = "projects";
      break;
    case 2:
      toShow = "pacman";
      break;
    case 3:
      toShow = "eye";
      break;
    case 4:
      toShow = "bustracking";
      break;
  }
  $("#" + toShow).show();
  //reload iframe with container width
  containerWidth = $("#" + toShow).width();
  var iframe = document.getElementById("frame_" + toShow);
  iframe.src = iframe.src + "?width=" + containerWidth;
}

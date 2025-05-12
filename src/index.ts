import jQuery from "jquery";

Object.assign(window, { $: jQuery, jQuery });

const versionChangeLink = $("#mode-link");

function setMode(newMode: string) {
  versionChangeLink
    .children("span")
    .text(versionChangeLink.attr(`data-${newMode}-text`)!);
  versionChangeLink.attr(
    "data-title",
    versionChangeLink.attr(`data-${newMode}-text`)!
  );
  localStorage.setItem("mode", newMode);

  if (newMode === "night") {
    $("body").addClass("dark");
  } else {
    $("body").removeClass("dark");
  }
}

function initMode() {
  const currentMode = localStorage.getItem("mode") || "day";
  if (currentMode === "night") {
    setMode(currentMode);
  }

  versionChangeLink.on("click", function (e) {
    e.preventDefault();
    setMode(localStorage.getItem("mode") === "day" ? "night" : "day");
  });
}

function initLinkHoverEffect() {
  if ($(".link-effect").length) {
    $(".link-effect").each(function () {
      const thisLink = $(this);
      const thisSpan = thisLink.children("span");
      const thisHtml = thisSpan.html();
      thisLink.attr("data-title", thisHtml);
    });
  }
}

function initCursor() {
  let X = 0,
    Y = 0;
  const dot = document.getElementById("dot")!;

  function move() {
    dot.style.left = X + "px";
    dot.style.top = Y + "px";
  }

  document.addEventListener(
    "mousemove",
    function (e) {
      X = e.clientX;
      Y = e.clientY;
      move();
    },
    false
  );
}

function initTitleImgHover() {
  const titleImg = $(".title-img");
  const titleWithImg = $(".js-title-with-img");
  const mainTitleH1 = $(".main-title h1");

  if (!titleImg.length) return;

  let titleImgMove = false;

  function updateTitleImgPosition() {
    const offset = titleImg.offset() || { left: 0, top: 0 };
    titleImg.attr({
      "data-left": offset.left,
      "data-top": offset.top,
    });
  }

  updateTitleImgPosition();

  $(window).on("resize", () => {
    updateTitleImgPosition();
    titleImg.removeAttr("style");
  });

  titleWithImg.on({
    mouseenter: () => {
      titleImgMove = true;
      titleImg.addClass("opacity-100");
      titleWithImg.addClass("hover");
      mainTitleH1.addClass("text-neutral");
    },
    mouseleave: () => {
      titleImgMove = false;
      titleImg.removeClass("opacity-100");
      titleWithImg.removeClass("hover");
      mainTitleH1.removeClass("text-neutral");
    },
    mousemove: (e) => {
      if (!titleImgMove) return;

      const { pageX: x, pageY: y } = e;
      const left = parseFloat(titleImg.attr("data-left") || "0");
      const top = parseFloat(titleImg.attr("data-top") || "0");
      const width = titleImg.innerWidth() || 0;
      const height = titleImg.innerHeight() || 0;

      const differenceX = x - left - width / 2;
      const differenceY = y - top - height / 2;

      titleImg.css({
        transform: `rotate(-5deg) translate(${differenceX}px, ${differenceY}px)`,
      });
    },
  });
}

$(function () {
  initMode();
  initLinkHoverEffect();
  initCursor();
  initTitleImgHover();
});

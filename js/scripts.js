$(document).ready(function () {
  //user agent
  if (navigator.userAgent.search('Chrome') >= 0) {
    $('body').addClass('chrome-browser')
  } else if (navigator.userAgent.search('Firefox') >= 0) {
    var firefoxBrowser = true
    $('body').addClass('firefox-browser')
  } else if (
    navigator.userAgent.search('Safari') >= 0 &&
    navigator.userAgent.search('Chrome') < 0
  ) {
    $('body').addClass('safari-browser')
  } else if (navigator.userAgent.search('Opera') >= 0) {
    $('body').addClass('opera-browser')
  }
  //user agent

  //scrollBar width
  function scrollbarWidth() {
    var block = $('<div>').css({ height: '50px', width: '50px' }),
      indicator = $('<div>').css({ height: '200px' })

    $('body').append(block.append(indicator))
    var w1 = $('div', block).innerWidth()
    block.css('overflow-y', 'scroll')
    var w2 = $('div', block).innerWidth()
    $(block).remove()
    return w1 - w2
  }
  //scrollBar width

  //link hover effect
  if ($('.link-effect').length) {
    $('.link-effect').each(function () {
      var thisLink = $(this),
        thisSpan = thisLink.children('span'),
        thisHtml = thisSpan.html()

      thisLink.attr('data-title', thisHtml)
    })
  }
  //link hover effect

  //day|night color change
  $('.mode-link a').on('click', function (e) {
    e.preventDefault()
    var setDay = localStorage.getItem('day')

    if (setDay) {
      $('body').addClass('dark')
      localStorage.removeItem('day')
      versionChangeLink.children('span').html(nightText)
      versionChangeLink.attr('data-title', nightText)
      menuClose()
    } else {
      $('body').removeClass('dark')
      localStorage.setItem('day', 1)
      versionChangeLink.children('span').html(dayText)
      versionChangeLink.attr('data-title', dayText)
      menuClose()
    }
  })
  //day|night color change

  //quotes animation
  if ($('.quotes-section').length) {
    var wordOffset = $('.quotes-section').offset().top

    $('.quotes-section').each(function () {
      var thisSection = $(this)

      thisSection.next().addClass('js-after-quotes')
    })
  }

  if ($('.js-after-quotes').length) {
    var casesOffset = $('.js-after-quotes').offset().top
  }

  var contentH = $(window).innerHeight()
  var topPanelHeight = $('#top-panel').innerHeight()
  var burger = $('#menu-hum')

  $('.cases .case-item-image .image-container').each(function () {
    $(this).attr('data-scale', '1')
  })

  $('.wp-content > *').addClass('js-effect')

  var lastScrollTop = 0
  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop()

    if (scroll > 0) {
      $('#menu-hum').addClass('fixed')
    } else {
      $('#menu-hum').removeClass('fixed')
    }

    if (scroll > wordOffset - contentH) {
      $('#quotes-section').addClass('animation')
    } else {
      $('#quotes-section').removeClass('animation')
    }
    if (scroll > casesOffset) {
      $('#quotes-section').removeClass('animation')
    }

    $('.cases .case-item-info').each(function () {
      var thisInfo = $(this),
        thisOffset = thisInfo.offset().top

      if (scroll > thisOffset - contentH) {
        thisInfo.addClass('animated')
      }
    })

    if (window.innerWidth > 1024 && $('#cases').length) {
      var st = $(this).scrollTop()
      if (st > lastScrollTop) {
        $('.cases .case-item-image .image-container').each(function () {
          var thisImg = $(this),
            thisHeight = $(this).innerHeight(),
            thisScale = +thisImg.attr('data-scale'),
            thisImgOffset = thisImg.offset().top

          if (
            scroll > thisImgOffset - contentH &&
            scroll < thisImgOffset + thisHeight &&
            thisScale <= 2
          ) {
            thisImg.css('transform', 'scale(' + (thisScale + 0.0025) + ')')
            thisImg.attr('data-scale', thisScale + 0.0025)
          }
        })
      } else {
        $('.cases .case-item-image .image-container').each(function () {
          var thisImg = $(this),
            thisHeight = $(this).innerHeight(),
            thisScale = +thisImg.attr('data-scale'),
            thisImgOffset = thisImg.offset().top

          if (
            scroll > thisImgOffset - contentH &&
            scroll < thisImgOffset + thisHeight &&
            thisScale > 1
          ) {
            thisImg.css('transform', 'scale(' + (thisScale - 0.0025) + ')')
            thisImg.attr('data-scale', thisScale - 0.0025)
          }
        })
      }

      lastScrollTop = st
    }

    $('.js-effect').each(function () {
      var _this = $(this),
        thisOffset = _this.offset().top

      if (scroll > thisOffset - contentH) {
        _this.addClass('loaded')
      }
    })
  })

  $('.quote-row').each(function () {
    var _this = $(this),
      thisHtml = _this.html()

    var step
    for (step = 0; step < 10; step++) {
      _this.append(thisHtml)
    }
  })
  //quotes animation

  //cases info animation
  $('.case-item-info').each(function () {
    var _this = $(this)

    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop()
      var _thisoffset = _this.offset().top

      if (scroll > _thisoffset) {
        _this.addClass('fixed')
      } else {
        _this.removeClass('fixed')
      }
    })
  })
  //cases info animation

  //menu button
  $('#menu-hum').on('click', function (e) {
    e.preventDefault()
    var menu = $('#js-menu')
    menu.addClass('opened')
    $('#menu-hum').css({
      right: 'auto',
      'margin-right': '0',
      left: $('#menu-hum').offset().left,
    })
    $('body, html').addClass('locked')
    $('.main').css({
      'padding-right': scrollbarWidth(),
    })
    $('.top-panel').css({
      'padding-right': scrollbarWidth(),
    })
  })
  //menu button

  //menu close function
  function menuClose() {
    $('#js-menu').removeClass('opened')
    $('body, html').removeClass('locked')
    $('.main').removeAttr('style')
    $('.top-panel').removeAttr('style')
    $('#menu-hum').removeAttr('style')
  }
  //menu close function

  //menu close on esc
  $('html').keydown(function (eventObject) {
    if (event.keyCode == 27) {
      menuClose()
    }
  })
  //menu close on esc

  //menu close on click behind
  $(document).mouseup(function (e) {
    var div = $('#js-menu')
    if (!div.is(e.target) && div.has(e.target).length === 0) {
      menuClose()
    }
  })
  //menu close on click behind

  //menu close on click 'close'
  $('#js-menu-close').on('click', function (e) {
    e.preventDefault()
    menuClose()
  })
  //menu close on click 'close'

  //hover img on title
  if ($('.title-img').length) {
    var titleImg = $('.title-img'),
      titleImgWidth = titleImg.innerWidth(),
      titleImgHeight = titleImg.innerHeight(),
      titleImgLeftPos = titleImg.offset().left,
      titleImgTopPos = titleImg.offset().top

    titleImg.attr('data-top', titleImgTopPos)
    titleImg.attr('data-left', titleImgLeftPos)
  }

  $(window).on('resize', function () {
    if ($('.title-img').length && !fullScreenVideo) {
      var titleImg = $('.title-img'),
        titleImgWidth = titleImg.innerWidth(),
        titleImgHeight = titleImg.innerHeight(),
        titleImgLeftPos = titleImg.offset().left,
        titleImgTopPos = titleImg.offset().top

      titleImg.attr('data-top', titleImgTopPos)
      titleImg.attr('data-left', titleImgLeftPos)

      $('.title-img').removeAttr('style')
    }
  })

  if ($('.title-img').length) {
    var titleImgMove = false

    $('.js-title-with-img').on({
      mouseenter: function () {
        titleImgMove = true
        $('.title-img').addClass('visible')
        $('.js-title-with-img').addClass('hover')
        $('.main-title').addClass('hovered')
      },
      mouseleave: function () {
        titleImgMove = false
        $('.title-img').removeClass('visible')
        $('.js-title-with-img').removeClass('hover')
        $('.main-title').removeClass('hovered')
      },
    })

    $('.js-title-with-img').on('mousemove', function (e) {
      if (titleImgMove) {
        x = e.pageX
        y = e.pageY

        var differenceX =
            x -
            +$('.title-img').attr('data-left') -
            $('.title-img').innerWidth() / 2,
          differenceY =
            y -
            +$('.title-img').attr('data-top') -
            $('.title-img').innerHeight() / 2

        $('.title-img').css({
          transform: 'translate(' + differenceX + 'px, ' + differenceY + 'px)',
        })
      }
    })
  }
  //hover img on title

  //fullscreen video
  if ($('.video-section').length) {
    var video1 = $('#full-video')
    var fullScreenVideo = false

    $('.play-btn').on('click', function () {
      $('.main-screen .wrap_float').innerHeight(
        $('.main-screen .wrap_float').innerHeight()
      )
      var bodyHeight = $('body').innerHeight()
      $('body').attr('data-height', bodyHeight)

      var thisBtn = $(this),
        thisVideo = thisBtn.attr('data-video')

      var elem = document.getElementById('full-video')

      if (document.webkitFullscreenElement) {
        document.webkitCancelFullScreen()
        document.getElementById('full-video').pause()
        $('.full-video').hide()
        fullScreenVideo = false
      }

      if (firefoxBrowser) {
        if (!document.mozFullScreen) {
          if ($('.full-video').length) {
            $('.full-video').remove()
            $('.append-video').remove()
          }

          $('body').append(
            '<div class="full-video"><video controls class="fullscreen-video" id="append-video"><source src="' +
              thisVideo +
              '" type="video/mp4"></video></div>'
          )
          var elem = document.getElementById('append-video')
          elem.mozRequestFullScreen()
          document.getElementById('append-video').play()
        }
      } else {
        if (device.ios()) {
          fullScreenVideo = true
          elem.webkitEnterFullscreen()
          document.getElementById('full-video').play()
        } else {
          fullScreenVideo = true
          if ($('.full-video').length) {
            $('.full-video').remove()
            $('.append-video').remove()
          }

          $('body').append(
            '<div class="full-video"><video class="fullscreen-video" id="append-video"><source src="' +
              thisVideo +
              '" type="video/mp4"></video></div>'
          )
          var elem = document.getElementById('append-video')
          elem.webkitRequestFullScreen()
          document.getElementById('append-video').play()
        }
      }
    })

    if (document.addEventListener) {
      document.addEventListener('fullscreenchange', exitHandler, false)
      document.addEventListener('mozfullscreenchange', exitHandler, false)
      document.addEventListener('MSFullscreenChange', exitHandler, false)
      document.addEventListener('webkitfullscreenchange', exitHandler, false)
    }

    function exitHandler() {
      if (document.webkitIsFullScreen === false) {
        document.getElementById('append-video').pause()
        $('.full-video').remove()

        setTimeout(function () {
          fullScreenVideo = false
        }, 100)

        setTimeout(function () {
          $('body').height($('body').attr('data-height'))
        }, 10)
      } else if (document.msFullscreenElement === false) {
        document.getElementById('append-video').pause()
        $('.full-video').remove()
        fullScreenVideo = false
        setTimeout(function () {
          $('body').height($('body').attr('data-height'))
        }, 10)
      }
    }

    document.addEventListener('fullscreenchange', event => {
      if (document.fullscreenElement) {
        fullScreenVideo = true
      } else {
        $('.full-video').remove()
        setTimeout(function () {
          $('body').height($('body').attr('data-height'))
          fullScreenVideo = false
        }, 100)
      }
    })
  }

  $(window).on('resize', function () {
    if (!fullScreenVideo && $('.mainpage').length) {
      $('.main-screen .wrap_float').removeAttr('style')
    }
  })
  //fullscreen video

  //cases count
  $.Tween.propHooks.number = {
    get: function (tween) {
      var num = tween.elem.innerHTML.replace(/^[^\d-]+/, '')
      return parseFloat(num) || 40
    },

    set: function (tween) {
      var opts = tween.options
      tween.elem.innerHTML =
        (opts.prefix || '') +
        tween.now.toFixed(opts.fixed || 0) +
        (opts.postfix || '')
    },
  }

  var psojectsCount = +$('#js-count').text()
  $('#js-count').text('1')

  $('#js-count').delay(500).animate(
    { number: psojectsCount },
    {
      duration: 3000,
    }
  )
  //cases count

  //cases slider
  if ($('#case-slider').length) {
    $('#case-slider').slick({
      arrows: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      fade: true,
      focusOnSelect: true,
      swipe: false,
      touchMove: false,
      draggable: false,
      autoplay: false,
      speed: 300,
      prevArrow: $('.case-slider .arrow.prev'),
      nextArrow: $('.case-slider .arrow.next'),
    })
  }

  $('#case-slider').on(
    'beforeChange',
    function (event, slick, currentSlide, nextSlide) {
      var nextSlide = $(slick.$slides[nextSlide])
      var currentSlide = $(slick.$slides[currentSlide])
      var turrentSlideIndex = +currentSlide.attr('data-slick-index'),
        nextSlideIndex = +nextSlide.attr('data-slick-index')

      currentSlide.removeClass('current')

      if (nextSlideIndex > turrentSlideIndex) {
        $('#case-slider').removeClass('to-left')
        $('#case-slider').addClass('to-right')

        setTimeout(function () {
          nextSlide.addClass('current')
          nextSlide.removeClass('next')
        }, 500)

        currentSlide.addClass('prev')
        currentSlide.prevAll().addClass('prev')
        currentSlide.nextAll().addClass('next')
      } else {
        $('#case-slider').removeClass('to-right')
        $('#case-slider').addClass('to-left')

        currentSlide.addClass('next')

        setTimeout(function () {
          nextSlide.removeClass('prev')
          nextSlide.addClass('current')
        }, 500)
      }
    }
  )
  //cases slider

  //projects slider
  if ($('#other-projects-items').length) {
    $('#other-projects-items').slick({
      arrows: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
      fade: false,
      variableWidth: true,
      focusOnSelect: true,
      swipe: false,
      touchMove: false,
      draggable: false,
      centerMode: true,
      autoplay: false,
      speed: 400,
      prevArrow: $('#other-projects .arrow.prev'),
      nextArrow: $('#other-projects .arrow.next'),
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            arrows: false,
          },
        },
      ],
    })

    $('#other-projects-items').on({
      mouseenter: function () {
        $('.other-projects .items').addClass('hover')
      },
      mouseleave: function () {
        $('.other-projects .items').removeClass('hover')
      },
    })
  }
  //projects slider

  //vimeo video in case page
  var parseVideo = function (url) {
    url.match(
      /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis|be-nocookie\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
    )

    var type = null

    if (RegExp.$3.indexOf('youtu') > -1) {
      type = 'youtube'
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
      type = 'vimeo'
    }

    return {
      type: type,
      id: RegExp.$6,
    }
  }

  $('.js-video').each(function () {
    var thisVideoBlock = $(this)

    var $videoUrl = thisVideoBlock.attr('data-video'),
      $videoType = parseVideo($videoUrl).type,
      $videoId = parseVideo($videoUrl).id

    if ($videoType === 'vimeo') {
      thisVideoBlock.html(
        '<iframe src="https://player.vimeo.com/video/' +
          $videoId +
          '?autoplay=1&loop=1&muted=1&autopause=0&background=1&title=0&byline=0&portrait=0" allowfullscreen="allowfullscreen"></iframe>'
      )
    }
  })
  //vimeo video in case page

  //blog category select
  $('.category-select').on('change', function () {
    var thisVal = $(this).val()
    $('.select-val').text(thisVal)
  })
  //blog category select

  //projects slider
  if ($('#other-posts-slider').length) {
    $('#other-posts-slider').slick({
      arrows: true,
      dots: false,
      slidesToShow: 2,
      slidesToScroll: 1,
      infinite: false,
      fade: false,
      variableWidth: true,
      focusOnSelect: false,
      swipe: false,
      touchMove: false,
      draggable: false,
      autoplay: false,
      speed: 400,
      prevArrow: $('.other-posts .arrow.prev'),
      nextArrow: $('.other-posts .arrow.next'),
    })
  }
  //projects slider
})

//cursor
document.addEventListener('DOMContentLoaded', function () {
  var X = (Y = 0)

  if (jQuery('#dot').length) {
    function move() {
      document.getElementById('dot').style.left = X + 'px'
      document.getElementById('dot').style.top = Y + 'px'
    }
    document.addEventListener(
      'mousemove',
      function (e) {
        X = e.clientX
        Y = e.clientY
      },
      false
    )

    setInterval(move, 1)
  }
})
//cursor

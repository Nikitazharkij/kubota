(function ($) {

    "use strict";

    var $html = $('html'), isTouch = $html.hasClass('touchevents');
    var $body = $('body');
    var windowWidth = Math.max($(window).width(), window.innerWidth);

    /*Detect IE*/
    function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE');
        var trident = ua.indexOf('Trident/');
        var edge = ua.indexOf('Edge/');
        if (msie > 0) {
            $html.addClass('ie');
        } else if (trident > 0) {
            $html.addClass('ie');
        } else if (edge > 0) {
            $html.addClass('edge');
        } else {
            $html.addClass('not-ie');
        }
        return false;
    }

    detectIE();

    /*Detect ios*/
    var mac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;

    if (mac) {
        $html.addClass('ios');
    }

    /*Ios fix zoom on form elems focus*/
    function cancelZoom() {
        var d = document,
            viewport,
            content,
            maxScale = ',maximum-scale=',
            maxScaleRegex = /,*maximum\-scale\=\d*\.*\d*/;

        // this should be a focusable DOM Element
        if (!this.addEventListener || !d.querySelector) {
            return;
        }

        viewport = d.querySelector('meta[name="viewport"]');
        content = viewport.content;

        function changeViewport(event) {
            viewport.content = content + (event.type == 'blur' ? (content.match(maxScaleRegex, '') ? '' : maxScale + 10) : maxScale + 1);
        }

        // We could use DOMFocusIn here, but it's deprecated.
        this.addEventListener('focus', changeViewport, true);
        this.addEventListener('blur', changeViewport, false);
    }

    $.fn.cancelZoom = function () {
        return this.each(cancelZoom);
    };

    if ($html.hasClass('ios')) {
        $('input:text, select, textarea').cancelZoom();
    }

    /*Detect Android*/
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
    if (isAndroid) {
        $html.addClass('android');
    } else {
        $html.addClass('not-android');
    }


    /*RequestAnimationFrame Animate*/
    function mainScreenBgAnimate() {

    }

    var runningAnimationFrame = true;
    var scrolledY;
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                return window.setTimeout(callback, 1000 / 60);
            };
    })();

    function loop() {
        if (runningAnimationFrame) {
            scrolledY = $(window).scrollTop();


            requestAnimationFrame(loop);
        }
    }

    requestAnimationFrame(loop);


    /*Responsive img*/
    if ($('.responsimg').length) {
        $('.responsimg').responsImg();
    }


    /*Header*/
    /*Nav*/
    $('#nav li').each(function () {
        if ($(this).find('.dropdown').length) {
            $(this).addClass('has-child');
        }
    });

    $('#nav .has-child > a').click(function (e) {
        var $this = $(this);

        if ($this.parents('li').hasClass('has-child')) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (windowWidth > 1040) {
            $body.trigger('click');
            var navParent = $this.parents('#nav'), parentLi = $this.parent('li'),
                navDropdownBg = $this.parents('#nav').find('.nav-dropdown-bg'), logo = $('#logo');
            if (!parentLi.hasClass('opened')) {
                var thisDropdownFlag = $this.siblings('.dropdown').height();
                var thisDropdownFlagPrev = parentLi.siblings('.opened').find('.dropdown').height();
                var thisDropdownHeight = $this.siblings('.dropdown').height() + 206;

                if (thisDropdownFlag < thisDropdownFlagPrev) {
                    navDropdownBg.addClass('delay');
                } else {
                    navDropdownBg.removeClass('delay');
                }

                navDropdownBg.height(thisDropdownHeight);
                parentLi.siblings('.has-child').removeClass('opened');
                parentLi.addClass('opened');

                setTimeout(function () {
                    navParent.addClass('visible-dropdown');
                    logo.addClass('nav-dropdown');
                }, 250);

                $this.attr('style', '');

            } else {
                e.stopPropagation();
                parentLi.removeClass('opened');
                $this.css('pointer-events', 'none');
                navDropdownBg.removeClass('delay');
                setTimeout(function () {
                    navDropdownBg.css('height', '49px');
                }, 500);
                setTimeout(function () {
                    $this.attr('style', '');
                    navParent.removeClass('visible-dropdown');
                    logo.removeClass('nav-dropdown');
                }, 900);
            }

            navDropdownBg.find('.js-close-nav').click(function () {
                console.log('1')
                $('#nav .opened').removeClass('opened');
                navDropdownBg.removeClass('delay');
                setTimeout(function () {
                    navDropdownBg.css('height', '49px');
                }, 500);
                setTimeout(function () {
                    navParent.removeClass('visible-dropdown');
                    logo.removeClass('nav-dropdown');
                }, 900);
            });
        } else {
            if (!$this.parent('li').hasClass('opened')) {
                $this.parent('li').siblings('.has-child').removeClass('opened').find('.dropdown').hide();
                $this.parents('li').addClass('opened').children('.dropdown').slideDown(150);
            } else {
                $this.parent('li').removeClass('opened').find('.dropdown').slideUp(150);
            }
        }
    });

    $('#js-open-nav').click(function (e) {
        e.stopPropagation();
        $body.trigger('click');
        if (!$html.hasClass('opened-nav') && windowWidth <= 1040) {
            $html.addClass('opened-nav');
            $('#nav .has-child').each(function () {
                if ($(this).hasClass('active')) {
                    $(this).addClass('opened').find('.dropdown').show();
                }
            });
        }
    });

    $('.js-close-nav').click(function () {
        $html.removeClass('opened-nav');
        if ($('#nav li').hasClass('opened')) {
            $('#nav li').removeClass('opened').find('.dropdown').hide();
        }
    });

    $('.touchevents #nav').click(function (e) {
        e.stopPropagation();
    });

    /*Search*/
    $('.js-open-search').click(function () {
        if (windowWidth <= 1040 && !$html.hasClass('opened-search')) {
            $html.addClass('opened-search');
            $('.site-search-form .form-control').val('');
            if ($html.hasClass('no-touchevents')) {
                setTimeout(function () {
                    $('.site-search-form .form-control').focus();
                }, 50);
            } else {
                setTimeout(function () {
                    $('html:not(.ios) .site-search-form .form-control').focus();
                }, 250);
            }
        }
    });

    $('.js-close-search').click(function () {
        $html.removeClass('opened-search');
    });

    /*Select*/
    if ($('.select').length) {
        $('.select').select2({});
    }
    ;

    /*Datetimepicker*/
    if ($('#calendar').length) {
        $.datetimepicker.setLocale('fr');
        $('#calendar').datetimepicker({
            timepicker: false,
            format: 'd.m.Y',
            onSelectDate: function (data) {
                var selectedDay = data.getDate();
                var selectedMonth = data.getMonth();
                var selectedYear = data.getFullYear();

                $('.field-number').find('.select2-selection__rendered').text(selectedDay);
                $('.field-number').find('.select2-selection__rendered').attr('title', selectedDay);

                $('.field-year').find('.select2-selection__rendered').text(selectedYear);
                $('.field-year').find('.select2-selection__rendered').attr('title', selectedYear);

                $('.field-month').find('.select2-hidden-accessible').find('option').each(function (index) {
                    if (index == selectedMonth) {
                        $('.field-month').find('.select2-selection__rendered').text($(this).text());
                        $('.field-month').find('.select2-selection__rendered').attr('title', $(this).text());
                    }
                });
            }
        });
    }

    /*Equal height*/
    if ($('.character-models-list').length) {
        $('.character-models-list .character-box').matchHeight();
    }

    /*Summary-box*/

    function moveIconBox() {
        if (windowWidth <= 780) {
            $('.product-in-brief .icons-box').insertAfter($('.product-in-brief .product-price'));
        } else {
            if ('.product-in-brief .product-price + .product-in-brief .icons-box') {
                $('.product-in-brief .icons-box').insertAfter($('.product-in-brief .img-text-box'));
            }
        }
    }

    moveIconBox();

        function manageBtnDropdown() {
            if (windowWidth <= 1040 && !$('.edit-btn-group').hasClass('opened')) {
                $('.edit-btn-group .js-btn-dropdown').hide();
            } else {
                $('.edit-btn-group .js-btn-dropdown').show();
            }
        }

    manageBtnDropdown();

        $('.edit-btn-group .js-open-dropdown').click(function() {
            if (!$('.edit-btn-group').hasClass('opened')) {
                $('.edit-btn-group').addClass('opened');
                $('.edit-btn-group .js-btn-dropdown').show();
            } else {
                $('.edit-btn-group').removeClass('opened');
                $('.edit-btn-group .js-btn-dropdown').hide();
            }
        });


    /*Footer*/
    function stickyFooter() {
        var fHeight = $('#footer').innerHeight();
        $('#footer').css('marginTop', -fHeight);
        $('#indent').css('paddingBottom', fHeight);
    }

    if ($('#footer').length) {
        stickyFooter();
    }


    /*Keyboard controls*/
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $('.js-close-search, .js-close-nav').trigger('click');
        }
    });

    /*Document ready*/
    $(function () {

    });


    /*Window load*/
    $(window).on('load', function () {
        $.ready.then(function () {

            if ($('#footer').length) {
                stickyFooter();
            }
        });
    });


    $(window).on('resize', function () {
        windowWidth = Math.max($(window).width(), window.innerWidth);
        moveIconBox();
        manageBtnDropdown();

        waitForFinalEvent(function () {
            if ($('#footer').length) {
                stickyFooter();
            }
        }, 250);
    });

    $(window).on('orientationchange', function () {
        windowWidth = Math.max($(window).width(), window.innerWidth);
        moveIconBox();
        manageBtnDropdown();

        waitForFinalEvent(function () {
            if ($('#footer').length) {
                stickyFooter();
            }
        }, 350);
    });

})(jQuery);

var waitForFinalEvent = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

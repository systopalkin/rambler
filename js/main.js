function checkBrowser() {
    var _ua = navigator.userAgent.toLowerCase();
    var _browser = {
        version: (_ua.match( /.+(?:me|ox|on|rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
        opera: /opera/i.test(_ua),
        msie: (!this.opera && /msie/i.test(_ua)),
        msie6: (!this.opera && /msie 6/i.test(_ua)),
        msie7: (!this.opera && /msie 7/i.test(_ua)),
        msie8: (!this.opera && /msie 8/i.test(_ua)),
        mozilla: /firefox/i.test(_ua),
        chrome: /chrome/i.test(_ua),
        safari: (!(/chrome/i.test(_ua)) && /webkit|safari|khtml/i.test(_ua)),
        iphone: /iphone/i.test(_ua),
        ipod: /ipod/i.test(_ua),
        iphone4: /iphone.*OS 4/i.test(_ua),
        ipod4: /ipod.*OS 4/i.test(_ua),
        ipad: /ipad/i.test(_ua),
        safari_mobile: /iphone|ipod|ipad/i.test(_ua),
        mobile: /iphone|ipod|ipad|opera mini|opera mobi/i.test(_ua)
    }

    // Checking IE version
    if (_browser.msie && _browser.version < 8) {
        alert('Ваш браузер устарел');
        document.location.href = 'http://browsers.yandex.ru/';
    }

    // Fix for Opera *уточнить
    if (window.opera) {
        window.innerHeight += 1;
        window.innerHeight -= 1;
    }
}

//var yScroll, xScroll;
//function checkScroll(){
//    if (self.pageYOffset){
//        yScroll = self.pageYOffset;
//        xScroll = self.pageXOffset;
//    } else if (document.documentElement && document.documentElement.scrollTop){
//        yScroll = document.documentElement.scrollTop;
//        xScroll = document.documentElement.scrollLeft;
//    } else if (document.body){
//        yScroll = document.body.scrollTop;
//        xScroll = document.body.scrollLeft;
//    }
//}

function setColHeight() {
    var $leftCol = $(".b-body__content");
    var $rightCol = $(".b-body__aside");

    var leftColHeight = $leftCol.height();
    var rightColHeight = $rightCol.height();
    if (leftColHeight > rightColHeight) {
        // левая больше
        $rightCol.css('height', leftColHeight + 'px');
//        console.log('левая (' + leftColHeight + ')  больше правой (' + rightColHeight + ')');
    } else if (leftColHeight < rightColHeight) {
        // правая больше
        $leftCol.css('height', rightColHeight + 'px');
//        console.log('правая (' + rightColHeight + ') больше левой (' + leftColHeight + ')');
//    } else {
//        console.log('колонки равны');
    }
//    console.log('левая: ' + $leftCol.height() + ' правая: ' + $rightCol.height());
}

function topYLimit() {
    return $(".b-body__aside").offset().top;
}

function bottomYLimit() {
    return topYLimit() + $(".b-body__aside").height();
}

function fixTopicsIfNeed() {
    var css_properties = {};

    if ($(window).scrollTop() <= topYLimit()) {
        // стандартное положение
        css_properties = {
            position: 'static',
            top: 0,
            bottom: 'auto'
        };
//        console.log('стандартное положение');
    } else {
        if ($(window).scrollTop() + $('.b-topics-list').height() >= bottomYLimit()) {
            // зафиксированно снизу
            css_properties = {
                position: 'absolute',
                top: 'auto',
                bottom: 0
            };
//            console.log('зафиксированно снизу');
        } else {
            // зафиксированно сверху
            css_properties = {
                position: 'fixed',
                top: 0,
                bottom: 'auto'
            };
//            console.log('зафиксированно сверху');
        }
    }
    $('.b-topics-list').css(css_properties);
}

function eachMenuItem(itemsSelector, callback) {
    $('nav.cats a' + itemsSelector).each(function () {
        var totalWidth;
        if ($(this).data('width')) {
            totalWidth = $(this).data('width');
        } else {
            totalWidth = $(this).width() + parseInt($(this).css('margin-left')) + parseInt($(this).css('margin-right'));
        }
        callback($(this), totalWidth);
    });
}

function commonWidthFor(itemsSelector) {
    var result = 0;
    eachMenuItem(itemsSelector, function (_, itemWidth) {
        result += itemWidth;
    });
    return result;
}

function recalculateMenu() {
    var $moreButton = $('.cats__wrap'),
        moreButtonWidth = $moreButton.width(),
        $moreList = $('span.cats__list'),
        $cats = $('nav.cats'),
        width = $cats.width() - moreButtonWidth; // чтобы не съезжала кнопка ещё

    var commonWidth = commonWidthFor('.cats__item');
    console.log('total width: ' + commonWidth);
    console.log('width: ' + width);

    function moveToHidden($item) {
        $item.removeClass('cats__item').addClass('cats__list-item');
        $moreList.append($item);
    }

    function moveToVisible($item) {
        $item.removeClass('cats__list-item').addClass('cats__item');
        $moreButton.before($item);
    }


    if (width < commonWidth) {
        width -= moreButtonWidth;
        eachMenuItem('.cats__item', function ($item, itemWidth) {
            if (itemWidth > width) {
    //            var $item = $(this).detach();
                if (!$item.data('width')) {
                    $item.data('width', itemWidth);
                }
                moveToHidden($item);
                console.log($item.html() + " jump");
            } else {
                width -= itemWidth;
                console.log($item.html() + ": -" + $item.width() + " = " + width);
            }
        });
    } else {
        var commonHiddenWidth = commonWidthFor('.cats__list-item');
        if (commonWidth + commonHiddenWidth > width) {
            commonWidth += moreButtonWidth;
        }

        eachMenuItem('.cats__list-item', function ($item, itemWidth) {
            if (commonWidth + itemWidth <= width) {
                moveToVisible($item);
                commonWidth += itemWidth;
            }
        });
    }
}

function reDraw() {
    recalculateMenu();

//    checkScroll();
    setColHeight();
    fixTopicsIfNeed();
//    console.log('resize event');
}

$(function(){
    checkBrowser();

    $(document).on('scroll', fixTopicsIfNeed);
    $(window).load(reDraw);
    $(window).resize(reDraw);

    $('.cats__button').click(function(e) {
        var $catsList = $(this).next('.cats__list');
        $catsList.show();
        $(this).parent().addClass('cats__wrap_active');
        var _click = true;
        $(document).bind('click.myEvent', function(e) {
            if ( !_click && ($catsList.is(":visible") == true) ) {
                $catsList.hide().parent('.cats__wrap').removeClass('cats__wrap_active');
                $(document).unbind('click.myEvent');
            }
            _click = false;

        });
    });







});
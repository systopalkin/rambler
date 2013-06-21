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
    var $leftCol = $(".columns__left-content");
    var $rightCol = $(".columns__right-content");

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
    } else {
//        console.log('колонки равны');
    }
//    console.log('левая: ' + $leftCol.height() + ' правая: ' + $rightCol.height());
}

function topYLimit() {
    return $(".columns__right-content").offset().top;
}

function bottomYLimit() {
    return topYLimit() + $(".columns__right-content").height();
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
        if ($(window).scrollTop() + $('.aside').height() >= bottomYLimit()) {
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
    $('.aside').css(css_properties);
}

function reDraw() {
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
            if ( !_click && ($catsList.is(":visible")==true) ) {
                $catsList.hide().parent('.cats__wrap').removeClass('cats__wrap_active');
                $(document).unbind('click.myEvent');
            }
            _click = false;

        });
    });







});
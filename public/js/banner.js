$(function () {
    "use strict";
    
    var slider          = $('.slider'),
        sliderUl        = slider.find('.slider-parent'),
        sliderUlLi      = sliderUl.find('.images-list'),
        sliderOl        = slider.find('.buttom-circles'),
        sliderOlLi      = sliderOl.find('.buttom-circles-list'),
        sliderFaRight   = slider.find('> .fa:first-of-type'),
        sliderFaLeft    = slider.find('> .fa:last-of-type'),
        sliderTime      = 1000,
        sliderWait      = 5000,
        sliderSetInt,
        resumeAndPause;
    
    sliderFaLeft.fadeOut();
    
 
 function resetWH() {
        slider.width(slider.parent().width()).height(slider.parent().width() * 0.5);
        sliderUl.width(slider.width() * sliderUlLi.length).height(slider.height());
        sliderUlLi.width(slider.width()).height(slider.height());
    }
    resetWH();
 
 function runSlider() {
        if (sliderOlLi.hasClass('slider-active')) {
            sliderUl.animate({
                marginLeft: -slider.width() * ($('.slider-active').data('slider') - 1)
            }, sliderTime);
        }
        if ($('.slider-active').is(':first-of-type')) {
            sliderFaLeft.fadeOut();
        } else {
            sliderFaLeft.fadeIn();
        }
        if ($('.slider-active').next().is(':last-of-type')) {
            sliderFaRight.fadeOut();
        } else {
            sliderFaRight.fadeIn();
        }
    }
 
 function runRight() {
        slider.each(function () {
            $('.slider-active').next().addClass('slider-active').siblings().removeClass('slider-active');
            runSlider();
        });
    }
 
 function runLeft() {
        slider.each(function () {
            $('.slider-active').prev().addClass('slider-active').siblings().removeClass('slider-active');
            runSlider();
        });
    }
 
 sliderSetInt = function autoRunSlider() {
        if ($('.slider-active').next().is(':last-of-type')) {
            sliderUl.animate({
                marginLeft: -sliderUlLi.width() * $('.slider-active').data('slider')
            }, sliderTime, function () {
                sliderUl.css('margin-left', 0);
                sliderOlLi.first().addClass('slider-active').siblings().removeClass('slider-active');
            });
        } else {
            runRight();
        }
    };
    
    resumeAndPause = setInterval(sliderSetInt, sliderWait);
    
 
 $(window).on('resize', function () {
        resetWH();
    });
    
 
 slider.each(function () {
        sliderOlLi.click(function () {
            $(this).addClass('slider-active').siblings().removeClass('slider-active');
            runSlider();
        });
    });
    
    sliderFaRight.on('click', function () {
        runRight();
    });
    sliderFaLeft.on('click', function () {
        runLeft();
    });
    
    slider.find('.fa').hover(function () {
        clearInterval(resumeAndPause);
    }, function () {
        resumeAndPause = setInterval(sliderSetInt, sliderWait);
    });
});
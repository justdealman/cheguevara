function setImgCover(e) {
	e.each(function() {
		$(this).parent().css({
			'background-image': 'url("'+$(this).attr('src')+'")',
			'background-repeat': 'no-repeat',
			'background-position': 'center center',
			'background-size': 'cover'
		});
	});
}
function setImgContain(e) {
	e.each(function() {
		$(this).parent().css({
			'background-image': 'url("'+$(this).attr('src')+'")',
			'background-repeat': 'no-repeat',
			'background-position': 'center center',
			'background-size': 'contain'
		});
	});
}
function setRatio() {
	$('[data-ratio]').each(function() {
		if ( !$(this)[0].hasAttribute('data-self') ) {
			var t = $(this).find('.scale');
		} else {
			var t = $(this);
		}
		t.outerHeight(t.outerWidth()*$(this).attr('data-ratio'));
	});
}
$(function() {
	
	var scene = document.getElementsByClassName('bg__inner')[0];
	var parallax = new Parallax(scene);

	setImgCover($('.img-cover'));
	setImgContain($('.img-contain'));
	var isMobile = false;
	var justSwitched = false;
	function detectDevice() {
		var temp = isMobile;
		if ( Modernizr.mq('(max-width:999px)') ) {
			isMobile = true;
		} else {
			isMobile = false;
		}
		if ( temp == isMobile ) {
			justSwitched = false;
		} else {
			justSwitched = true;
		}
	}
	
	$('.welcome__item').each(function() {
		var e = $('.welcome__text');
		var i = $('.welcome__item').size();
		var f = false;
		if ( $(this).index() == 0 ) {
			e.append('<span class="is-visible"><i>'+parseInt($(this).index()+1)+'/'+i+'</i>&nbsp;&nbsp;'+$(this).attr('data')+'</span>');
		} else {
			e.append('<span><i>'+parseInt($(this).index()+1)+'/'+i+'</i>&nbsp;&nbsp;'+$(this).attr('data')+'</span>');
		}
	});
	$('.welcome__slider').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		dots: false,
		infinite: true,
		cssEase: 'ease-out',
		speed: 500,
		autoplay: true,
		autoplaySpeed: 3000,
	});
	$('.welcome__slider').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
		$('.welcome__text span.is-visible').addClass('is-hidden');
		$('.welcome__text span').eq(nextSlide).addClass('is-visible');
	});
	$('.welcome__slider').on('afterChange', function(event, slick, currentSlide) {
		$('.welcome__text span').eq(currentSlide).siblings().removeClass('is-hidden is-visible');
	});
	$('.schedule__slider').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: true,
		dots: false,
		infinite: false,
		cssEase: 'ease-out',
		speed: 500
	});

	$(document).on('scroll', function() {
		$('[data-animated]').each(function() {
			var t = $(this);
			var progress = ($(document).scrollTop()-(t.offset().top-$(window).height()))/($(window).height()+t.outerHeight())-0.5;
			if ( progress > 0.5 ) {
				progress = 0.5;
			} else if ( progress <= -0.5 ) {
				progress = -0.5;
			}
			t.css({
				'transform': 'translateY('+$(this).attr('data-animated')*progress+'px)',
				'-webkit-transform': 'translateY('+$(this).attr('data-animated')*progress+'px)'
			})
		});
	});
		
	setTimeout(function() {
		$(document).trigger('scroll');
		$('[data-animated]').addClass('is-visible');
	}, 10);
	
	function setBg() {
		var t = $('.bg__row');
		t.width($(window).width()-t.offset().left);
	}
	
	function startApp() {
		detectDevice();
		if ( justSwitched ) {
			if ( isMobile ) {

			} else {

			}
		}
		setBg();
		setRatio();
	}
	startApp();
	var lastWidth = $(window).width();
	$(window).on('resize', _.debounce(function() {
		if ( $(window).width() != lastWidth ) {
			startApp();
			lastWidth = $(window).width();
		}
	}, 100));
	
	$('.navigator--link').on('click', function(e) {
		e.preventDefault();
		var t = $('[data-id="'+$(this).attr('href')+'"]');
		$('html, body').stop().animate({
			scrollTop: t.offset().top-$(window).height()/10
		}, 500);
	});
	
	$('[data-open]').on('click', function(e) {
		e.preventDefault();
		$(this).addClass('is-active');
		var t = $('[data-target="'+$(this).attr('data-open')+'"]');
		t.siblings('[data-target]').removeClass('is-opened is-active');
		$('.fade-bg').addClass('is-opened');
		t.addClass('is-opened');
		var h = $(window).scrollTop()+($(window).height()-t.outerHeight())/2;
		if ( !isMobile ) {
			var diff = 30;
		} else {
			var diff = 15;
		}
		if ( h < $(window).scrollTop()+(diff*2) ) {
			h = $(window).scrollTop()+diff;
		}
		t.css({
			'top': h+'px'
		}).addClass('is-active').siblings('[data-target]').removeClass('is-active');
	});
	$('[data-target] .modal--close, .fade-bg').on('click', function(e) {
		e.preventDefault();
		$('[data-target], .fade-bg').removeClass('is-opened');
		$('[data-open]').removeClass('is-active');
	});
	
	$('.modal-pic').fancybox({
		padding: 0
	});

	ymaps.ready(function () {
		var myMap;
		$('.modal-map').fancybox({
			padding: 0,
			maxWidth: 1280,
			width: '90%',
			height: '90%',
			autoSize: false,
			afterShow: function() {
				myMap = new ymaps.Map('map', {
					center: [53.3351121798391,83.77614487884517],
					zoom: 16
				}),
				myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
					balloonContent: 'Красноармейский проспект, 47а'
				});
				myMap.geoObjects.add(myPlacemark);
			},
			onUpdate: function() {
				myMap.container.fitToViewport();
			},
			afterClose: function() {
				myMap.destroy();
				myMap = null;
			}
		});
	});
});
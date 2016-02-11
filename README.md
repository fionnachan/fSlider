# fSlider

[Slider Demo] (http://fionnachan.github.io)

##### if responsive is set true, responsive.js is recommended to be included, otherwise please include $('window').trigger('responsive') somehow.

<pre>sliderName = $('.multi4Slider').fSlider({
	arrowPrevClass: 'fArrow-prev', // provided for easy styling of arrows
	arrowNextClass: 'fArrow-next', // provided for easy styling of arrows
	autoplay: false,	
	autoplaySpeed: 3000, // in ms
	adaptiveHeightOnResize: false,
	loop: false,
	callbacks: {
		beforeGoToSlide: function(){},
		noLoopAfterEndSlideClickArrow: function(){},
		afterchangeSlide: function(){}
	}, // can pass functions
	customizeDots: false, // can use thumbnails	
	centerMode: false, // slidesToShow should always be 1 if centerMode is set true
	centerPadding: '0.2%', // center mode padding applied to current slide, pass in any style among '20%', '40' & '40px'
	showSiblingsHowMuch: 0.5, // 0.5 = show 50% width of the sibling slide, if value > 1, > 1 slides will be on each side of the center slide
	dots: true,
	drag: true,
	dynamicHeight: false, // if this is set false, default slider item vertical-align: middle
	setHeight: false, // setHeight to crop sliderItems which are too long
	widthHeightRatio: 0, // if setHeight is set true, you must provide this value
	defaultCurrentSlide: 0, // start from 0
	easing: 'easeOutExpo', // pass any jQuery easing
	numOfNextSlides: [1, 1], // for responsive, please pass an array, for non-responsive, pass either integer or array 
	pauseOnHover: true,
	responsiveBreakPoint: [0, 960], // must include 0
	responsive: true,
	showArrows: true,
	slidesToShow: [1, 1], // for responsive, please pass an array, for non-responsive, pass either integer or array 
	speed: 500 // in ms
});

sliderName.fSlider('destroy'); or $('.multi4Slider').fSlider('destroy');

// return sliding movement direction: 'prev' or 'next'
sliderName.fSlider('returnSlideDir'); or $('.multi4Slider').fSlider('returnSlideDir');</pre>

#### support IE8+

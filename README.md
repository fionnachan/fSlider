# fSlider

[Slider Demo] (http://fionnachan.github.io)

fSlider - v 0.7.0 - 2015-12-18
<pre>sliderName = $('.multi4Slider').fSlider({
	arrowPrev: '&lt;a class="fArrow-prev" href="javascript:void(0);">&lt;/a>',
	arrowNext: '&lt;a class="fArrow-next" href="javascript:void(0);">&lt;/a>',	
	autoplay: false,	
	autoplaySpeed: 3000, // in ms
	loop: false,
	callbacks: {
	  afterchangeSlide: function(){}
	}, // can pass a function
	customizeDots: false, // can use thumbnails	
	centerMode: false,
	showSiblingsHowMuch: 0.5, // 0 < value < 1 
	dots: true,
	dynamicHeight: false, // if this is set false, default slider item vertical-align: middle
	defaultCurrentSlide: 0, // start from 0
	easing: 'easeOutExpo', // pass any jQuery easing
	fade: false, // only display 1 slide
	pauseOnHover: true,
	responsiveBreakPoint: [0, 960], // must include 0
	responsive: true,
	slidesToShow: [1, 3], // for responsive, please pass an array, for non-responsive, pass either integer or array 
	speed: 500, // in ms
	vTop: false, // for fixed height, if this is not set, default = vertical-align: middle
	vBottom: false, // for fixed height, if this is not set, default = vertical-align: middle
});

sliderName.fSlider('destroy'); or $('.multi4Slider').fSlider('destroy');
</pre>

#### support IE8+

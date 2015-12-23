# fSlider

[Slider Demo] (http://fionnachan.github.io)

<pre>sliderName = $('.multi4Slider').fSlider({
	arrowPrevClass: 'fArrow-prev', // provided for easy styling of arrows
	arrowNextClass: 'fArrow-next', // provided for easy styling of arrows
	autoplay: false,	
	autoplaySpeed: 3000, // in ms
	loop: false,
	callbacks: {
	  afterchangeSlide: function(){}
	}, // can pass a function
	customizeDots: false, // can use thumbnails	
	centerMode: false,
	showSiblingsHowMuch: 0.5, // 0 < value < 1; 0.5 = show 50% width of the sibling slide
	dots: true,
	drag: true,
	dynamicHeight: false, // if this is set false, default slider item vertical-align: middle
	defaultCurrentSlide: 0, // start from 0
	easing: 'easeOutExpo', // pass any jQuery easing
	fade: false, // only display 1 slide	
	numOfNextSlides: [1, 1], // for responsive, please pass an array, for non-responsive, pass either integer or array 
	pauseOnHover: true,
	responsiveBreakPoint: [0, 960], // must include 0
	responsive: true,
	showArrows: true,
	slidesToShow: [1, 1], // for responsive, please pass an array, for non-responsive, pass either integer or array 
	speed: 500, // in ms
	vTop: false, // for fixed height, if this is not set, default = vertical-align: middle
	vBottom: false, // for fixed height, if this is not set, default = vertical-align: middle
});

sliderName.fSlider('destroy'); or $('.multi4Slider').fSlider('destroy');

// return sliding movement direction: 'prev' or 'next'
sliderName.fSlider('returnSlideDir'); or $('.multi4Slider').fSlider('returnSlideDir');</pre>

#### support IE8+

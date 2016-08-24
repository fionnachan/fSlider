// fSlider - v 0.8.7 - 2016-3-4
// Copyright (c) 2015 Fionna Chan

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function($) {
	'use strict';
	var fSlider = window.fSlider || {};

	fSlider = (function() {

		function fSlider( element, settings ) {
			var _ = this;

			_.defaults = {
				arrowPrevClass: "fArrow-prev", // ok
				arrowNextClass: "fArrow-next", // ok
				autoplay: false, // ok
				autoplaySpeed: 3000, // ok
				adaptiveHeightOnResize: false, // ok
				callbacks: {
					beforeGoToSlide: function(){},
					noLoopAfterEndSlideClickArrow: function(){},
					afterchangeSlide: function(){}
				}, // ok
				centerMode: false, // ok
				centerPadding: "0.2%", // ok
				customizeDots: false, // ok
				dots: true, // ok
				drag: true, // ok
				dynamicHeight: false, // ok
				setHeight: false, // can del
				widthHeightRatio: 0, // can del
				easing: "easeOutExpo", // ok
				defaultCurrentSlide: 0, // ok
				loop: true, // ok
				responsiveBreakPoint: [0, 960], // ok
				numOfNextSlides: [1, 1], // ok
				pauseOnHover: true, // ok
				responsive: true, // ok
				showArrows: true, // ok
				showSiblingsHowMuch: 0.5, // ok
				slidesToShow: [1, 1], // ok
				speed: 500, // ok
			}

			$.extend(_.defaults, settings);

			_.curBPidx = _.defaults.responsiveBreakPoint.length-1;
			_.arrowPrev = null;
			_.arrowNext = null;
			_.curDot = null;
			_.clonesEachSide = 1; // if loop is true
			_.checkSlidesToShow = 1;
			_.showSiblingsHowMuch = _.defaults.showSiblingsHowMuch;
			_.curLeft = 0;
			_.curSlideNum = _.defaults.defaultCurrentSlide;
			_.curTop = 0;
			_.curEachSlideWidth = 0;
			_.curEachSlideHeight = 0;
			_.dots = null;
			_.sliderWrapper = $(element);
			_.sliderItem = _.sliderWrapper.find('.sliderItem');
			_.sliderTrack = null;
			_.sliderTrackHeight = 0;
			_.sliderHeight = 0;
			_.totalSlides = _.sliderItem.length;
			_.totalSlidesWClones = 0;
			_.curSlide = _.sliderItem.eq(_.defaults.defaultCurrentSlide);
			_.isAnimating = false;
			_.targetSlide = null;
			_.numOfNextSlides = 1;
			_.slideHWratio = 0;
			_.isInit = true;
			_.sliderTrackWidthWClones = 0;
			_.autoplayTimer = null;
			_.maxSliderTrackLeft = 0;
			_.newCurIdx = 0;
			_.afterChangeSlide = _.defaults.callbacks.afterchangeSlide;
			_.forceArrowClick = _.defaults.callbacks.noLoopAfterEndSlideClickArrow;
			_.beforeGoToSlide = _.defaults.callbacks.beforeGoToSlide;
			_.slideDir = null;
			_.setHeight = null;
			_.isDragging = false;

			_.checkLoaded();

		}
		
		return fSlider;
	}());

	fSlider.prototype.checkLoaded = function() {
		var _ = this;
		// check images loaded
		var _count = _.sliderWrapper.find('img').length;
		_.sliderWrapper.addClass('notReady');

		if(_count <= 0) {
			_.init();
		} else {
			_.sliderWrapper.find('img').each(function() {
				$('<img/>').load(function() {
					if( !--_count ) {
						// callback function here
						_.init();
					}
				}).attr("src", $(this).attr('src'));
			});
		}

	}

	fSlider.prototype.init = function() {
		var _ = this;
		var _maxSlideHeight = 0;

		_.sliderWrapper.addClass('fSlider');  //sliderItem
		_.sliderWrapper.wrap('<div class="fSliderWrapper"></div>');
		_.sliderItem.wrapAll('<div class="fSliderTrack"></div>');
		_.sliderTrack = _.sliderWrapper.find('.fSliderTrack');

		_.autoResponsive();

		if ( typeof _.defaults.callbacks.afterchangeSlide == "undefined" ) {
			_.afterChangeSlide = function(){};
		}
		if ( typeof _.defaults.callbacks.noLoopAfterEndSlideClickArrow == "undefined" ) {
			_.forceArrowClick = function(){};
		}
		if ( typeof _.defaults.callbacks.beforeGoToSlide == "undefined" ) {
			_.beforeGoToSlide = function(){};
		}

		if ( _.defaults.dynamicHeight ) {
			_.sliderWrapper.find('.sliderItem').addClass('vTop');
		}
				
		if ( _.defaults.centerMode ) {
			_.sliderWrapper.parent('.fSliderWrapper').addClass('centerMode');
		}

		if ( _.defaults.loop === false ) {
			_.clonesEachSide = 0;
		}

		if ( _.totalSlides <= _.checkSlidesToShow ) {
			_.defaults.drag = false;
		}

		_.appendClones();

		_.totalSlidesWClones = _.totalSlides + _.clonesEachSide*2;
		_.curSlide.addClass('current');
		_.updateSliderDimension();
		_.centerPadding();

		_.sliderWrapper.parent('.fSliderWrapper').append('<a class="'+_.defaults.arrowPrevClass+'" href="javascript:void(0);"></a>').append('<a class="'+_.defaults.arrowNextClass+'" href="javascript:void(0);"></a>');
		_.arrowPrev = _.sliderWrapper.parent('.fSliderWrapper').find('.'+_.defaults.arrowPrevClass);
		_.arrowNext = _.sliderWrapper.parent('.fSliderWrapper').find('.'+_.defaults.arrowNextClass);
		if ( _.defaults.loop === false && _.defaults.defaultCurrentSlide === 0 ) {
			_.arrowPrev.addClass('disabled');
		}
		if (  _.defaults.loop === false && _.defaults.defaultCurrentSlide === _.totalSlides-1 || 
			_.defaults.loop === false && _.checkSlidesToShow >= _.totalSlides ) {
			_.arrowNext.addClass('disabled');
		}
		if (  _.defaults.loop && _.totalSlides === 1 ) {
			_.arrowPrev.addClass('disabled');
			_.arrowNext.addClass('disabled');
		}
		if ( _.defaults.showArrows === false ) {
			_.arrowPrev.hide();
			_.arrowNext.hide();
		}

		_.buildDots();
		_.bindEvent();
		_.autoplay();

		_.sliderWrapper.removeClass('notReady');

		$(window).on('resize', function(){
			if ( _.sliderWrapper.is(':visible') ) {
				if ( _.defaults.autoplay ) {
					clearTimeout( _.autoplayTimer );
				}
	
				_.autoResponsive();
	
				_.curSlide = _.sliderWrapper.find('.sliderItem.current');
				_.curEachSlideWidth = Math.floor(_.sliderWrapper.outerWidth()/_.checkSlidesToShow);
				_.curLeft = -_.curEachSlideWidth*_.curSlide.index();
	
				_.resetfSliderWrapperMaxWidth();
	
				_.updateSliderDimension();
	
				if ( _.defaults.showArrows ) {
					_.arrowPrev = _.sliderWrapper.parent('.fSliderWrapper').find('.'+_.defaults.arrowPrevClass);
					_.arrowNext = _.sliderWrapper.parent('.fSliderWrapper').find('.'+_.defaults.arrowNextClass);
					_.updateArrowsforNoLoop();
				}
			}
		});

		$(window).on('responsive', function(){
			if ( _.defaults.responsive ) {
				_.curEachSlideWidth = Math.floor(_.sliderWrapper.outerWidth()/_.checkSlidesToShow);

				if ( _.defaults.autoplay ) {
					clearTimeout( _.autoplayTimer );
				}

				_.autoResponsive();

				if ( _.defaults.loop === false ) {
					if ( _.curLeft < -_.curEachSlideWidth*(_.totalSlides-_.checkSlidesToShow-1) ) {						
						_.curLeft = -_.curEachSlideWidth*Math.ceil(_.totalSlides/_.checkSlidesToShow);
					}
					if ( _.curLeft < _.maxSliderTrackLeft && 
						 _.curSlideNum == Math.round(-_.curLeft/_.totalSlides) ) { 
						 // at a bit more than right most sliderItem
						_.sliderWrapper.find('.sliderItem').removeClass('current');
						_.curSlideNum = Math.round(_.maxSliderTrackLeft/_.curEachSlideWidth)-1;
						_.curLeft = -_.curEachSlideWidth*_.curSlideNum;						
					}
					_.sliderTrack.css({
						"left" : _.curLeft
					});
				}

				_.appendClones();

				_.resetfSliderWrapperMaxWidth();
				_.updateSliderDimension();
		
				_.updateArrowsforNoLoop();

				if ( _.defaults.customizeDots === false ) {
					if ( _.dots ) {
						_.dots.off('click');
					}
					_.sliderWrapper.next('.dotsWrapper').remove();
					_.buildDots();
					_.bindEvent();				
				}

			}
		});

	}

	fSlider.prototype.centerPadding = function() {
		var _ = this;
		_.curSlide = _.sliderWrapper.find('.sliderItem.current');

		if ( _.defaults.centerMode && _.defaults.centerPadding.length > 0 ) {
			_.curSlide.animate({
				"padding" : 0
			}, 200).siblings('.sliderItem').animate({
				"padding" : _.defaults.centerPadding
			}, 200);
		}
	}

	fSlider.prototype.appendClones = function() {
		var _ = this;
		if ( _.defaults.loop ) {
			_.sliderWrapper.find('.fClone').remove();
			_.clonesEachSide = (_.numOfNextSlides > _.checkSlidesToShow) ? _.numOfNextSlides : _.checkSlidesToShow;

			if ( _.defaults.centerMode ) {
				_.clonesEachSide = _.clonesEachSide*(1+Math.ceil(_.showSiblingsHowMuch));
			}

			for ( var _i = 0; _i < _.clonesEachSide; _i++ ) {
				_.sliderItem.eq(_i).clone(true).addClass('fClone').appendTo(_.sliderTrack);
				_.sliderItem.eq(_.totalSlides-(_i+1)).clone(true).addClass('fClone').prependTo(_.sliderTrack);
			}
		}
	}

	fSlider.prototype.autoplay = function() {
		var _ = this;
		if ( _.defaults.autoplay ) {
			_.autoplayTimer = setTimeout(function(){
				_.arrowNext.trigger('click');
			}, _.defaults.autoplaySpeed);
		}
	}

	fSlider.prototype.autoResponsive = function() {
		var _ = this;
		_.curBPIdx = _.defaults.responsiveBreakPoint.length-1;
		_.checkSlidesToShow = _.defaults.slidesToShow[_.curBPIdx];
		_.numOfNextSlides = _.defaults.numOfNextSlides[_.curBPIdx];
		_.setHeight = ( typeof _.defaults.setHeight == "number" ) ? _.defaults.setHeight : _.defaults.setHeight[_.curBPIdx];
		_.showSiblingsHowMuch = ( typeof _.defaults.showSiblingsHowMuch == "number" ) ? _.defaults.showSiblingsHowMuch : _.defaults.showSiblingsHowMuch[_.curBPIdx];
		if ( _.defaults.responsive ){
			for ( var _i = _.curBPIdx-1; _i >= 0; _i-- ) {
				if ( $(window).innerWidth() >= _.defaults.responsiveBreakPoint[_i] &&
					 $(window).innerWidth() < _.defaults.responsiveBreakPoint[_i+1] ) {
					_.curBPIdx = _i;
					_.checkSlidesToShow = _.defaults.slidesToShow[_.curBPIdx];
					_.numOfNextSlides = _.defaults.numOfNextSlides[_.curBPIdx];
					_.setHeight = ( typeof _.defaults.setHeight == "number" ) ? _.defaults.setHeight : _.defaults.setHeight[_.curBPIdx];
					_.showSiblingsHowMuch = ( typeof _.defaults.showSiblingsHowMuch == "number" ) ? _.defaults.showSiblingsHowMuch : _.defaults.showSiblingsHowMuch[_.curBPIdx];
				}
			}
		} else {
			_.curBPIdx = 0;
			_.checkSlidesToShow = ( typeof _.defaults.slidesToShow == "number" ) ? _.defaults.slidesToShow : _.defaults.slidesToShow[_.curBPIdx] ;
			_.numOfNextSlides = ( typeof _.defaults.numOfNextSlides == "number" ) ? _.defaults.numOfNextSlides : _.defaults.numOfNextSlides[_.curBPIdx] ;
			_.setHeight = ( typeof _.defaults.setHeight == "number" ) ? _.defaults.setHeight : _.defaults.setHeight[_.curBPIdx];
			_.showSiblingsHowMuch = ( typeof _.defaults.showSiblingsHowMuch == "number" ) ? _.defaults.showSiblingsHowMuch : _.defaults.showSiblingsHowMuch[_.curBPIdx];
		}
	}

	fSlider.prototype.updateArrowsforNoLoop = function() {
		var _ = this;

		if ( ! _.defaults.loop ) {

			_.curLeft = parseInt(_.sliderTrack.css("left"));

			if ( _.curLeft >= 0 ) {
				_.arrowPrev.addClass('disabled');
				_.arrowNext.removeClass('disabled');
			} else if ( _.curLeft < 0 && _.curLeft <= _.maxSliderTrackLeft+10 ) {  // 5px buffer
				// only correct for a slider with all slides of same width
				_.arrowNext.addClass('disabled');
				_.arrowPrev.removeClass('disabled');
			} else {					
				_.arrowPrev.removeClass('disabled');
				_.arrowNext.removeClass('disabled');
			}

			if ( _.checkSlidesToShow >= _.totalSlides ) {
				_.arrowPrev.addClass('disabled');
				_.arrowNext.addClass('disabled');
			}
		}		
	}

	fSlider.prototype.updateSliderDimension = function( targetSlide ) {
		var _ = this;
		var _sliderDisplayWidth = 0;
		var _targetSlide = (typeof(targetSlide)=="undefined") ? _.curSlide : targetSlide;
		var _slidesHeightArray = [];
		var _maxSlideHeight;

		if ( _.checkSlidesToShow > 1 ) {
			for ( var _j = _.defaults.defaultCurrentSlide; _j < _.checkSlidesToShow; _j++ ) {
				_sliderDisplayWidth += _.sliderItem.eq(_j).outerWidth(true);
			}
		} else {
			_sliderDisplayWidth += _.sliderItem.eq(_.defaults.defaultCurrentSlide).outerWidth(true);
		}

		if ( _.isInit ) {

			for ( var _i = 0; _i < _.totalSlidesWClones; _i++ ) {
				_slidesHeightArray.push( _.sliderItem.eq(_i).outerHeight() );
			}
			
			_.sliderWrapper.css({ "height" : 10, "width" : "100%" });

			if ( _.defaults.dynamicHeight ) {
				for ( var _j = 0; _j < _.sliderWrapper.find('.sliderItem').length; _j++ ) {
					_.sliderWrapper.find('.sliderItem').eq(_j).css({
						"width" : Math.floor(_.sliderWrapper.outerWidth()/_.checkSlidesToShow)
					});
				}
				_.sliderHeight = _.curSlide.outerHeight();
			} else {
				_.sliderHeight = _maxSlideHeight = Math.max.apply(null, _slidesHeightArray);
			}

			_.slideHWratio = _.sliderHeight/_.curSlide.outerWidth(true);

			if ( _.defaults.loop ) {
				_.curEachSlideWidth = _.curSlide.outerWidth(true);
			}
		}
		
		if ( _.isInit ) {
			_.sliderHeight = Math.floor(_.slideHWratio*_.sliderWrapper.outerWidth()/_.checkSlidesToShow);				
		} else {
			if ( _.defaults.adaptiveHeightOnResize ) {
				//_.sliderHeight = _.sliderWrapper.find('.fSliderTrack').outerHeight();
			} else {
				_.sliderHeight = Math.floor(_.slideHWratio*_.sliderWrapper.outerWidth()/_.checkSlidesToShow);
			}
		}			
		if ( _.setHeight ) {
			_.sliderHeight = Math.floor(1/_.defaults.widthHeightRatio*_.sliderWrapper.outerWidth()/_.checkSlidesToShow);
		}
		_.sliderWrapper.css({
			"height" : _.sliderHeight,
			"width" : "100%"
		});
		_.setCenterModeDimension( _.sliderHeight );

		for ( var _j = 0; _j < _.sliderWrapper.find('.sliderItem').length; _j++ ) {
			_.sliderWrapper.find('.sliderItem').eq(_j).css({
				"width" : Math.floor(_.sliderWrapper.outerWidth()/_.checkSlidesToShow)
			});
		}

		_.resetfSliderWrapperMaxWidth();
		
		_.curEachSlideWidth = _.sliderWrapper.outerWidth()/_.checkSlidesToShow;
		_.curLeft = -_.curEachSlideWidth*_.curSlide.index();
		_.totalSlidesWClones = _.sliderWrapper.find('.sliderItem').length;
		_.sliderTrackWidthWClones = _.curEachSlideWidth * _.totalSlidesWClones;

		if ( _.defaults.centerMode ) {
			_.sliderWrapper.parent('.fSliderWrapper').css({
				"maxWidth" : _.curEachSlideWidth*(_.checkSlidesToShow+_.showSiblingsHowMuch*2)
			});
		}

		if ( _.defaults.loop === false ) {
			_.maxSliderTrackLeft = -_.curEachSlideWidth*(_.totalSlides-_.checkSlidesToShow)-5;
			// 5px buffer for css calculation

			if ( _.curLeft < _.maxSliderTrackLeft ) {
				_.curLeft = _.maxSliderTrackLeft;
			}

			if ( _.totalSlides < _.checkSlidesToShow ) {
				_.curLeft = _.maxSliderTrackLeft = 0;
			} 

		}
		
		_.sliderTrack.css({
			"width": _.sliderTrackWidthWClones,
			"left" : _.curLeft
		});
		_.setCenterModeDimension( _.sliderHeight );

		if ( _.isInit == false) {
			_.autoplay();
			if ( _.defaults.adaptiveHeightOnResize ) {
				_.sliderHeight = _.sliderWrapper.find('.fSliderTrack').outerHeight();
				_.sliderWrapper.css({
					"height" : _.sliderHeight
				});
			}
			if ( _.setHeight ) {
				_.sliderHeight = Math.floor(1/_.defaults.widthHeightRatio*_.sliderWrapper.outerWidth()/_.checkSlidesToShow);
				_.sliderWrapper.css({
					"height" : _.sliderHeight
				});
			}
		} else {			
			_.isInit = false;
		}

	}

	fSlider.prototype.setCenterModeDimension = function( _sliderHeight ) {
		var _ = this;
		if ( _.defaults.centerMode ) {						
			_.sliderWrapper.css({
				"width" : _.checkSlidesToShow/(_.checkSlidesToShow+_.showSiblingsHowMuch*2)*100+"%"
			});
			_sliderHeight = Math.floor( _.sliderWrapper.find('.fSliderTrack').outerHeight() );

			_.sliderWrapper.css({
				"height" : _sliderHeight
			});
		}
	}

	fSlider.prototype.resetfSliderWrapperMaxWidth = function(){
		var _ = this;
		if ( _.defaults.centerMode ) {
			_.sliderWrapper.parent('.fSliderWrapper').css({
				"maxWidth" : "100%"
			});
		}
	}

	fSlider.prototype.buildDots = function() {
		var _ = this;
		var _dots = null;

		if ( _.defaults.dots ) { 

			if ( _.defaults.customizeDots === false ) {
				if ( _.totalSlides%_.checkSlidesToShow === 0 && 
					_.totalSlides/_.checkSlidesToShow >= 2 && 
					_.numOfNextSlides === _.checkSlidesToShow ) {

					_dots = '<ul class="dotsWrapper">';
					for ( var _i = 0; _i < _.totalSlides/_.checkSlidesToShow; _i++ ) {
						_dots += '<li class="dot" data-dot="'+_i+'"></li>';
					}
					_dots += '</ul>';

					$(_dots).insertAfter(_.sliderWrapper);
					_.dots = _.sliderWrapper.next('.dotsWrapper').find('.dot');
					_.dots.eq(_.curSlideNum).addClass('current');
				}
			} else {
				_.dots = $('.fSliderWrapper').next('.cusDotsWrapper').find('.cusdot');
				var _cusDotsLength = _.dots.length;
				for ( var _i = 0; _i < _cusDotsLength; _i++ ) {
					_.dots.eq(_i).data('dot', _i);
				}
				_.dots.eq(_.curSlideNum).addClass('current');
			}

			if ( _.defaults.loop === false ) {

				if ( _.defaults.slidesToShowDesktop >= _.totalSlides ) {
					_.arrowPrev.hide();
					_.arrowNext.hide();
				}

				if ( _.defaults.defaultCurrentSlide === 0 ) {
					_.arrowPrev.addClass('disabled');
				} 
			}			

		}

	}

	fSlider.prototype.bindEvent = function() {
		var _ = this;

		if ( _.defaults.dots && _.dots ) {
			_.dots.on('click', function() {
				if ( _.isAnimating === false ) {
					_.curLeft = parseInt(_.sliderTrack.css("left"));
					_.curSlide = _.sliderWrapper.find('.sliderItem.current');
					_.sliderWrapper.find('.sliderItem').removeClass('current');
					_.curSlideNum = $(this).data('dot');

					_.isAnimating = true;
					_.sliderWrapper.addClass('isAnimating');

					$(this).addClass('current').siblings('.dot').removeClass('current');

					var _newLeft = _.defaults.loop ? -_.curEachSlideWidth*_.clonesEachSide : 0;
					if ( _.defaults.centerMode ) {
						if ( _.numOfNextSlides === 1 ) {
							_newLeft = -_.curEachSlideWidth*(_.numOfNextSlides+_.clonesEachSide-1);
						} else {
							_newLeft = -_.curEachSlideWidth*(_.numOfNextSlides+_.clonesEachSide/2);
						}
					}
					
					if ( _.defaults.loop || ( _.defaults.loop === false && _newLeft > -_.curEachSlideWidth*(_.totalSlides-_.checkSlidesToShow) ) ) {
						for ( var _i = 0; _i < _.curSlideNum; _i++ ) {								
							_newLeft -= _.curEachSlideWidth*_.numOfNextSlides;
						}
					}

					if ( _.defaults.loop ) {
						if ( _.curSlideNum === 0 && 
							_.curSlide.index()+(_.numOfNextSlides-1) === _.totalSlidesWClones-_.clonesEachSide-1 ) {
							_newLeft = _.curLeft-_.curEachSlideWidth*_.numOfNextSlides;
						} else if ( (_.curSlideNum+1)*_.numOfNextSlides > _.totalSlides-1 && 
							_.curSlide.index() === _.clonesEachSide ) {
							_newLeft = _.curLeft+_.curEachSlideWidth*_.numOfNextSlides;
						}
					}

					_.sliderTrack.stop(true,false).animate({
						"left" : _newLeft
					}, _.defaults.speed, _.defaults.easing, function(){
						if ( _.defaults.loop ) {
							if ( _.curSlideNum === 0  && _.curSlide.index()+(_.numOfNextSlides-1) <= _.totalSlidesWClones-_.clonesEachSide-1 ) {
								_newLeft = -_.curEachSlideWidth*_.clonesEachSide;
							} else if ( (_.curSlideNum+1)*_.numOfNextSlides > _.totalSlides-1 &&  _.curSlide.index() <= _.clonesEachSide ) {
								_newLeft = -_.curEachSlideWidth*(_.totalSlidesWClones-_.clonesEachSide-_.numOfNextSlides)
							}
							_.sliderTrack.css({
								"left" : _newLeft
							});
						}
						if ( _.defaults.loop && _.curSlideNum === _.totalSlidesWClones-_.clonesEachSide-1 && _.curSlide.index() === 0 ) {
							_newLeft = _.curLeft+_.curEachSlideWidth*_.numOfNextSlides;
						}
						if ( _.defaults.loop === false) {
							if ( _newLeft <= -_.curEachSlideWidth*(_.totalSlides-_.checkSlidesToShow) ) {
								_.arrowNext.addClass('disabled');
								_.arrowPrev.removeClass('disabled');
							} else if ( _newLeft === 0 ) {
								_.arrowPrev.addClass('disabled');
								_.arrowNext.removeClass('disabled');
							} else {
								_.arrowPrev.removeClass('disabled');
								_.arrowNext.removeClass('disabled');
							}
						}
						_.curLeft = _newLeft;

						_.newCurIdx = _.curSlideNum = -_.curLeft/_.curEachSlideWidth;
						_.curSlide.removeClass('current');
						_.sliderWrapper.find('.sliderItem').eq(_.curSlideNum).addClass('current');
						_.centerPadding();

						if ( _.defaults.dynamicHeight ) {
							_.updateSliderHeight();
						}
						_.isAnimating = false;
						_.sliderWrapper.removeClass('isAnimating');
					});

				}
				
			});
		}
		_.arrowPrev.on('click',function() {
			if ( _.defaults.autoplay ) {
				clearTimeout( _.autoplayTimer );
			}
			if ( _.isAnimating === false && ! _.arrowPrev.hasClass('disabled') ) {
				_.isAnimating = true;
				_.sliderWrapper.addClass('isAnimating');
				_.curSlideNum -= _.numOfNextSlides;
				_.updateCurDot('prev', 0);
				_.curLeft = parseInt(_.sliderTrack.css("left"));
				
				_.curEachSlideWidth = _.curSlide.outerWidth(true);

				if ( _.curLeft < 0 ) {
					var _newLeft = _.curLeft + _.curEachSlideWidth*_.numOfNextSlides;
					_.arrowNext.removeClass('disabled');
				} else if ( _.defaults.loop && _.curLeft === 0 ) {
					var _newLeft = -_.sliderTrackWidthWClones + _.curEachSlideWidth*_.numOfNextSlides;
					_.sliderTrack.css({"left": -_.sliderTrackWidthWClones + _.curEachSlideWidth*_.clonesEachSide });
				}

				if ( _.defaults.loop === false && _newLeft === 0 ) {
					_.arrowPrev.addClass('disabled');
				}

				if ( _.defaults.differentWidth ) {
					_.updateSliderDimension(_.curSlide.prev('.sliderItem'));
				}

				if ( _newLeft != _.curLeft ) {

					_.curSlide = _.sliderWrapper.find('.sliderItem.current');
					_.sliderWrapper.find('.sliderItem').removeClass('current');
					_.sliderTrack.stop(true,false).animate({
						"left" : _newLeft
					},_.defaults.speed,_.defaults.easing,function(){
						_.animateEndFn('prev');
						_.curLeft = _newLeft;
						_.isAnimating = false;
						_.sliderWrapper.removeClass('isAnimating');
					});
				} else {
					_.isAnimating = false;
					_.sliderWrapper.removeClass('isAnimating');
				}

			}
		});

		_.arrowNext.on('click',function() {
			if ( _.defaults.autoplay ) {
				clearTimeout( _.autoplayTimer );
			}
			if ( _.isAnimating === false && !_.arrowNext.hasClass('disabled') ) {
				_.isAnimating = true;
				_.sliderWrapper.addClass('isAnimating');
				_.curSlideNum += _.numOfNextSlides;
				_.updateCurDot('next', (_.totalSlidesWClones-_.clonesEachSide*2)/_.numOfNextSlides-1);

				_.curLeft = parseInt(_.sliderTrack.css("left"));

				if ( _.defaults.loop ) {
					var _lastSlide = _.sliderWrapper.find('.sliderItem').eq(0); // lastSlideDuplica
				} else {
					_.arrowPrev.removeClass('disabled');
				}

				_.curEachSlideWidth = _.curSlide.outerWidth(true);

				if ( _.defaults.loop === false ) {

					if ( -_.curLeft == _.curEachSlideWidth*(_.totalSlides-_.numOfNextSlides*2) || 
						-_.curLeft == _.curEachSlideWidth*(_.totalSlides-_.checkSlidesToShow-1) ) {							
						// only correct for a slider with all slides of same width
						_.arrowNext.addClass('disabled');
					}

				}
				
				if ( _.defaults.loop || ( _.defaults.loop === false && _.curLeft > _.maxSliderTrackLeft ) ) {
					_.curSlide = _.sliderWrapper.find('.sliderItem.current');
					_.sliderWrapper.find('.sliderItem').removeClass('current');
					_.sliderTrack.stop(true,false).animate({
						"left" : _.curLeft - _.curEachSlideWidth*_.numOfNextSlides
					},_.defaults.speed,_.defaults.easing,function(){

						_.animateEndFn('next');
						_.isAnimating = false;
						_.sliderWrapper.removeClass('isAnimating');
						if ( _.defaults.autoplay ) {
							_.autoplay();
						}
					});
				} else if ( _.defaults.loop === false && _.curLeft <= _.maxSliderTrackLeft ) {
					_.forceArrowClick();
					_.isAnimating = false;
					_.sliderWrapper.removeClass('isAnimating');
				}

			}
		});

		_.sliderWrapper.find('a').on('click',function(){
			if ( _.isDragging ) {
				e.preventDefault();
			}
			_.isDragging = false;
		});

		if ( _.defaults.drag ) {
			_.touchEvent();
		}

	}

	fSlider.prototype.touchEvent = function() {
		var _ = this;
		var startPosX = 0;
		var startPosY = 0;

		_.sliderWrapper.on('mouseover', function(){
			if ( _.defaults.pauseOnHover && _.defaults.autoplay && !_.defaults.drag ) {
				clearTimeout(_.autoplayTimer);
			}
		}).on('mouseleave', function(){
			if ( _.defaults.pauseOnHover && _.defaults.autoplay && !_.defaults.drag ) {
				_.autoplay();
			}
		});		

		_.sliderWrapper.on('mousedown touchstart', function(e) {
			_.curSlide = _.sliderWrapper.find('.sliderItem.current');
			_.curLeft = parseInt(_.sliderTrack.css("left"));
			var _thisLeft = parseInt(_.sliderTrack.css("left"));

			if ( _.isAnimating === false ) {
				//e.preventDefault();
				resetDragFunc();
				clearTimeout(_.autoplayTimer);

				if (e.type != 'mousedown') {
					var touch = e.originalEvent.targetTouches[0] || e.originalEvent.changedTouches[0];
				} else {
					touch = e;
				}
				startPosX = touch.pageX;
				startPosY = touch.pageY;

				$(document).on('mousemove touchmove', function(e) {
					if (e.type != 'mousemove') {
						touch = e.originalEvent.targetTouches[0] || e.originalEvent.changedTouches[0];
					} else {
						touch = e;
					}

					// for scroll up and down on mobile
					if ( Math.abs(touch.pageX - startPosX) < 40 ) {
						return;
					}

					// slider position
					_.isDragging = true;
					_.isAnimating = true;
					_.sliderWrapper.addClass('isAnimating');
		  	  		e.preventDefault();
					if ( (_.defaults.loop === false && _.curSlideNum === 0) ||
						 (_.defaults.loop === false && _.curSlideNum + _.numOfNextSlides > _.totalSlides) ) {
						_.sliderTrack.css({
							'left': _.curLeft + (touch.pageX - startPosX)/3
						});
					} else {
						_.sliderTrack.css({
							'left': _.curLeft + touch.pageX - startPosX
						});
					}
					_.curSlideNum = Math.ceil(-parseInt(_.sliderTrack.css("left")) / _.curEachSlideWidth);
					_.curSlideNum = ( _.curSlideNum < 0 ) ? 0 : _.curSlideNum;
					/*if ( e.type == 'mousemove' ) {
						if ( _.defaults.centerMode ) {
							if ( ( touch.pageX > _.sliderWrapper.parent('.fSliderWrapper').offset().left + _.sliderWrapper.parent('.fSliderWrapper').outerWidth() ) ||
								 ( touch.pageX < _.sliderWrapper.parent('.fSliderWrapper').offset().left ) ||							
								 ( touch.pageY < _.sliderWrapper.parent('.fSliderWrapper').offset().top ) ||
								 ( touch.pageY > _.sliderWrapper.parent('.fSliderWrapper').offset().top + _.sliderWrapper.outerHeight() ) ) {
								_.sliderWrapper.trigger('mouseup');
							}
						} else {
							if ( ( touch.pageX > _.sliderWrapper.offset().left + _.sliderWrapper.outerWidth() ) ||
								 ( touch.pageX < _.sliderWrapper.offset().left ) ||							
								 ( touch.pageY < _.sliderWrapper.offset().top ) ||
								 ( touch.pageY > _.sliderWrapper.offset().top + _.sliderWrapper.outerHeight() ) ) {
								_.sliderWrapper.trigger('mouseup');
							}
						}
					}*/
					_.isAnimating = false;
					_.sliderWrapper.removeClass('isAnimating');
					
				});
				$(document).on('mouseup touchend', function(e) {
					_thisLeft = parseInt(_.sliderTrack.css("left"));
					_.curSlide = _.sliderWrapper.find('.sliderItem.current');
					touch = e;

					if (e.type != 'mouseup') {
						touch = e.originalEvent.targetTouches[0] || e.originalEvent.changedTouches[0];
					}
					$(document).off('mousemove touchmove');
					$(document).off('mouseup touchend');

					// detect direction
					if ( _thisLeft != _.curLeft ) {
						var _newLeft = _.curLeft;
						var _stayAtCur = true;
						if ( _thisLeft > _.curLeft ) { // prev
							var dir = 'prev';
							if ( _thisLeft - _.curLeft > _.curEachSlideWidth*_.numOfNextSlides/4 ) {
								if ( _.defaults.loop ) {
									if ( _.curLeft === 0 ) {
										_newLeft = -_.sliderTrackWidthWClones + _.curEachSlideWidth*_.numOfNextSlides*2;
										_.sliderTrack.css({"left": -_.sliderTrackWidthWClones + _.curEachSlideWidth*_.numOfNextSlides + touch.pageX - startPosX });
									} else {
										_newLeft = _.curLeft + _.curEachSlideWidth*_.numOfNextSlides;
										_.sliderTrack.css('left', _.curLeft + touch.pageX - startPosX);
									}
									_stayAtCur = false;
								} else {
									if ( _.curLeft < 0 ) {
										_newLeft = _.curLeft + _.curEachSlideWidth*_.numOfNextSlides;
										_.sliderTrack.css('left', _.curLeft + touch.pageX - startPosX);
										_stayAtCur = false;
									} else {
										_stayAtCur = true;
									}
									
								}
							}
						} else { // next
							var dir = 'next';
							if ( startPosX - touch.pageX > _.curEachSlideWidth*_.numOfNextSlides/4 ) {
								if ( ( _.checkSlidesToShow > 1 && 
									! ( _.defaults.loop === false && _thisLeft <= _.maxSliderTrackLeft - _.curEachSlideWidth*_.checkSlidesToShow/2 ) ) || 
									( _.checkSlidesToShow === 1 && 
									! ( _.defaults.loop === false && _thisLeft <= _.maxSliderTrackLeft ) ) ) {
									if ( (_.defaults.loop === false && _.curSlide.index() + _.checkSlidesToShow >= _.totalSlides) ) {
										_stayAtCur = true;
									} else {
										_newLeft = _.curLeft-_.curEachSlideWidth*_.numOfNextSlides;
										_stayAtCur = false;
									}
								}
							}
						}
						_.isAnimating = true;
						_.sliderWrapper.addClass('isAnimating');
						
						_.sliderTrack.stop(true,false).animate({
							'left': _newLeft
						}, _.defaults.speed, _.defaults.easing, function() {
							_.sliderWrapper.find('.sliderItem').removeClass('current');
							_.animateEndFn( dir, _stayAtCur );
							_.curSlideNum = Math.ceil(-parseInt(_.sliderTrack.css("left")) / _.curEachSlideWidth);
							if ( _stayAtCur === false ) {
								if ( dir == 'prev' ) {
									_.arrowNext.removeClass('disabled');
									_.updateCurDot( dir, 0);
									if ( _.defaults.loop === false && _.curLeft+_.curEachSlideWidth*_.numOfNextSlides >= 10 ) {
										_.arrowPrev.addClass('disabled');
									}
								} else {
									_.arrowPrev.removeClass('disabled');
									_.updateCurDot( dir, (_.totalSlidesWClones-_.clonesEachSide*2)/_.numOfNextSlides-1);
									if ( _.defaults.loop === false && _newLeft <= _.maxSliderTrackLeft+10 ) {
										_.arrowNext.addClass('disabled');
									}
								}
							}								
							resetDragFunc();
							_.autoplay();
						});
					}			
				});
			}
		});

		function resetDragFunc() {
			_.isAnimating = false;
			_.sliderWrapper.removeClass('isAnimating');
			$(document).off('mousemove touchmove');
			$(document).off('mouseup touchend');
		}

	}

	fSlider.prototype.goToSlide = function( newIdx ) {
		var _ = this;
		var _dir = "prev";
		var _stayAtCur = true;
		var _newLeft = 0;		
		_.sliderTrack = _.sliderWrapper.find('.fSliderTrack');
		if ( typeof _.defaults.callbacks.afterchangeSlide == "undefined" ) {
			_.afterChangeSlide = function(){};
		} else {
			_.afterChangeSlide = _.defaults.callbacks.afterchangeSlide;
		}
		if ( typeof _.defaults.callbacks.noLoopAfterEndSlideClickArrow == "undefined" ) {
			_.forceArrowClick = function(){};
		} else {
			_.forceArrowClick = _.defaults.callbacks.noLoopAfterEndSlideClickArrow;
		}

		if ( _.defaults.autoplay ) {
			clearTimeout( _.autoplayTimer );
		}

		_.newCurIdx = newIdx + _.clonesEachSide;

		_.isAnimating = true;
		_.sliderWrapper.addClass('isAnimating');

		_.curSlide = _.sliderWrapper.find('.sliderItem.current');

		_stayAtCur = ( _.curSlide.index() === _.newCurIdx ) ? true : false;

		if ( _stayAtCur === false ) {
			_.sliderWrapper.find('.sliderItem').removeClass('current');
			_newLeft = -_.newCurIdx*_.curEachSlideWidth;
			_.beforeGoToSlide();

			_dir = 'goTo' ;

			_.sliderTrack.stop(true,false).animate({
				'left': _newLeft
			}, _.defaults.speed, _.defaults.easing, function() {
				_.animateEndFn( _dir, _stayAtCur );
				_.curSlideNum = Math.ceil(-parseInt(_.sliderTrack.css("left")) / _.curEachSlideWidth);
				if ( _stayAtCur === false ) {
					_.arrowNext.removeClass('disabled');
					_.arrowPrev.removeClass('disabled');
					//_.updateCurDot( _dir, 0);
					//_.updateCurDot( _dir, (_.totalSlidesWClones-_.clonesEachSide*2)/_.numOfNextSlides-1);
					if ( _.defaults.loop === false && _newLeft >= 0 ) {
						_.arrowPrev.addClass('disabled');
					}
					if ( _.defaults.loop === false && Math.abs(_newLeft - _.maxSliderTrackLeft) < 8 ) {
						_.arrowNext.addClass('disabled');
					}
				}
				_.isAnimating = false;
				_.sliderWrapper.removeClass('isAnimating');
				_.autoplay();
			});


		} else {
			_.afterChangeSlide();
			_.isAnimating = false;
			_.sliderWrapper.removeClass('isAnimating');
		}
		
	}

	fSlider.prototype.updateSliderHeight = function() {
		var _ = this;
		if ( _.defaults.dynamicHeight ) {
			_.sliderWrapper.animate({
				"height" : _.sliderWrapper.find('.sliderItem').eq(_.newCurIdx).outerHeight()
			}, _.defaults.speed);
		}
	}

	fSlider.prototype.animateEndFn = function( dir, stay ) {
		var _ = this;

		if ( typeof stay == "undefined" ) {
			stay = false;
		}

		_.curLeft = parseInt(_.sliderTrack.css("left"));

		if ( stay === false ) {
			if ( dir === 'prev' ) {
				_.slideDir = 'prev';
				_.newCurIdx = _.curSlide.index() - _.numOfNextSlides;
				if ( _.defaults.loop ) {
					if ( ( _.defaults.centerMode && 
							_.curLeft +_.curEachSlideWidth*_.clonesEachSide/2 < 10 && 
							_.newCurIdx <= _.clonesEachSide-1 ) || 
							( _.defaults.centerMode === false &&
							_.newCurIdx <= _.clonesEachSide-_.numOfNextSlides ) ) {
						// at last slides duplica --> go to real last slides
							_.sliderTrack.css({
								"left" : -_.sliderTrackWidthWClones+_.curEachSlideWidth*(_.clonesEachSide+_.numOfNextSlides)
							});

							if ( _.defaults.centerMode && 
							_.curLeft +_.curEachSlideWidth*_.clonesEachSide/2 < 10 && 
							_.newCurIdx <= _.clonesEachSide-1 ) {
								_.newCurIdx = _.totalSlidesWClones-_.clonesEachSide-_.checkSlidesToShow;
							} else {
								_.newCurIdx = (_.totalSlidesWClones-1)-_.clonesEachSide;
							}
					}
				
				}
			} else if ( dir === 'next' ) {
				_.slideDir = 'next';
				_.newCurIdx = _.curSlide.index() + _.numOfNextSlides;
				_.sliderTrackWidthWClones = _.sliderWrapper.find('.fSliderTrack').outerWidth(true);

				if ( _.defaults.loop && 
					_.curLeft + _.sliderTrackWidthWClones - _.curEachSlideWidth*(_.clonesEachSide) < 10 ) {
					// at first slide duplica --> go to real first slide
					_.sliderTrack.css({
						"left" : -_.curEachSlideWidth*_.clonesEachSide
					});
					_.newCurIdx = _.clonesEachSide;
				} else {
					// loop: add current to real first slide
					if ( _.newCurIdx === _.totalSlidesWClones-_.clonesEachSide ) {
						_.newCurIdx = ( _.defaults.loop ) ? _.clonesEachSide : _.newCurIdx;
					}
				}
			} else if ( dir === 'goTo' ) {

			}
		} else {
			_.newCurIdx = _.curSlide.index();
		}
		_.sliderWrapper.find('.sliderItem').eq(_.newCurIdx).addClass('current');
		_.updateSliderHeight();
		_.afterChangeSlide();
		_.centerPadding();
		
	}

	fSlider.prototype.returnSlideDir = function() {
		var _ = this;
		return (_.slideDir === 'prev') ? 'prev' : 'next';
	}

	fSlider.prototype.updateCurDot = function( dir, checkSlide ) {	
		var _ = this;
		var _dotIndex = 0;

		_.curSlide = _.sliderWrapper.find('.sliderItem.current');
		_.curDot = _.sliderWrapper.next('.dotsWrapper').find('.dot.current');

		if ( _.dots ) {
			_dotIndex = ( dir === 'prev' ) ? (_.totalSlidesWClones-_.clonesEachSide*2)/_.numOfNextSlides-1 : 0;
			if ( _.defaults.loop && _.curDot.index() === checkSlide ) {
				_.dots.removeClass('current').eq(_dotIndex).addClass('current');
			} else {
				if ( dir == 'prev' ) {
					_.curDot.prev('.dot').addClass('current').siblings('.dot').removeClass('current');
				} else {
					_.curDot.next('.dot').addClass('current').siblings('.dot').removeClass('current');
				}
			}
		}

	}

	fSlider.prototype.destroy = function() {
		var _ = this;
		if ( _.defaults.autoplay ) {
			clearTimeout( _.autoplayTimer );
		}

		if ( _.dots ) {
			_.dots.off('click');
			_.sliderWrapper.next('.dotsWrapper').remove();
		}		
		_.arrowPrev.off('click').remove();
		_.arrowNext.off('click').remove();
		if ( _.defaults.drag ) {
			_.sliderWrapper.off('mousedown touchstart');
		}
		_.defaults.centerMode = false;
		_.sliderWrapper.find('.fClone').remove();
		_.sliderWrapper.removeClass('fSlider').attr('style', '').unwrap();
		_.sliderWrapper.find('.sliderItem').attr('style', '').removeClass('current').unwrap();

		_.defaults = {
			arrowPrevClass: "fArrow-prev", // ok
			arrowNextClass: "fArrow-next", // ok
			autoplay: null, // ok
			autoplaySpeed: 3000, // ok
			adaptiveHeightOnResize: null, // ok
			callbacks: {
				beforeGoToSlide: function(){},
				noLoopAfterEndSlideClickArrow: function(){},
				afterchangeSlide: function(){}
			}, // ok
			centerMode: null, // ok
			centerPadding: "0.2%", // ok
			customizeDots: null, // ok
			dots: null, // ok
			drag: null, // ok
			dynamicHeight: null, // ok
			setHeight: false, // ok
			widthHeightRatio: 0, // ok
			easing: "easeOutExpo", // ok
			defaultCurrentSlide: 0, // ok
			loop: null, // ok
			responsiveBreakPoint: [0, 960], // ok
			numOfNextSlides: [1, 1], // ok
			pauseOnHover: null, // ok
			responsive: null, // ok
			showArrows: null, // ok
			showSiblingsHowMuch: 0.5, // ok
			slidesToShow: [1, 1], // ok
			speed: 500 // ok
		}

	}


	$.fn.fSlider = function() {
		var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].fSlider = new fSlider(_[i], opt);
            else
                ret = _[i].fSlider[opt].apply(_[i].fSlider, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;		
	}

})( jQuery );

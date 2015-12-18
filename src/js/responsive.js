var RESPONSIVE = "responsive";

var mResponsiveWrapper = null;
var mResponsiveTracker = null;
var mResponsive_array = null;
var mResponsive_str = null;

function responsive_start()
{
	mResponsiveWrapper = $("div.wrapper");
	mResponsive_array = [0, 760];
	mResponsive_item = ["mobile", "desktop"];
	
	$("body").append("<div></div>");
	mResponsiveTracker = $("body").children("div:last-child");
	mResponsiveTracker.css("width", "100%");
	mResponsiveTracker.css("height", "100%");
	mResponsiveTracker.css("position", "absolute");
	mResponsiveTracker.css("top", "0");
	mResponsiveTracker.css("left", "0");
	mResponsiveTracker.css("visibility", "hidden");
	
	if($.browser.msie && parseInt($.browser.version, 10) <= 8) {
		
		//mResponsive_str = RESPONSIVE + mResponsive_array[mResponsive_array.length - 1];
		
		mResponsiveWrapper.addClass(mResponsive_item[1]);
		$('body').addClass(mResponsive_item[1]);
		
	}else{
		$(window).bind("resize", function(){responsive_updateBackground()});
		
		responsive_updateBackground();
		setTimeout
		(
			responsive_updateBackground,
			200
		);
	}
}

function responsive_updateBackground()
{
	var _i = null;
	var _width_num = 0;
	var _height_num = 0;
	var _responsive_num = 0;
	var _fontSize_num = null;
	
	_width_num = document.documentElement.clientWidth;
	_height_num = document.documentElement.clientHeight;
	
	for (_i = 0; _i < mResponsive_array.length; _i++)
	{
		if (_width_num >= mResponsive_array[_i])
		{
			_responsive_num = mResponsive_array[_i];
		}
		else
		{
			break;
		}
	}
	
	var itemContainerTimer;
	
	if (mResponsive_str != RESPONSIVE + _responsive_num)
	{
		if (mResponsive_str != null)
		{
			if(mResponsive_str == "responsive0")
			{
				mResponsiveWrapper.removeClass(mResponsive_item[0]);
				$('body').removeClass(mResponsive_item[0]);
				//$('body').removeClass('menuOpen');
			}else
			{
				mResponsiveWrapper.removeClass(mResponsive_item[1]);
				$('body').removeClass(mResponsive_item[1]);
				//$('body').removeClass('menuOpen');
			}


			
		}

		mResponsive_str = RESPONSIVE + _responsive_num;

		if(mResponsive_str == "responsive0")
		{
			mResponsiveWrapper.addClass(mResponsive_item[0]);
			$('body').addClass(mResponsive_item[0]);	
		}else
		{
			mResponsiveWrapper.addClass(mResponsive_item[1]);
			$('body').addClass(mResponsive_item[1]);	
		}
		
		$(document).trigger('responsive');
	}
}
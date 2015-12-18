// Menu var
var gEaseTime = 400;
var gEaseAnimation = "easeInOutQuint";

function common_fn()
{
	hideLoading();

	responsive_start();

	// Menu button
	$('.mBtnMenu, .menuDimWrapper').unbind().on('click',function(){
		$('.wrapper').toggleClass('menuOpen');
		$('.menuWrapper').slideToggle(gEaseTime, gEaseAnimation);
	});

	//Pop-ups
	$('.popup-tnc').on('click', function(){
		popup('#TNC');
	});

	$(document).on('responsive',function(){

		/*$('.loadingWrapper').show();

		setTimeout(function(){
			hideLoading();	
		},500);*/
		
	});
}

function showLoading()
{
	$('.loadingWrapper').fadeIn();	
}

function hideLoading()
{
	$('.loadingWrapper').fadeOut();	
}

function windowHeightControler()
{
	gWindowHeight = $(window).height();

	var gHeaderHeight = $('.headerWrapper').height();

	//console.log(gWindowHeight, gHeaderHeight);

	//alert(mResponsive_str);

	if(mResponsive_str != "responsive0")
	{
		$('.contentWrapper').css({
			"min-height" : gWindowHeight - gHeaderHeight
		});	
	}else
	{
		$('.contentWrapper').css({
			"min-height" : gWindowHeight
		});	
	}
	
}

// pop-up
function popup(pTarget, isClose, callbackFunction, btnClose)
{
	$.magnificPopup.close();

	if(typeof isClose == "undefined")
	{
		isClose = true;
		btnClose = true;
	}

	$(window).scrollTop(0);

	setTimeout(function()
	{
		$.magnificPopup.open({
			showCloseBtn: btnClose,
			closeOnBgClick: isClose,
			mainClass: 'my-mfp-zoom-in',
			removalDelay: 300,
			items: {
				src: pTarget,
				type: "inline"
			},
			callbacks: {
				open: function(){
					
					$(window).on('resize.pop', function(){
						$('.wrapper').css({'height':'auto'});
						$('.wrapper').css({'height':window.innerHeight, 'overflow':'hidden'});						
					});

					$(window).trigger('resize.pop');
					
				},
				close: function(){
					$('.wrapper').css({'height':'', 'overflow':''});
					$(window).off('resize.pop');
					
					if (typeof callbackFunction != 'undefined') {
						callbackFunction();
					}
				}
			}
		})
	}, 200);
}


// pop up msg for back-end use
function popupMessage(pTarget, isClose, pMessage)
{
	$.magnificPopup.close();

	if(typeof isClose == "undefined")
	{
		isClose = true;
	}

	$(window).scrollTop(0);

	setTimeout(function()
	{
		$.magnificPopup.open({
			showCloseBtn: false,
			closeOnBgClick: isClose,
			mainClass: 'my-mfp-zoom-in',
			removalDelay: 300,
			items: {
				src: pTarget,
				type: "inline"
			},
			callbacks: {
				open: function(){
					
					$(window).on('resize.pop', function(){
						$('.wrapper').css({'height':'auto'});
						$('.wrapper').css({'height':window.innerHeight, 'overflow':'hidden'});						
					});

					$(window).trigger('resize.pop');

					$('.messagePop .messageContentWrapper p').append(pMessage);
					
				},
				close: function(){
					$('.wrapper').css({'height':'', 'overflow':''});
					$(window).off('resize.pop');
					
					
				}
			}
		})
	}, 200);
}

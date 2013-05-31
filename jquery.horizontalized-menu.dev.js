/**
 * HorizontalizedMenu is a jQuery plugin that provides the javascript for a truly horizontal access-menu.
 * And by truly we mean that the sub menus span horizontally across the whole root-width and not vertically.
 *
 * It also supports positioning a pointer of the sub menu below it's parent <li>.
 * You can control the time it takes to fade-in/out the sub-menus.
 *
 * The movement direction on fade-in/out of sub-menus are based on the angular direction of the mouse movement,
 * thus sub-menus can move vertically (can be disabled) and horizontally.
 * In order to never risk an infinite animation-loop due to the menu-movement in the direction of the mouse,
 * any menu movement is always in the opposite direction of mouse movement.
 *
 * @version 0.2a
 * @license GPL 3.0 http://www.gnu.org/licenses/gpl-3.0.html
 * @copyright Mazdak Farrokhzad <twingoow@gmail.com>
 */
(function($) {

	/* =Default setttings.
	----------------------------------------------- */
	$.horizontalizedMenu = {
		settings: {
			// Time it takes to fade in/out a sub-menu.
			fadeTime: 300,
			// What easing to use for fade in/out animation.
			easing: 'swing',
			// Allow vertical movement animation?
			verticalMovement: true,
			// Show/Hide pointer?
			pointerShow: true,
			// Adjust pointer positioning?
			pointerAdjust: true,
			// Make a pointer if non-existent?
			pointerMake: true,
			// Use full width on deeper levels than the first sub-menu?
			widthFullDeep: false,
			// Reduce width with each level?
			// Possible values: 'left', 'right', 'none', 'center'.
			// When value is left or right: the margin-left/right value of the outmost child of .sub-menu [eg: .menu-sub-box] is used for reducement.
			widthReduce: 'left',
			// use outerWidth() / width() of parent .menu-sub-content of a .menu-sub? 
			outerWidth: true
		},
		classes: {
			base: 'horizontalizedMenu',
			active: 'hover',
			sub: 'menu-sub',
			content: 'menu-sub-content',
			pointer: 'menu-sub-pointer',
			pointerBorder: 'menu-sub-pointer-border'
		}
	};

	var classes = $.horizontalizedMenu.classes;

	/* =Angular Logic.
	----------------------------------------------- */
	var Angle = function( val ) {
		if ( val instanceof Angle ) {
			this.val = val.val;
		} else {
			this.val = val;
			this.normalize();
		}
	};
	$.extend( Angle, {
		MOD_CIRCLE: 2 * Math.PI,
		fromVector: function( vector ) {
			return new Angle( Math.atan2( vector.y, vector.x ) );
		},
		fromDeg: function( deg ) {
			return new Angle( Math.PI / 180 * deg );
		}
	});
	Angle.prototype = {
		normalize: function() {
			this.val = (this.val + Angle.MOD_CIRCLE) % Angle.MOD_CIRCLE;
			return this;
		},
		isOpposite: function( angle, boundingInterval ) {
			// Make sure we've got an angle.
			angle = new Angle( angle );

			// Calculate opposite boundary of angle.
			var min = (new Angle( angle.val + Math.PI - boundingInterval / 2 )),
				max = (new Angle( angle.val + Math.PI + boundingInterval / 2 ));

			// If wrong order, swap!
			if ( min.val > max.val ) {
				var temp = min;
				min = max;
				max = temp;
			}

			// Is this within opposite boundary of angle?
			return this.val >= min.val && this.val <= max.val;
		},
		toDeg: function() {
			return 180 / Math.PI * this.val;
		}
	};

	/* =Logistic function.
	----------------------------------------------- */
	var	logistic = function( x, xK, K ) {
			var A = K / logisticConst.y0 - 1,
				k = -1 * Math.log( logisticConst.epsilon / A ) / xK; /* y( xK ) = K; */

			// Logistical function: K / (1 + A * e^(-k * x))^0.5
			return Math.round( K / Math.sqrt( ( 1 + A * Math.exp( -k * x ) ) ) );
		},
		logisticConst = {
			// y( 0 ) = y0;
			y0: 0.05,
			// A very low number ( but not too low ).
			epsilon: Math.pow( 10, -10 )
		};

	/* =Misc functions.
	----------------------------------------------- */
	var filterEmpty = function( list ) {
			return $.grep( $.isArray( list ) ? list : [list], function( v ) { return v } );
		},
		dot = function( _classList ) {
			return $.map( filterEmpty( _classList ), function( c ) { return '.' + c; } ).join( ',' );
		},
		toggleLi = function( e, elem ) {
			(elem || e.data).toggleClass( classes.active, e instanceof $.Event ? e.type in { 'mouseenter':1, 'focus':1 } : e );
		},
		togglePointers = function( elem ) {
			elem.find( dot( [classes.pointer, classes.pointerBorder] ) ).hide();
		},
		pointerMakeIf = function( elem, _class ) {
			if ( !elem.siblings( _class ).length ) {
				$( '<div>' ).insertBefore( elem ).addClass( _class );
			}
		};

	/* =CSS Px Offset functions.
	----------------------------------------------- */
	var cssDirOffset = function( elem, what_1, dir, what_2 ) {
			return parseInt( elem.css( filterEmpty( [what_1, dir === 'l' ? 'left' : 'right', what_2] ).join( '-' ) ) );
		},
		margin = function( elem, dir ) {
			return cssDirOffset( elem, 'margin', dir );
		},
		padding = function( elem, dir ) {
			return cssDirOffset( elem, 'padding', dir );
		},
		border = function( elem, dir ) {
			return cssDirOffset( elem, 'border', dir, 'width' );
		},
		all = function( elem, dir ) {
			return padding( elem, dir ) + border( elem, dir ) + margin( elem, dir );
		};

	/* =Submenu Logic.
	----------------------------------------------- */
	var SubMenu = function( elem, root, settings ) {
		var self = this;

		// Store elements for quick access.
		this.sub = $( elem );
		this.root = root;
		this.li = this.sub.parent();
		this.parent = this.li.parent();
		this.content = this.sub.closestDescendant( dot( classes.content ) ).first();

		// Make pointer + border if asked for & not present.
		if ( settings.pointerMake ) {
			pointerMakeIf( this.content, classes.pointerBorder );
			pointerMakeIf( this.content, classes.pointer );
		}

		$.extend( this, {
			// Method: Quickly adjust width & pointer position.
			adjust: function() {
				this.adjustWidth();
				this.pointer.calcAdjustment();
			},
			adjustWidth: function() {
				// Don't adjust if parent-menu ain't root / implicitly ordered (widthFullDeep).
				var inDeep = false;
				if ( !this.parent.is( this.root ) ) {
					if ( settings.widthFullDeep ) {
						inDeep = true;
					} else {
						return;
					}
				}

				var width = 0,
					adjustedLeft = 0;

				if ( inDeep ) {
					if ( settings.widthReduce === 'center' ) {} // Center-reduce needs no extra work!
					else {
						// Fetch all above <li> until parent sub-menu but exclude <li>s parent.
						var container = this.li.parentsUntil( dot( classes.sub ) ).not( this.parent );
						// Make sure lowest node-level has sub-menu as parent.
						container = container.last().parent().is( dot( classes.sub ) ) ? container : $();

						// .menu-sub-content: Padding & Border is of no importance!
						var lc = margin( this.parent, 'r' ),
							rc = margin( this.parent, 'l' );

						container.each( function() {
							lc += all( $( this ), 'r' );
							rc += all( $( this ), 'l' );
						} );

						settings.widthReduce in { 'right':1, 'none':1 } && (width += rc) && (adjustedLeft += rc);
						settings.widthReduce in { 'left':1, 'none':1 } && (width += lc);
					}
				} else {
					adjustedLeft -= padding( this.parent, 'l' );
				}

				// Adjust the width of the menu.
				this.sub.width( width + this.parent[settings.outerWidth ? 'outerWidth' : 'width']() );

				// We now need to adjust margin-left so that the menu begins at the first <li> and not this one.
				// Making it span the entire width of the parent-menu (3 or 4 parents before).
				adjustedLeft += this.li.position().left
							 +	(settings.outerWidth ? border( this.parent, 'l' ) : 0)
							 +	border( this.li, 'l' ) + margin( this.li, 'l' );

				this.sub.css( 'margin-left', '-' + adjustedLeft + 'px' );
			},
			pointer: {
				elem: this.content.siblings( dot( classes.pointer ) ),
				adjustLeft: false,
				adjusted: false,
				// Calculates pointer position adjustment.
				calcAdjustment: function() {
					// Only calc adjustment if needed.
					if ( settings.pointerShow && settings.pointerAdjust ) {
						this.adjustLeft = -1 * margin( self.sub, 'l' ) - this.elem.outerWidth() / 2,
						this.adjusted = false;
					}
				},
				// Adjusts pointer position.
				adjust: function() {
					// Toggle pointer.
					this.elem.siblings( dot( classes.pointerBorder ) ).add( this.elem ).toggle( settings.pointerShow );

					if ( settings.pointerShow && settings.pointerAdjust && !this.adjusted ) {
						this.adjusted = true;
						this.elem.css( 'left', this.adjustLeft += (self.li.outerWidth() - border( self.li, 'l' ) - border( self.li, 'r' )) / 2 )
							.prev().css( 'left', ++this.adjustLeft );
					}
				}
			},
			// Method: Show ("show"/"mouseenter") / Hide ("hide"/"mouseleave") submenu.
			hover: function( e ) {
				// Show / Hide ?
				var show = ( e instanceof $.Event ? e.type : e ) in { 'mouseenter':1, 'show':1 };

				// Toggle .active class on <li>.
				toggleLi( show, this.li );

				// If hidden -> Hide from user but enable getting width & height.
				if ( show ) {
					this.sub.css({
						display: 'block',
						opacity: 0
					});

					this.adjust();
				}

				var /* Get angle:
					 * 1) Get width & height of the current <li>.
					 * 2) Calculate the x and y to get an angle to the center of the <li> from that x and y.
					 * 3) Get x-value relative to <li> center & "normalize" it.
					 */
					liDim = {
						w: this.li.width(),
						h: this.li.height()
					},
					offset = this.li.offset(),
					angle = Angle.fromVector({
						x: (e.pageX - offset.left - (liDim.w / 2)) * (liDim.h / liDim.w),
						y: (e.pageY - offset.top  - (liDim.h / 2)) * (liDim.w / liDim.h)
					}),
					/* How much to move:
					 *
					 * We use a logistic function: logistic( x, xK -> y( xK ) = K, K );
					 * Horizontal movement is always done from/to the opposite side of mouse movement.
					 * Vertical movement (if enabled) is done unless mouse is moving downwards and we're hiding.
					 */
					move = {
						left:	( angle.isOpposite( 0, Math.PI ) ? 1 : -1 ) * logistic( this.sub.width(), this.root.width(), this.moveDistance.x ),
						top :	settings.verticalMovement && (show || !angle.isOpposite( Math.PI / 2, Math.PI ))
							?	logistic( this.sub.height(), this.root.height(), this.moveDistance.y )
							:	0
					};

				// Adjust pointer position.
				this.pointer.adjust();

				if ( show ) {
					// Set position to move.
					this.sub.css( move );
					move.left = move.top = 0;
				}

				// Stop any ongoing animation on menu & run animation!
				this.sub.stop( false, true )
					.animate( $.extend( move, { opacity: show ? 1 : 0 } ), {
						duration: settings.fadeTime,
						easing: settings.easing,
						complete: function() { !show && self.sub.css( 'display', 'none' ); } /* Hide box-model on completion! */
					});
			},
			// Method: Bind events.
			bind: function() {
				this.li.bind( 'mouseenter.horizontalizedMenu, mouseleave.horizontalizedMenu', $.proxy( this.hover, this ) )
					.children( 'a' ).bind( 'focus.horizontalizedMenu', function( e ) {
						!self.sub.is( ':visible' ) && self.hover( 'mouseenter' );

						$( document ).bind( 'focusin.horizontalizedMenu', function( e ) {
							if ( !$( ':focus', self.li ).length ) {
								$( document ).unbind( e );
								self.hover( 'mouseleave' );
							}
						} );
					});
			},
			// Method: Unbind events.
			unbind: function() {
				this.li.children( 'a' ).andSelf().add( document ).unbind( '.horizontalizedMenu' );
			}
		});

		// Get movement distance from left & top positions.
		this.moveDistance = {
			x: Math.abs( parseInt( this.sub.css( 'left' ) ) ),
			y: Math.abs( parseInt( this.sub.css( 'top' ) ) )
		};

		// Init!
		this.bind();
	};

	/* =Top Menu Logic.
	----------------------------------------------- */
	var HorizontalizedMenu = function( elem, settings ) {
		// Store instance.
		this.root = $( elem ).data( 'horizontalizedMenu', this );

		// Keep record of width (used for cmp on rezise).
		this.width = this.root.outerWidth();

		// Methods: Hide/Show pointers.
		$.extend( this, {
			hidePointers: function() { togglePointers( this.root ); },
			showPointers: function() { togglePointers( this.root ); }
		});

		// Method: Resized,
		// If window gets resized and menu-width has changed => Readjust each submenu.
		this.resized = function() {
			if ( this.width !== this.root.outerWidth() ) {
				this.width = this.root.outerWidth();
				this.root.find( dot( classes.sub ) ).each( function() {
					$( this ).data( 'horizontalizedMenu-sub' ).adjust();
				});
			}
		};
		$( window ).resize( $.proxy( this.resized, this ) );

		// Bind events on each submenu.
		this.root.find( dot( classes.sub ) ).each( $.proxy( function( i, elem ) {
			$( elem ).data( 'horizontalizedMenu-sub', new SubMenu( elem, this.root, settings ) );
		}, this ) );

		// Bind events for submenu-less <li>.
		this.root.find( 'li:not(:has(.menu-sub))' ).each( function() {
			$( this ).bind( 'mouseenter.horizontalizedMenu, mouseleave.horizontalizedMenu', $( this ), toggleLi )
				.children( 'a' ).bind( 'focus.horizontalizedMenu, blur.horizontalizedMenu', $( this ), toggleLi );
		});
	}

	// Public Interface.
	$.fn.horizontalizedMenu = function( settings ) {

		var args = arguments,
			settingsComputed = false,
			command = $.type( settings ) === 'string' ? settings : false;

		return this.each(function() {

			var instance = $( this ).data( 'horizontalizedMenu' );

			// First time? Init instance.
			if ( !instance ) {
				if ( !settingsComputed ) {
					settingsComputed = true;
					settings = $.extend( true, {}, $.horizontalizedMenu.settings, command ? {} : settings );
				}

				instance = new HorizontalizedMenu( this, settings );
			}

			if ( command ) {
				instance[command].apply( instance, args );
			}
		});
	};

	// Finds closest decendant with selector. Props to Esailija @ Stack Overflow.
	// http://stackoverflow.com/questions/8961770/similar-to-jquery-closest-but-traversing-descedents
	var matchesSelector = jQuery.find.matchesSelector;
	$.fn.closestDescendant = function( selector ) {
		var queue, open, cur, ret = [];
		this.each(function () {
			// Init queue with where we are.
			queue = [this];
			open = [];

            while ( queue.length ) {
				// Pull elem from top.
				cur = queue.shift();

				// Ensure element-type. (Could this ever occur??)
				if ( !cur || cur.nodeType !== 1 ) {
					continue;
				}

				// Add to results if we've a match!
				if ( matchesSelector( cur, selector ) ) {
					ret.push( cur );
					return;
				}

				// Push all children to a new waiting stack for this level.
				open.unshift.apply( open, $( cur ).children().toArray() );

				// This level is completed, goto next.
				if ( !queue.length ) {
					queue.unshift.apply( queue, open );
					open = [];
				}
			}
		});
		ret = ret.length > 1 ? $.unique( ret ) : ret;
		return this.pushStack( ret, "closestDescendant", selector );
    };
})(jQuery);
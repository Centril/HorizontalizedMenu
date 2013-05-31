<?php
function horiz_menu_item( $_text ) {
?>
<li><a href="#"><?php echo $_text; ?></a></li>
<?php
}

function horiz_menu_sub_open( $_text, $_depth = 0) {
?>
<li><a href="#"><?php echo $_text; ?></a>
	<div class="menu-sub level-<?php echo $_depth; ?>">
		<div class="menu-sub-box">
			<ul class="menu-sub-content">
<?php
}

function horiz_menu_sub_close() {
?>
			</ul>
		</div>
	</div>
</li>
<?php
}

function horiz_menu( $_id, $_classes = '', $_third = true ) {
?>
<ul id="<?php echo $_id; ?>" class="horizontalized-menu<?php echo empty( $_classes ) ? '' : ' ' . $_classes; ?>">
	<li class="current-menu-item current-menu-active"><a href="#">First</a></li>
	<?php horiz_menu_item( 'Second' ); ?>
	<?php horiz_menu_sub_open( 'Third' ); ?>
		<li><a href="#">Lorem Ipsum</a></li>
		<li><a href="#">Dolor Sit</a></li>
		<li><a href="#">Amet Consecteur</a></li>
		<?php horiz_menu_sub_close(); ?>
	<?php horiz_menu_sub_open( 'Fourth' ); ?>
		<?php horiz_menu_sub_open( 'Cupcake', 1 ); ?>
			<li><a href="#">Caramels dessert</a></li>
			<li><a href="#">cupcake candy</a></li>
			<li><a href="#">marshmallow</a></li>
			<?php horiz_menu_sub_close(); ?>
		<?php horiz_menu_sub_open( 'Cerry Icecream', 1 ); ?>
			<li><a href="#">sweet roll danish</a></li>
			<li><a href="#">apple pie</a></li>
			<?php if ( $_third ) { ?>
			<?php horiz_menu_sub_open( 'faworki', 2 ); ?>
				<li><a href="#">Caramels dessert</a></li>
				<li><a href="#">cupcake candy</a></li>
				<li><a href="#">marshmallow</a></li>
				<?php horiz_menu_sub_close(); ?>
			<?php } ?>
			<?php horiz_menu_sub_close(); ?>
		<?php horiz_menu_sub_close(); ?>
	<li><a href="#">Fifth</a></li>
	<li><a href="#">Sixth</a></li>
</ul>
<?php
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<!--[if IE 6]>
<html id="ie6" xmlns="http://www.w3.org/1999/xhtml" dir="ltr" xml:lang="en-US">
<![endif]-->
<!--[if IE 7]>
<html id="ie7" xmlns="http://www.w3.org/1999/xhtml" dir="ltr" xml:lang="en-US">
<![endif]-->
<!--[if IE 8]>
<html id="ie8" xmlns="http://www.w3.org/1999/xhtml" dir="ltr" xml:lang="en-US">
<![endif]-->
<!--[if !(IE 6) | !(IE 7) | !(IE 8)  ]><!-->
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" xml:lang="en-US">
<!--<![endif]-->
	<head>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>

		<link rel="stylesheet" href="http://yandex.st/highlightjs/6.2/styles/ir_black.min.css">
		<script type="text/javascript" src="http://yandex.st/highlightjs/6.2/highlight.min.js"></script>
		<script type="text/javascript">
			hljs.tabReplace = '<span class="indent">\t</span>';
			$(function() {
				$('pre code').each(function(i, e) {hljs.highlightBlock(e)});
			});
		</script>
		<script type="text/javascript">
			$(function() {
				$( '.default .horizontalized-menu' ).horizontalizedMenu();

				$( '.example-1 .horizontalized-menu' ).horizontalizedMenu({
					verticalMovement: false,
					widthFullDeep: true,
					pointerShow: false
				});

				$( '.example-2 .horizontalized-menu' ).horizontalizedMenu({
					fadeTime: 0,
					widthFullDeep: true,
					widthReduce: 'right'
				});

				$( '.example-3 .horizontalized-menu' ).horizontalizedMenu({
					easing: 'linear',
					widthFullDeep: true,
					widthReduce: 'none'
				});
			});
		</script>

		<link rel="stylesheet" href="../jquery.horizontalized-menu.css">
		<script type="text/javascript" src="../jquery.horizontalized-menu.dev.js"></script>

		<link rel="stylesheet" href="./style.css" type="text/css" />
	</head>
	<body>
		<div id="doc-area">
			<h1>HorizontalizedMenu Documentation</h1>
			<div id="summary" class="section">
				<p>HorizontalizedMenu is a <a href="http://www.jquery.com">jQuery plugin</a> licensed under <a href="http://www.gnu.org/licenses/gpl-3.0.html">GPL3</a> that provides the javascript for a truly horizontal sub-menu-system.
					And by truly we mean that the sub menus span horizontally across the whole root-width and not vertically.
					You can stack as many levels as you like. If you like, it can reduce the width of submenus for you with each level.</p>
				<p>It also supports positioning a pointer of the sub menu below it's parent &lt;li&gt;.
				You can control the time it takes to fade-in/out the sub-menus.</p>
				<p>The movement direction on fade-in/out of sub-menus are based on the angular direction of the mouse movement,
				thus sub-menus can move vertically (can be disabled) and horizontally.
				In order to never risk an infinite animation-loop due to the menu-movement in the direction of the mouse,
				any menu movement is always in the opposite direction of mouse movement.</p>
				<p>HorizontalizedMenu will also normalize keyboard usage for you so that dropdowns don't slideup when child-menus get focus.
					As well as adding a special class (default: hover) when a &lt;li&gt; has focus for making your design work go smoother.</p>
				<div class="default">
					<div class="test-area"><?php horiz_menu( 'hz-menu-1', '', false ); ?></div>
					<p class="test-info">Here is an inverted version of the above.</p>
					<div class="test-area"><?php horiz_menu( 'hz-menu-2', 'inverted-colors', false ); ?></div>
					<p class="test-info">We take it one step further and invert the sub-menus also.</p>
					<div class="test-area"><?php horiz_menu( 'hz-menu-3', 'inverted-colors inverted-dropbox', false ); ?></div>
				</div>
			</div>

			<div id="how-to" class="section">
				<h2>jQuery Plugin Usage</h2>
				<p>To use the plugin you have to include the following in your page:</p>
				<ul>
					<li>jQuery (preferably the latest version)</li>
					<li>HorizontalizedMenu script</li>
					<li>HorizontalizedMenu CSS</li>
				</ul>
				<p>You also need to add some body HTML:</p>
				<p><strong>Note: .menu-sub-box is optional</strong> and is provided only for an aesthetic purpose<br/>
				-it is never referenced within the plugin which doesn't rely on it.</p>
				<p><strong>Neither is .menu-sub-pointer or .menu-sub-pointer-border required</strong>, but is provided also for aesthetics.<br/>
				The plugin however does reference it in order to adjust its positioning. You can disable this by setting <a href="#pointerAdjust">pointerAdjust</a> to false.<br/>
				If you don't want to save space or don't want messy HTML, just set <a href="#pointerMake">pointerMake</a> to true and the pointer will be made for you.
				</p>
				<pre><code class="language-html"><?php
$html = <<<HTML
<!-- Usually in the <head> section -->
<link rel="stylesheet" href="./jquery.horizontalized-menu.css" type="text/css" media="screen" />
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
<script src="./jquery.horizontalized-menu.js" type="text/javascript"></script>

<!-- Then somewhere in the <body> section -->
<ul id="hz-menu-1" class="horizontalized-menu">
	<li class="current-menu-item current-menu-active"><a href="#">First</a></li>
	<li><a href="#">First</a></li>
	<li><a href="#">Second</a></li>
	<li><a href="#">Third</a>
		<div class="menu-sub level-0">
			<div class="menu-sub-box">
				<div class="menu-sub-pointer-border"></div>
				<div class="menu-sub-pointer"></div>
				<ul class="menu-sub-content">
					<li>
						<a href="#">Cupcake</a>
						<div class="menu-sub level-1">
							<div class="menu-sub-box">
								<div class="menu-sub-pointer-border"></div>
								<div class="menu-sub-pointer"></div>
								<ul class="menu-sub-content">
									<li><a href="#">Caramels dessert</a></li>
								</ul>
							</div>
						</div>
					</li>
					<li>
						<a href="#">Cerry-icecream</a>
						<div class="menu-sub level-1">
							<div class="menu-sub-box">
								<div class="menu-sub-pointer-border"></div>
								<div class="menu-sub-pointer"></div>
								<ul class="menu-sub-content">
									<li><a href="#">sweet roll danish</a></li>
								</ul>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</li>
</ul>
HTML;

echo htmlentities( $html );
				?></code></pre>
			</div>

			<div id="examples" class="section">
				<h2>Settings explained</h2>
				<p>HorizontalizedMenu has a couple of settings to change depending on your needs. They are brielfly explained below.</p>
				<pre><code class="language-javascript">
$( '.horizontalized-menu' ).horizontalizedMenu({
	// Time it takes to fade in/out a sub-menu.
	fadeTime: 300,
	// What easing to use for fade in/out animation.
	easing: 'swing',
	// Allow vertical movement animation?
	verticalMovement: true,
	// Show/Hide pointer?
	pointerShow: true,
	<a name="pointerAdjust"></a>// Adjust pointer positioning?
	pointerAdjust: true,
	<a name="pointerMake"></a>// Make a pointer if non-existent?
	pointerMake: true,
	// Use full width on deeper levels than the first sub-menu?
	widthFullDeep: false,
	// Reduce width with each level?
	// Possible values: 'left', 'right', 'none', 'center'.
	// When value is left or right: the margin-left/right value of the
	// outmost child of .sub-menu [eg: .menu-sub-box] is used for reducement.
	widthReduce: 'left',
	// use outerWidth() / width() of parent .menu-sub-content of a .menu-sub? 
	outerWidth: true
});
				</code></pre>

				<div class="sub-section example-1">
					<h3>Example 1</h3>
					<h4><strong>No vertical movement, widthFullDeep (widthReduce = left), and hide pointer</strong></h4>
					<pre><code class="language-javascript">
$( '.example-1 .horizontalized-menu' ).horizontalizedMenu({
	verticalMovement: false,
	widthFullDeep: true,
	pointerShow: false,
});
					</code></pre>
					<div class="test-area"><?php horiz_menu( '', 'inverted-colors inverted-dropbox' ); ?></div>
				</div>

				<div class="sub-section example-2">
					<h3>Example 2</h3>
					<h4><strong>fadeTime = 0, widthFullDeep (widthReduce = right)</strong></h4>
					<pre><code class="language-javascript">
$( '.example-2 .horizontalized-menu' ).horizontalizedMenu({
	fadeTime: 0,
	widthFullDeep: true,
	widthReduce: 'right'
});
					</code></pre>
					<div class="test-area"><?php horiz_menu( '', 'inverted-colors inverted-dropbox' ); ?></div>
				</div>

				<div class="sub-section example-3">
					<h3>Example 3</h3>
					<h4><strong>easing: linear, widthFullDeep (widthReduce = none)</strong></h4>
					<pre><code class="language-javascript">
$( '.example-3 .horizontalized-menu' ).horizontalizedMenu({
	easing: 'linear',
	widthFullDeep: true,
	widthReduce: 'none',
});
					</code></pre>
					<div class="test-area"><?php horiz_menu( '', 'inverted-colors inverted-dropbox' ); ?></div>
				</div>
			</div>

			<div id="contact" class="section">
				<h2>More info</h2>
				<p>I hope that this plugin makes your life easier and your website more exiting. Atleast it was developing it.
				Feel free to make any changes to the code - a development as well as a minified
				(<a href="http://closure-compiler.appspot.com/home">Google Closure Compiler</a>) version for production is supplied.
				For further questions you may contact me at <a href="mailto:twingoow@gmail.com">twingoow@gmail.com</a></p>
			</div>
		</div>
	</body>
</html>
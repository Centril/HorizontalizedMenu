HorizontalizedMenu
==================

HorizontalizedMenu is a jQuery plugin that provides the javascript for a truly horizontal access-menu.
And by truly we mean that the sub menus span horizontally across the whole root-width and not vertically.

It also supports positioning a pointer of the sub menu below it's parent <li>.
You can control the time it takes to fade-in/out the sub-menus.

The movement direction on fade-in/out of sub-menus are based on the angular direction of the mouse movement,
thus sub-menus can move vertically (can be disabled) and horizontally.
In order to never risk an infinite animation-loop due to the menu-movement in the direction of the mouse,
any menu movement is always in the opposite direction of mouse movement.

Current version: 0.2a
License GPL 3.0 http://www.gnu.org/licenses/gpl-3.0.html

/*
 * DotNetLogue cleaner
 * Copyright 2005 Jb Evain  <jbevain@gmail.com>
 * This script is licensed under the GNU GPL 2.
 * See: http://www.gnu.org/copyleft/gpl.html
 */

// ==UserScript==
// @name          DotNetLogue cleaner
// @namespace     http://evain.net
// @description	  Read only the feeds you're interested in
// @include       http://www.labo-dotnet.com/dotnetlogue*
// ==/UserScript==

(function () {

	var black_list = ["http://www.c2i.fr"];
	
	function isBlackListed (entry) {
		var href = entry.previousSibling.previousSibling.firstChild.getAttribute ("href");
		for (var i = 0; i < black_list.length; i++)
			if (href.indexOf (black_list [i]) > -1)
				return true;
		return false;
	}

	var divs = document.getElementsByTagName ("div");
	for (var i = 0; i < divs.length; i++) {
		var entry = divs [i];

		if (entry.className == "blogentry" && isBlackListed (entry)) {
			entry.previousSibling.previousSibling.style.display =
				entry.style.display = "none";
		}
	}
}) ();

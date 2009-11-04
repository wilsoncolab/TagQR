/* TagQR Button
/* http://tagqr.com
*/

(function(){

window.TagQR = {
	// Your Bit.ly Username
	bitly_user: "tagqr",

	// Your Bit.ly API Key
	// Found here: http://bit.ly/account
	bitly_key: "R_7aa1adc26c0d902799b929d4cd8091be",

	// The text to replace the links with
	link_text: "TagQR",

	// What # to show (Use "clicks" for # of clicks or "none" for nothing)
	count_type: "clicks",

	// Style information
	styling: "a.tagqr { font: 12px Helvetica,Arial; color: #000; text-decoration: none; border: 0px; padding: 2px; }" +
		"a.tagqr span { background: #009B95; border: 1px solid #006561; color: #fff; -moz-border-radius: 3px; -webkit-border-radius: 3px; border-radius: 3px; margin-left: 2px; padding: 3px 4px 2px; }" +
		"a.vert { display: block; text-align: center; font-size: 16px; float: left; margin: 4px; }" +
		"a.tagqr strong.vert { display: block; margin-bottom: 4px; background: #F5F5F5; border: 1px solid #EEE; -moz-border-radius: 3px; -webkit-border-radius: 3px; border-radius: 3px; padding: 3px; }" +
    "a.tagqr span.vert { display: block; font-size: 12px; margin-left: 0px; }"
    
};

//////////////// No Need to Configure Below Here ////////////////

var loadCount = 1;

// Asynchronously load the Bit.ly JavaScript API
// If it hasn't been loaded already
if ( typeof BitlyClient === "undefined" ) {
	var head = document.getElementsByTagName("head")[0] ||
		document.documentElement;
	var script = document.createElement("script");
	script.src = "http://bit.ly/javascript-api.js?version=latest&login=" +
		TagQR.bitly_user + "&apiKey=" + TagQR.bitly_key;
	script.charSet = "utf-8";
	head.appendChild( script );

	var check = setInterval(function(){
		if ( typeof BitlyCB !== "undefined" ) {
			clearInterval( check );
			head.removeChild( script );
			loaded();
		}
	}, 10);

	loadCount = 0;
}

if ( document.addEventListener ) {
	document.addEventListener("DOMContentLoaded", loaded, false);

} else if ( window.attachEvent ) {
	window.attachEvent("onload", loaded);
}

function loaded(){
	// Need to wait for doc ready and js ready
	if ( ++loadCount < 2 ) {
		return;
	}

	var elems = [], urlElem = {}, hashURL = {};

	BitlyCB.shortenResponse = function(data) {
		for ( var url in data.results ) {
			var hash = data.results[url].userHash;
			hashURL[hash] = url;

			var elems = urlElem[ url ];

			for ( var i = 0; i < elems.length; i++ ) {
				elems[i].href += hash;
			}

			if ( TagQR.count_type === "clicks" ) {
				BitlyClient.stats(hash, 'BitlyCB.statsResponse');
			}
		}
	};

	BitlyCB.statsResponse = function(data) {
		var clicks = data.results.clicks, hash = data.results.userHash;
		var url = hashURL[ hash ], elems = urlElem[ url ];

		if ( clicks > 0 ) {
			for ( var i = 0; i < elems.length; i++ ) {
				var strong = document.createElement("strong");
				strong.appendChild( document.createTextNode( clicks + " " ) );
				elems[i].insertBefore(strong, elems[i].firstChild);

				if ( /(^|\s)vert(\s|$)/.test( elems[i].className ) ) {
					elems[i].firstChild.className = elems[i].lastChild.className = "vert";
				}
			}
		}

		hashURL[ hash ] = urlElem[ url ] = null;
	};

	if ( document.getElementsByClassName ) {
		elems = document.getElementsByClassName("tagqr");
	} else {
		var tmp = document.getElementsByTagName("a");
		for ( var i = 0; i < tmp.length; i++ ) {
			if ( /(^|\s)tagqr(\s|$)/.test( tmp[i].className ) ) {
				elems.push( tmp[i] );
			}
		}
	}

	if ( elems.length && TagQR.styling ) {
		var style = document.createElement("style");
		
		style.type = "text/css";

		try {
			style.appendChild( document.createTextNode( TagQR.styling ) );
		} catch (e) {
			if ( style.styleSheet ) {
				style.styleSheet.cssText = TagQR.styling;
			}
		}
		var head = document.getElementsByTagName("head")[0];
		if( head == null ) {
			document.body.appendChild( style );
		} else {
			head.appendChild( style );
		}
	}

	for ( var i = 0; i < elems.length; i++ ) {
		var elem = elems[i];

		if ( /(^|\s)self(\s|$)/.test( elem.className ) ) {
			elem.href = window.location;
			elem.title = document.title;
		}

		var origText = elem.title || elem.textContent || elem.innerText,
			href = elem.href;

		elem.innerHTML = "<span>" + TagQR.link_text + "</span>";
		elem.title = "";
		elem.href = "http://tagqr.com?url=" +
			("http://bit.ly/");

		if ( urlElem[ href ] ) {
			urlElem[ href ].push( elem );
		} else {
			urlElem[ href ] = [ elem ];
			BitlyClient.shorten(href, 'BitlyCB.shortenResponse');
		}
	}

}

})();

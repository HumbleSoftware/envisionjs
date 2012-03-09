envision:
	smoosh make/build.json
	cat lib/bonzo/bonzo.min.js >> envision.js
	cat lib/bonzo/bonzo.min.js >> envision.min.js

demo:
	smoosh make/build.json
	rm -rf build
	mkdir build
	cp lib/flotr2/flotr2.min.js build/
	cp lib/flotr2/js/plugins/handles.js build/
	cp envision.min.js build/
	cp demos/index.html build/
	cp demos/demos.css build/
	cp demos/ajax.html build/
	cp demos/ajax.js build/
	cp demos/finance.html build/
	cp demos/finance.css build/
	cp demos/finance.js build/
	cp demos/million.html build/
	cp demos/million.js build/
	cp demos/weierstrass.html build/
	cp demos/weierstrass.js build/
	cp demos/includes.build.js build/includes.js
	cp demos/ajax-loader.gif build/
	cp demos/yepnope.js build/
	cp -R demos/data build/
	cp -R lib/ build/

test:
	jasmine-headless-webkit -j spec/jasmine.yml -c

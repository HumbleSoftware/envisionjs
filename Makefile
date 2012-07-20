envision:
	rm -rf build
	mkdir build
	smoosh make/build.json
	# envision.js
	cat lib/flotr2/lib/underscore.js > envision.js
	cat lib/flotr2/lib/bean.js >> envision.js
	cat build/flotr.js >> envision.js
	cat lib/bonzo/bonzo.min.js >> envision.js
	echo ";" >> envision.js
	cat build/envision.js >> envision.js
	# envision.min.js
	cat lib/flotr2/lib/underscore-min.js > envision.min.js
	cat lib/flotr2/lib/bean-min.js >> envision.min.js
	echo ";" >> envision.min.js
	cat build/flotr.min.js >> envision.min.js
	echo ";" >> envision.min.js
	cat lib/bonzo/bonzo.min.js >> envision.min.js
	echo ";" >> envision.min.js
	cat build/envision.min.js >> envision.min.js
	echo ";" >> envision.js

amd: envision
	mkdir build/amd
	cat make/pre.js > build/amd/envision.js
	cat build/envision.js >> build/amd/envision.js
	cat make/post.js >> build/amd/envision.js
	cat lib/flotr2/js/amd/pre.js > build/amd/flotr2.js
	cat build/flotr.js >> build/amd/flotr2.js
	cat lib/flotr2/js/amd/post.js >> build/amd/flotr2.js

demo: envision
	mkdir build/demos
	cp lib/flotr2/flotr2.min.js build/demos
	cp lib/flotr2/js/plugins/handles.js build/demos
	cp envision.min.js build/demos
	cp demos/index.html build/demos
	cp demos/demos.css build/demos
	cp demos/ajax.html build/demos
	cp demos/ajax.js build/demos
	cp demos/finance.html build/demos
	cp demos/finance.js build/demos
	cp demos/fractal.html build/demos
	cp demos/fractal.js build/demos
	cp demos/fractal.css build/demos
	cp demos/million.html build/demos
	cp demos/million.js build/demos
	cp demos/weierstrass.html build/demos
	cp demos/weierstrass.js build/demos
	cp demos/includes.build.js build/demos/includes.js
	cp demos/ajax-loader.gif build/demos
	cp demos/yepnope.js build/demos
	cp -R demos/data build/demos
	cp -R lib/ build/demos
	cp -R css/ build/

test:
	jasmine-headless-webkit -j spec/jasmine.yml -c

readme: api-doc
	cat markdown/head.md > README.md
	cat markdown/api.md >> README.md
	cat markdown/footer.md >> README.md

api-doc:
	jsdoc -t templates/markdown js/ > markdown/api.md

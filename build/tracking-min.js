/**
 * tracking.js - Augmented Reality JavaScript Framework.
 * @author Eduardo Lundgren <edu@rdo.io>
 * @version v1.0.0-alpha
 * @link http://trackingjs.com
 * @license BSD
 */
!function(t){t.tracking=t.tracking||{},tracking.forEach=function(t,r,a){var n;if(Array.isArray(t))t.forEach(function(){r.apply(a,arguments)});else for(n in t)t.hasOwnProperty(n)&&r.call(a,t[n],n,t);return t},tracking.inherits=function(t,r){function a(){}a.prototype=r.prototype,t.superClass_=r.prototype,t.prototype=new a,t.prototype.constructor=t,t.base=function(t,a){var n=Array.prototype.slice.call(arguments,2);return r.prototype[a].apply(t,n)}},tracking.initUserMedia_=function(r,a){t.navigator.getUserMedia({video:!0,audio:a.audio},function(a){try{r.src=t.URL.createObjectURL(a)}catch(n){r.src=a}},function(){throw Error("Cannot capture user camera.")})},tracking.isNode=function(t){return t.nodeType||this.isWindow(t)},tracking.isWindow=function(t){return!!(t&&t.alert&&t.document)},tracking.merge=function(t,r){for(var a in r)t[a]=r[a];return t},tracking.one=function(t,r){return this.isNode(t)?t:(r||document).querySelector(t)},tracking.track=function(t,r,a){if(t=tracking.one(t),!t)throw new Error("Element not found, try a different element or selector.");if(!r)throw new Error("Tracker not specified, try `tracking.track(element, new tracking.FaceTracker())`.");switch(t.nodeName.toLowerCase()){case"canvas":return this.trackCanvas_(t,r,a);case"img":return this.trackImg_(t,r,a);case"video":return a&&a.camera&&this.initUserMedia_(t,a),this.trackVideo_(t,r,a);default:throw new Error("Element not supported, try in a canvas, img, or video.")}},tracking.trackCanvas_=function(t,r){var a=t.width,n=t.height,e=t.getContext("2d"),i=e.getImageData(0,0,a,n);r.track(i.data,a,n)},tracking.trackImg_=function(t,r){var a=t.width,n=t.height,e=document.createElement("canvas");e.width=a,e.height=n,tracking.Canvas.loadImage(e,t.src,0,0,a,n,function(){tracking.trackCanvas_(e,r)})},tracking.trackVideo_=function(r,a){var n,e,i=document.createElement("canvas"),o=i.getContext("2d"),c=function(){n=r.offsetWidth,e=r.offsetHeight,i.width=n,i.height=e};c(),r.addEventListener("resize",c);var s=function(){t.requestAnimationFrame(function(){if(r.readyState===r.HAVE_ENOUGH_DATA){try{o.drawImage(r,0,0,n,e)}catch(t){}tracking.trackCanvas_(i,a)}s()})};s()},t.URL||(t.URL=t.URL||t.webkitURL||t.msURL||t.oURL),navigator.getUserMedia||(navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia)}(window),function(){tracking.Brief={},tracking.Brief.N=128,tracking.Brief.randomOffsets_={},tracking.Brief.getDescriptors=function(t,r,a){for(var n=new Int32Array(a.length*(this.N>>5)),e=0,i=this.getRandomOffsets_(r),o=0,c=0;c<a.length;c+=2)for(var s=r*a[c+1]+a[c],g=0,h=this.N;h>g;g++)t[i[g+g]+s]<t[i[g+g+1]+s]&&(e|=1<<(31&g)),g+1&31||(n[o++]=e,e=0);return n},tracking.Brief.match=function(t,r,a,n){for(var e=t.length>>1,i=a.length>>1,o=new Int32Array(e),c=0;e>c;c++){for(var s=1/0,g=0,h=0;i>h;h++){for(var k=0,u=0,l=this.N>>5;l>u;u++)k+=tracking.Math.hammingWeight(r[c*l+u]^n[h*l+u]);s>k&&(s=k,g=h)}o[c]=g}return o},tracking.Brief.getRandomOffsets_=function(t){if(this.randomOffsets_[t])return this.randomOffsets_[t];for(var r=new Int32Array(2*this.N),a=0,n=0;n<this.N;n++)r[a++]=tracking.Math.uniformRandom(-15,16)*t+tracking.Math.uniformRandom(-15,16),r[a++]=tracking.Math.uniformRandom(-15,16)*t+tracking.Math.uniformRandom(-15,16);return this.randomOffsets_[t]=r,this.randomOffsets_[t]}}(),function(){tracking.Canvas={},tracking.Canvas.loadImage=function(t,r,a,n,e,i,o){var c=this,s=new window.Image;s.onload=function(){var r=t.getContext("2d");t.width=e,t.height=i,r.drawImage(s,a,n,e,i),o&&o.call(c),s=null},s.src=r}}(),function(){tracking.EPnP={},tracking.EPnP.solve=function(){}}(),function(){tracking.ViolaJones={},tracking.ViolaJones.REGIONS_OVERLAP=.5,tracking.ViolaJones.detect=function(t,r,a,n,e,i,o,c){var s,g=0,h=[],k=new Int32Array(r*a),u=new Int32Array(r*a),l=new Int32Array(r*a);o>0&&(s=new Int32Array(r*a)),tracking.Image.computeIntegralImage(t,r,a,k,u,l,s);for(var f=c[0],v=c[1],d=n*e,p=d*f|0,y=d*v|0;r>p&&a>y;){for(var m=d*i+.5|0,A=0;a-y>A;A+=m)for(var T=0;r-p>T;T+=m)o>0&&this.isTriviallyExcluded(o,s,A,T,r,p,y)||this.evalStages_(c,k,u,l,A,T,r,p,y,d)&&(h[g++]={width:p,height:y,x:T,y:A});d*=e,p=d*f|0,y=d*v|0}return this.mergeRectangles_(h)},tracking.ViolaJones.isTriviallyExcluded=function(t,r,a,n,e,i,o){var c=a*e+n,s=c+i,g=c+o*e,h=g+i,k=(r[c]-r[s]-r[g]+r[h])/(i*o*255);return t>k?!0:!1},tracking.ViolaJones.evalStages_=function(t,r,a,n,e,i,o,c,s,g){var h=1/(c*s),k=e*o+i,u=k+c,l=k+s*o,f=l+c,v=(r[k]-r[u]-r[l]+r[f])*h,d=(a[k]-a[u]-a[l]+a[f])*h-v*v,p=1;d>0&&(p=Math.sqrt(d));for(var y=t.length,m=2;y>m;){for(var A=0,T=t[m++],w=t[m++];w--;){for(var C=0,R=t[m++],_=t[m++],M=0;_>M;M++){var S,I,E,F,x=i+t[m++]*g+.5|0,H=e+t[m++]*g+.5|0,D=t[m++]*g+.5|0,O=t[m++]*g+.5|0,N=t[m++];R?(S=x-O+D+(H+D+O-1)*o,I=x+(H-1)*o,E=x-O+(H+O-1)*o,F=x+D+(H+D-1)*o,C+=(n[S]+n[I]-n[E]-n[F])*N):(S=H*o+x,I=S+D,E=S+O*o,F=E+D,C+=(r[S]-r[I]-r[E]+r[F])*N)}var U=t[m++],V=t[m++],b=t[m++];A+=U*p>C*h?V:b}if(T>A)return!1}return!0},tracking.ViolaJones.mergeRectangles_=function(t){for(var r=new tracking.DisjointSet(t.length),a=0;a<t.length;a++)for(var n=t[a],e=0;e<t.length;e++){var i=t[e];if(tracking.Math.intersectRect(n.x,n.y,n.x+n.width,n.y+n.height,i.x,i.y,i.x+i.width,i.y+i.height)){var o=Math.max(n.x,i.x),c=Math.max(n.y,i.y),s=Math.min(n.x+n.width,i.x+i.width),g=Math.min(n.y+n.height,i.y+i.height),h=(o-s)*(c-g),k=n.width*n.height,u=i.width*i.height;h/(k*(k/u))>=this.REGIONS_OVERLAP&&h/(u*(k/u))>=this.REGIONS_OVERLAP&&r.union(a,e)}}for(var l={},f=0;f<r.length;f++){var v=r.find(f);l[v]?(l[v].total++,l[v].width+=t[f].width,l[v].height+=t[f].height,l[v].x+=t[f].x,l[v].y+=t[f].y):l[v]={total:1,width:t[f].width,height:t[f].height,x:t[f].x,y:t[f].y}}var d=[];return Object.keys(l).forEach(function(t){var r=l[t];d.push({total:r.total,width:r.width/r.total+.5|0,height:r.height/r.total+.5|0,x:r.x/r.total+.5|0,y:r.y/r.total+.5|0})}),d}}(),function(){tracking.Fast={},tracking.Fast.FAST_THRESHOLD=40,tracking.Fast.circles_={},tracking.Fast.findCorners=function(t,r,a){for(var n=this.getCircleOffsets_(r),e=new Int32Array(16),i=[],o=3;a-3>o;o++)for(var c=3;r-3>c;c++){for(var s=o*r+c,g=t[s],h=0;16>h;h++)e[h]=t[s+n[h]];this.isCorner(g,e,this.FAST_THRESHOLD)&&(i.push(c,o),c+=3)}return i},tracking.Fast.isBrighter=function(t,r,a){return t-r>a},tracking.Fast.isCorner=function(t,r,a){if(this.isTriviallyExcluded(r,t,a))return!1;for(var n=0;16>n;n++){for(var e=!0,i=!0,o=0;9>o;o++){var c=r[n+o&15];if(!this.isBrighter(t,c,a)&&(i=!1,e===!1))break;if(!this.isDarker(t,c,a)&&(e=!1,i===!1))break}if(i||e)return!0}return!1},tracking.Fast.isDarker=function(t,r,a){return r-t>a},tracking.Fast.isTriviallyExcluded=function(t,r,a){var n=0,e=t[8],i=t[12],o=t[4],c=t[0];return this.isBrighter(c,r,a)&&n++,this.isBrighter(o,r,a)&&n++,this.isBrighter(e,r,a)&&n++,this.isBrighter(i,r,a)&&n++,3>n&&(n=0,this.isDarker(c,r,a)&&n++,this.isDarker(o,r,a)&&n++,this.isDarker(e,r,a)&&n++,this.isDarker(i,r,a)&&n++,3>n)?!0:!1},tracking.Fast.getCircleOffsets_=function(t){if(this.circles_[t])return this.circles_[t];var r=new Int32Array(16);return r[0]=-t-t-t,r[1]=r[0]+1,r[2]=r[1]+t+1,r[3]=r[2]+t+1,r[4]=r[3]+t,r[5]=r[4]+t,r[6]=r[5]+t-1,r[7]=r[6]+t-1,r[8]=r[7]-1,r[9]=r[8]-1,r[10]=r[9]-t-1,r[11]=r[10]-t-1,r[12]=r[11]-t,r[13]=r[12]-t,r[14]=r[13]-t+1,r[15]=r[14]-t+1,this.circles_[t]=r,r}}(),function(){tracking.Image={},tracking.Image.computeIntegralImage=function(t,r,a,n,e,i,o){if(arguments.length<4)throw new Error("You should specify at least one output array in the order: sum, square, tilted, sobel.");var c;o&&(c=tracking.Image.sobel(t,r,a));for(var s=0;a>s;s++)for(var g=0;r>g;g++){var h=s*r*4+4*g,k=~~(.299*t[h]+.587*t[h+1]+.114*t[h+2]);if(n&&this.computePixelValueSAT_(n,r,s,g,k),e&&this.computePixelValueSAT_(e,r,s,g,k*k),i){var u=h-4*r,l=~~(.299*t[u]+.587*t[u+1]+.114*t[u+2]);this.computePixelValueRSAT_(i,r,s,g,k,l||0)}o&&this.computePixelValueSAT_(o,r,s,g,c[h])}},tracking.Image.computePixelValueRSAT_=function(t,r,a,n,e,i){var o=a*r+n;t[o]=(t[o-r-1]||0)+(t[o-r+1]||0)-(t[o-r-r]||0)+e+i},tracking.Image.computePixelValueSAT_=function(t,r,a,n,e){var i=a*r+n;t[i]=(t[i-r]||0)+(t[i-1]||0)+e-(t[i-r-1]||0)},tracking.Image.grayscale=function(t,r,a){for(var n=new Uint8ClampedArray(r*a*4),e=0,i=0,o=0;a>o;o++)for(var c=0;r>c;c++){var s=.299*t[i]+.587*t[i+1]+.114*t[i+2];n[e++]=s,n[e++]=s,n[e++]=s,n[e++]=t[i+3],i+=4}return n},tracking.Image.horizontalConvolve=function(t,r,a,n,e){for(var i=n.length,o=Math.floor(i/2),c=new Float32Array(r*a*4),s=e?1:0,g=0;a>g;g++)for(var h=0;r>h;h++){for(var k=g,u=h,l=4*(g*r+h),f=0,v=0,d=0,p=0,y=0;i>y;y++){var m=k,A=Math.min(r-1,Math.max(0,u+y-o)),T=4*(m*r+A),w=n[y];f+=t[T]*w,v+=t[T+1]*w,d+=t[T+2]*w,p+=t[T+3]*w}c[l]=f,c[l+1]=v,c[l+2]=d,c[l+3]=p+s*(255-p)}return c},tracking.Image.verticalConvolve=function(t,r,a,n,e){for(var i=n.length,o=Math.floor(i/2),c=new Float32Array(r*a*4),s=e?1:0,g=0;a>g;g++)for(var h=0;r>h;h++){for(var k=g,u=h,l=4*(g*r+h),f=0,v=0,d=0,p=0,y=0;i>y;y++){var m=Math.min(a-1,Math.max(0,k+y-o)),A=u,T=4*(m*r+A),w=n[y];f+=t[T]*w,v+=t[T+1]*w,d+=t[T+2]*w,p+=t[T+3]*w}c[l]=f,c[l+1]=v,c[l+2]=d,c[l+3]=p+s*(255-p)}return c},tracking.Image.separableConvolve=function(t,r,a,n,e,i){var o=this.verticalConvolve(t,r,a,e,i);return this.horizontalConvolve(o,r,a,n,i)},tracking.Image.sobel=function(t,r,a){t=this.grayscale(t,r,a);for(var n=new Float32Array(r*a*4),e=new Float32Array([-1,0,1]),i=new Float32Array([1,2,1]),o=this.separableConvolve(t,r,a,e,i),c=this.separableConvolve(t,r,a,i,e),s=0;s<n.length;s+=4){var g=o[s],h=c[s],k=Math.sqrt(h*h+g*g);n[s]=k,n[s+1]=k,n[s+2]=k,n[s+3]=255}return n}}(),function(){tracking.Math={},tracking.Math.distance=function(t,r,a,n){var e=a-t,i=n-r;return Math.sqrt(e*e+i*i)},tracking.Math.hammingWeight=function(t){return t-=t>>1&1431655765,t=(858993459&t)+(t>>2&858993459),16843009*(t+(t>>4)&252645135)>>24},tracking.Math.uniformRandom=function(t,r){return t+Math.random()*(r-t)},tracking.Math.intersectRect=function(t,r,a,n,e,i,o,c){return!(e>a||t>o||i>n||r>c)}}(),function(){tracking.Matrix={},tracking.Matrix.forEach=function(t,r,a,n,e){e=e||1;for(var i=0;a>i;i+=e)for(var o=0;r>o;o+=e){var c=i*r*4+4*o;n.call(this,t[c],t[c+1],t[c+2],t[c+3],c,i,o)}}}(),function(){tracking.DisjointSet=function(t){if(void 0===t)throw new Error("DisjointSet length not specified.");this.length=t,this.parent=new Uint32Array(t);for(var r=0;t>r;r++)this.parent[r]=r},tracking.DisjointSet.prototype.length=null,tracking.DisjointSet.prototype.parent=null,tracking.DisjointSet.prototype.find=function(t){return this.parent[t]===t?t:this.parent[t]=this.find(this.parent[t])},tracking.DisjointSet.prototype.union=function(t,r){var a=this.find(t),n=this.find(r);this.parent[a]=n}}(),function(){tracking.Tracker=function(){},tracking.Tracker.prototype.onFound=function(){},tracking.Tracker.prototype.onNotFound=function(){},tracking.Tracker.prototype.track=function(){}}(),function(){tracking.HAARTracker=function(){tracking.HAARTracker.base(this,"constructor")},tracking.inherits(tracking.HAARTracker,tracking.Tracker),tracking.HAARTracker.data={},tracking.HAARTracker.prototype.data=null,tracking.HAARTracker.prototype.edgesDensity=.2,tracking.HAARTracker.prototype.initialScale=1,tracking.HAARTracker.prototype.scaleFactor=1.25,tracking.HAARTracker.prototype.stepSize=1.5,tracking.HAARTracker.prototype.getData=function(){return this.data},tracking.HAARTracker.prototype.getEdgesDensity=function(){return this.edgesDensity},tracking.HAARTracker.prototype.getInitialScale=function(){return this.initialScale},tracking.HAARTracker.prototype.getScaleFactor=function(){return this.scaleFactor},tracking.HAARTracker.prototype.getStepSize=function(){return this.stepSize},tracking.HAARTracker.prototype.track=function(t,r,a){var n=this.getData();if(!n)throw new Error("HAAR cascade data not set.");var e=tracking.ViolaJones.detect(t,r,a,this.getInitialScale(),this.getScaleFactor(),this.getStepSize(),this.getEdgesDensity(),n);e.length?this.onFound&&this.onFound.call(this,e):this.onNotFound&&this.onNotFound.call(this,e)},tracking.HAARTracker.prototype.setData=function(t){this.data=t},tracking.HAARTracker.prototype.setEdgesDensity=function(t){this.edgesDensity=t},tracking.HAARTracker.prototype.setInitialScale=function(t){this.initialScale=t},tracking.HAARTracker.prototype.setScaleFactor=function(t){this.scaleFactor=t},tracking.HAARTracker.prototype.setStepSize=function(t){this.stepSize=t}}(),function(){tracking.ColorTracker=function(){tracking.ColorTracker.base(this,"constructor"),this.setColors(["magenta"])},tracking.inherits(tracking.ColorTracker,tracking.Tracker),tracking.ColorTracker.MIN_PIXELS=30,tracking.ColorTracker.knownColors_={},tracking.ColorTracker.registerColor=function(t,r){tracking.ColorTracker.knownColors_[t]=r},tracking.ColorTracker.getColor=function(t){return tracking.ColorTracker.knownColors_[t]},tracking.ColorTracker.prototype.colors=null,tracking.ColorTracker.prototype.calculateCentralCoordinate_=function(t,r){for(var a=0,n=0,e=-1,i=-1,o=1/0,c=1/0,s=0,g=0;r>g;g+=2){var h=t[g],k=t[g+1];h>-1&&k>-1&&(a+=h,n+=k,s++,o>h&&(o=h),h>e&&(e=h),c>k&&(c=k),k>i&&(i=k))}return 0===s?null:{x:a/s,y:n/s,z:60-(e-o+(i-c))/2}},tracking.ColorTracker.prototype.flagOutliers_=function(t,r){for(var a=0;r>a;a+=2){for(var n=0,e=2;r>e;e+=2)n+=tracking.Math.distance(t[a],t[a+1],t[e],t[e+1]);n/r>=tracking.ColorTracker.MIN_PIXELS&&(t[a]=-1,t[a+1]=-1,r[a]--)}},tracking.ColorTracker.prototype.getColors=function(){return this.colors},tracking.ColorTracker.prototype.setColors=function(t){this.colors=t},tracking.ColorTracker.prototype.track=function(t,r,a){var n,e,i,o=this,c=this.getColors(),s=[],g=[],h=[];for(tracking.Matrix.forEach(t,r,a,function(t,r,a,g,k,u,l){for(i=-1;n=c[++i];)s[i]||(h[i]=0,s[i]=[]),e=tracking.ColorTracker.knownColors_[n],e&&e.call(o,t,r,a,g,k,u,l)&&(h[i]+=2,s[i].push(l,u))}),i=-1;n=c[++i];)if(!(h[i]<tracking.ColorTracker.MIN_PIXELS)){o.flagOutliers_(s[i],h[i]);var k=o.calculateCentralCoordinate_(s[i],h[i]);k&&(k.color=c[i],k.pixels=s[i],g.push(k))}g.length?o.onFound&&o.onFound.call(o,g):o.onNotFound&&o.onNotFound.call(o,g)},tracking.ColorTracker.registerColor("cyan",function(t,r,a){var n=50,e=70,i=t-0,o=r-255,c=a-255;return r-t>=n&&a-t>=e?!0:Math.sqrt(i*i+o*o+c*c)<80}),tracking.ColorTracker.registerColor("magenta",function(t,r,a){var n=50,e=t-255,i=r-0,o=a-255;return t-r>=n&&a-r>=n?!0:Math.sqrt(e*e+i*i+o*o)<140}),tracking.ColorTracker.registerColor("yellow",function(t,r,a){var n=50,e=t-255,i=r-255,o=a-0;return t-r>=n&&a-r>=n?!0:Math.sqrt(e*e+i*i+o*o)<100})}(),function(){tracking.EyeTracker=function(){tracking.EyeTracker.base(this,"constructor");var t=tracking.HAARTracker.data.eye;t&&this.setData(new Float64Array(t))},tracking.inherits(tracking.EyeTracker,tracking.HAARTracker)}(),function(){tracking.FaceTracker=function(){tracking.FaceTracker.base(this,"constructor");var t=tracking.HAARTracker.data.face;t&&this.setData(new Float64Array(t))},tracking.inherits(tracking.FaceTracker,tracking.HAARTracker)}(),function(){tracking.MouthTracker=function(){tracking.MouthTracker.base(this,"constructor");var t=tracking.HAARTracker.data.mouth;t&&this.setData(new Float64Array(t))},tracking.inherits(tracking.MouthTracker,tracking.HAARTracker)}();
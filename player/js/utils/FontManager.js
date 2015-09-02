var FontManager = (function(){

    var maxWaitingTime = 5000;

    function setUpNode(font, family){
        var parentNode = document.createElement('span');
        parentNode.style.fontFamily    = family;
        var node = document.createElement('span');
        // Characters that vary significantly among different fonts
        node.innerHTML = 'giItT1WQy@!-/#';
        // Visible - so we can measure it - but not on the screen
        parentNode.style.position      = 'absolute';
        parentNode.style.left          = '-10000px';
        parentNode.style.top           = '-10000px';
        // Large font size makes even subtle changes obvious
        parentNode.style.fontSize      = '300px';
        // Reset any font properties
        parentNode.style.fontVariant   = 'normal';
        parentNode.style.fontStyle     = 'normal';
        parentNode.style.fontWeight    = 'normal';
        parentNode.style.letterSpacing = '0';
        parentNode.appendChild(node);
        document.body.appendChild(parentNode);

        // Remember width with no applied web font
        var width = node.offsetWidth;
        node.style.fontFamily = font + ', '+family;
        return {node:node, w:width, parent:parentNode};
    }

    function checkLoadedFonts() {
        var i, len = this.fonts.length;
        var node, w;
        var loadedCount = len;
        for(i=0;i<len; i+= 1){
            if(this.fonts[i].loaded){
                loadedCount -= 1;
                continue;
            }
            node = this.fonts[i].monoCase.node;
            w = this.fonts[i].monoCase.w;
            if(node.offsetWidth !== w){
                loadedCount -= 1;
                this.fonts[i].loaded = true;
            }else{
                node = this.fonts[i].sansCase.node;
                w = this.fonts[i].sansCase.w;
                if(node.offsetWidth !== w){
                    loadedCount -= 1;
                    this.fonts[i].loaded = true;
                }
            }
            if(this.fonts[i].loaded){
                this.fonts[i].sansCase.parent.parentNode.removeChild(this.fonts[i].sansCase.parent);
                this.fonts[i].monoCase.parent.parentNode.removeChild(this.fonts[i].monoCase.parent);
            }
        }

        if(loadedCount !== 0 && Date.now() - this.initTime < maxWaitingTime){
            setTimeout(checkLoadedFonts.bind(this),20);
        }else{
            this.loaded = true;
        }
    };

    function addFonts(fontArr, defs){
        if(!fontArr){
            this.loaded = true;
            return;
        }
        var i, len = fontArr.length;
        for(i=0; i<len; i+= 1){
            fontArr[i].loaded = false;
            fontArr[i].monoCase = setUpNode(fontArr[i].fFamily,'monospace');
            fontArr[i].sansCase = setUpNode(fontArr[i].fFamily,'sans-serif');
            if(fontArr[i].fPath){
                /*var l = document.createElement('link');
                l.setAttribute('rel','stylesheet');
                l.setAttribute('type','text/css');
                l.setAttribute('href',fontArr[i].fPath);
                defs.appendChild(l);*/
                /////
                //document.getElementsByTagName('head')[0].appendChild(l);
                var s = document.createElement('style');
                s.type = "text/css";
                s.innerHTML = "@font-face {" + "font-family: "+fontArr[i].fFamily+"; font-style: normal; src: url('"+fontArr[i].fPath+"');}";
                defs.appendChild(s);
            }
            this.fonts.push(fontArr[i]);
        }
        //s.styleSheet.cssText = "@font-face {" + "font-family: Pacifico;" + "}";
        //console.log(defs);
        /*<style type="text/css">
         @font-face {
         font-family: Delicious;
         src: url('../fonts/font.woff');
         }
         </style>*/
        checkLoadedFonts.bind(this)();
    }
    function getFontByName(name){
        var i = 0, len = this.fonts.length;
        while(i<len){
            if(this.fonts[i].fName === name) {
                return this.fonts[i].fFamily;
            }
            i += 1;
        }
        return 'sans-serif';
    }

    var Font = function(){
        this.fonts = [];
        this.loaded = false;
        this.initTime = Date.now();
    };
    Font.prototype.addFonts = addFonts;
    Font.prototype.getFontByName = getFontByName;

    return Font;

}());
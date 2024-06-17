/*
 Copyright 2012 Mozilla Foundation 
 Copyright 2013 Lu Wang <coolwanglu@gmail.com>
 Apachine License Version 2.0 
*/
(function(){
  function b(e,t,n,i){var s=(e.className||"").split(/\s+/g);""===s[0]&&s.shift();var r=s.indexOf(t);return 0>r&&n&&s.push(t),0<=r&&i&&s.splice(r,1),e.className=s.join(" "),0<=r}if(!("classList"in document.createElement("div"))){var e={add:function(e){b(this.element,e,!0,!1)},contains:function(e){return b(this.element,e,!1,!1)},remove:function(e){b(this.element,e,!1,!0)},toggle:function(e){b(this.element,e,!0,!0)}};Object.defineProperty(HTMLElement.prototype,"classList",{get:function(){if(this._classList)return this._classList;var t=Object.create(e,{element:{value:this,writable:!1,enumerable:!0}});return Object.defineProperty(this,"_classList",{value:t,writable:!1,enumerable:!1}),t},enumerable:!0})}
})();

(function(){/*
 pdf2htmlEX.js: Core UI functions for pdf2htmlEX 
 Copyright 2012,2013 Lu Wang <coolwanglu@gmail.com> and other contributors 
 https://github.com/pdf2htmlEX/pdf2htmlEX/blob/master/share/LICENSE 
*/
var pdf2htmlEX=window.pdf2htmlEX=window.pdf2htmlEX||{},CSS_CLASS_NAMES={page_frame:"pf",page_content_box:"pc",page_data:"pi",background_image:"bi",link:"l",input_radio:"ir",__dummy__:"no comma"},DEFAULT_CONFIG={container_id:"page-container",sidebar_id:"sidebar",outline_id:"outline",loading_indicator_cls:"loading-indicator",preload_pages:3,render_timeout:100,scale_step:.9,key_handler:!0,hashchange_handler:!0,view_history_handler:!0,__dummy__:"no comma"},EPS=1e-6;function invert(e){var t=e[0]*e[3]-e[1]*e[2];return[e[3]/t,-e[1]/t,-e[2]/t,e[0]/t,(e[2]*e[5]-e[3]*e[4])/t,(e[1]*e[4]-e[0]*e[5])/t]}function transform(e,t){return[e[0]*t[0]+e[2]*t[1]+e[4],e[1]*t[0]+e[3]*t[1]+e[5]]}function get_page_number(e){return parseInt(e.getAttribute("data-page-no"),16)}function disable_dragstart(e){for(var t=0,i=e.length;t<i;++t)e[t].addEventListener("dragstart",(function(){return!1}),!1)}function clone_and_extend_objs(e){for(var t={},i=0,n=arguments.length;i<n;++i){var a,s=arguments[i];for(a in s)s.hasOwnProperty(a)&&(t[a]=s[a])}return t}function Page(e){if(e){this.shown=this.loaded=!1,this.page=e,this.num=get_page_number(e),this.original_height=e.clientHeight,this.original_width=e.clientWidth;var t=e.getElementsByClassName(CSS_CLASS_NAMES.page_content_box)[0];t&&(this.content_box=t,this.original_scale=this.cur_scale=this.original_height/t.clientHeight,this.page_data=JSON.parse(e.getElementsByClassName(CSS_CLASS_NAMES.page_data)[0].getAttribute("data-data")),this.ctm=this.page_data.ctm,this.ictm=invert(this.ctm),this.loaded=!0)}}function Viewer(e){this.config=clone_and_extend_objs(DEFAULT_CONFIG,0<arguments.length?e:{}),this.pages_loading=[],this.init_before_loading_content();var t=this;document.addEventListener("DOMContentLoaded",(function(){t.init_after_loading_content()}),!1)}Page.prototype={hide:function(){this.loaded&&this.shown&&(this.content_box.classList.remove("opened"),this.shown=!1)},show:function(){this.loaded&&!this.shown&&(this.content_box.classList.add("opened"),this.shown=!0)},rescale:function(e){this.cur_scale=0===e?this.original_scale:e,this.loaded&&((e=this.content_box.style).msTransform=e.webkitTransform=e.transform="scale("+this.cur_scale.toFixed(3)+")"),(e=this.page.style).height=this.original_height*this.cur_scale+"px",e.width=this.original_width*this.cur_scale+"px"},view_position:function(){var e=this.page,t=e.parentNode;return[t.scrollLeft-e.offsetLeft-e.clientLeft,t.scrollTop-e.offsetTop-e.clientTop]},height:function(){return this.page.clientHeight},width:function(){return this.page.clientWidth}},Viewer.prototype={scale:1,cur_page_idx:0,first_page_idx:0,init_before_loading_content:function(){this.pre_hide_pages()},initialize_radio_button:function(){for(var e=document.getElementsByClassName(CSS_CLASS_NAMES.input_radio),t=0;t<e.length;t++)e[t].addEventListener("click",(function(){this.classList.toggle("checked")}))},init_after_loading_content:function(){this.sidebar=document.getElementById(this.config.sidebar_id),this.outline=document.getElementById(this.config.outline_id),this.container=document.getElementById(this.config.container_id),this.loading_indicator=document.getElementsByClassName(this.config.loading_indicator_cls)[0];for(var e=!0,t=this.outline.childNodes,i=0,n=t.length;i<n;++i)if("ul"===t[i].nodeName.toLowerCase()){e=!1;break}if(e||this.sidebar.classList.add("opened"),this.find_pages(),0!=this.pages.length){disable_dragstart(document.getElementsByClassName(CSS_CLASS_NAMES.background_image)),this.config.key_handler&&this.register_key_handler();var a=this;this.config.hashchange_handler&&window.addEventListener("hashchange",(function(e){a.navigate_to_dest(document.location.hash.substring(1))}),!1),this.config.view_history_handler&&window.addEventListener("popstate",(function(e){e.state&&a.navigate_to_dest(e.state)}),!1),this.container.addEventListener("scroll",(function(){a.update_page_idx(),a.schedule_render(!0)}),!1),[this.container,this.outline].forEach((function(e){e.addEventListener("click",a.link_handler.bind(a),!1)})),this.initialize_radio_button(),this.render()}},find_pages:function(){for(var e=[],t={},i=this.container.childNodes,n=0,a=i.length;n<a;++n){var s=i[n];s.nodeType===Node.ELEMENT_NODE&&s.classList.contains(CSS_CLASS_NAMES.page_frame)&&(s=new Page(s),e.push(s),t[s.num]=e.length-1)}this.pages=e,this.page_map=t},load_page:function(e,t,i){var n=this.pages;if(!(e>=n.length||(n=n[e],n.loaded||this.pages_loading[e]))){var a=(n=n.page).getAttribute("data-page-url");if(a){this.pages_loading[e]=!0;var s=n.getElementsByClassName(this.config.loading_indicator_cls)[0];void 0===s&&((s=this.loading_indicator.cloneNode(!0)).classList.add("active"),n.appendChild(s));var o=this,r=new XMLHttpRequest;r.open("GET",a,!0),r.onload=function(){if(200===r.status||0===r.status){(t=document.createElement("div")).innerHTML=r.responseText;for(var t,n=null,a=0,s=(t=t.childNodes).length;a<s;++a){var c=t[a];if(c.nodeType===Node.ELEMENT_NODE&&c.classList.contains(CSS_CLASS_NAMES.page_frame)){n=c;break}}t=o.pages[e],o.container.replaceChild(n,t.page),t=new Page(n),o.pages[e]=t,t.hide(),t.rescale(o.scale),disable_dragstart(n.getElementsByClassName(CSS_CLASS_NAMES.background_image)),o.schedule_render(!1),i&&i(t)}delete o.pages_loading[e]},r.send(null)}void 0===t&&(t=this.config.preload_pages),0<--t&&(o=this,setTimeout((function(){o.load_page(e+1,t)}),0))}},pre_hide_pages:function(){var e="@media screen{."+CSS_CLASS_NAMES.page_content_box+"{display:none;}}",t=document.createElement("style");t.styleSheet?t.styleSheet.cssText=e:t.appendChild(document.createTextNode(e)),document.head.appendChild(t)},render:function(){for(var e,t=(i=(t=this.container).scrollTop)-(e=t.clientHeight),i=i+e+e,n=0,a=(e=this.pages).length;n<a;++n){var s=e[n],o=(r=s.page).offsetTop+r.clientTop,r=o+r.clientHeight;o<=i&&r>=t?s.loaded?s.show():this.load_page(n):s.hide()}},update_page_idx:function(){var e=this.pages,t=e.length;if(!(2>t)){for(var i=(n=this.container).scrollTop,n=i+n.clientHeight,a=-1,s=t,o=s-a;1<o;){(o=e[r=a+Math.floor(o/2)].page).offsetTop+o.clientTop+o.clientHeight>=i?s=r:a=r,o=s-a}this.first_page_idx=s;for(var r=a=this.cur_page_idx,c=0;s<t;++s){var l=(o=e[s].page).offsetTop+o.clientTop;o=o.clientHeight;if(l>n)break;if(o=(Math.min(n,l+o)-Math.max(i,l))/o,s===a&&Math.abs(o-1)<=EPS){r=a;break}o>c&&(c=o,r=s)}this.cur_page_idx=r}},schedule_render:function(e){if(void 0!==this.render_timer){if(!e)return;clearTimeout(this.render_timer)}var t=this;this.render_timer=setTimeout((function(){delete t.render_timer,t.render()}),this.config.render_timeout)},register_key_handler:function(){var e=this;window.addEventListener("DOMMouseScroll",(function(t){if(t.ctrlKey){t.preventDefault();var i=(n=e.container).getBoundingClientRect(),n=[t.clientX-i.left-n.clientLeft,t.clientY-i.top-n.clientTop];e.rescale(Math.pow(e.config.scale_step,t.detail),!0,n)}}),!1),window.addEventListener("keydown",(function(t){var i=!1,n=t.ctrlKey||t.metaKey,a=t.altKey;switch(t.keyCode){case 61:case 107:case 187:n&&(e.rescale(1/e.config.scale_step,!0),i=!0);break;case 173:case 109:case 189:n&&(e.rescale(e.config.scale_step,!0),i=!0);break;case 48:n&&(e.rescale(0,!1),i=!0);break;case 33:a?e.scroll_to(e.cur_page_idx-1):e.container.scrollTop-=e.container.clientHeight,i=!0;break;case 34:a?e.scroll_to(e.cur_page_idx+1):e.container.scrollTop+=e.container.clientHeight,i=!0;break;case 35:e.container.scrollTop=e.container.scrollHeight,i=!0;break;case 36:e.container.scrollTop=0,i=!0}i&&t.preventDefault()}),!1)},rescale:function(e,t,i){var n=this.scale;this.scale=e=0===e?1:t?n*e:e,i||(i=[0,0]),t=this.container,i[0]+=t.scrollLeft,i[1]+=t.scrollTop;for(var a=this.pages,s=a.length,o=this.first_page_idx;o<s;++o){if((r=a[o].page).offsetTop+r.clientTop>=i[1])break}0>(r=o-1)&&(r=0);var r,c=(r=a[r].page).clientWidth,l=(o=r.clientHeight,r.offsetLeft+r.clientLeft),h=i[0]-l;for(0>h?h=0:h>c&&(h=c),c=r.offsetTop+r.clientTop,0>(i=i[1]-c)?i=0:i>o&&(i=o),o=0;o<s;++o)a[o].rescale(e);t.scrollLeft+=h/n*e+r.offsetLeft+r.clientLeft-h-l,t.scrollTop+=i/n*e+r.offsetTop+r.clientTop-i-c,this.schedule_render(!0)},fit_width:function(){var e=this.cur_page_idx;this.rescale(this.container.clientWidth/this.pages[e].width(),!0),this.scroll_to(e)},fit_height:function(){var e=this.cur_page_idx;this.rescale(this.container.clientHeight/this.pages[e].height(),!0),this.scroll_to(e)},get_containing_page:function(e){for(;e;){if(e.nodeType===Node.ELEMENT_NODE&&e.classList.contains(CSS_CLASS_NAMES.page_frame)){e=get_page_number(e);var t=this.page_map;return e in t?this.pages[t[e]]:null}e=e.parentNode}return null},link_handler:function(e){var t=e.target,i=t.getAttribute("data-dest-detail");if(i){if(this.config.view_history_handler)try{var n=this.get_current_view_hash();window.history.replaceState(n,"","#"+n),window.history.pushState(i,"","#"+i)}catch(e){}this.navigate_to_dest(i,this.get_containing_page(t)),e.preventDefault()}},navigate_to_dest:function(e,t){try{var i=JSON.parse(e)}catch(e){return}if(i instanceof Array&&(a=i[0])in(s=this.page_map)){for(var n=s[a],a=this.pages[n],s=2,o=i.length;s<o;++s){if(null!==(l=i[s])&&"number"!=typeof l)return}for(;6>i.length;)i.push(null);s=(o=t||this.pages[this.cur_page_idx]).view_position(),s=transform(o.ictm,[s[0],o.height()-s[1]]),o=this.scale;var r=[0,0],c=!0,l=!1,h=this.scale;switch(i[1]){case"XYZ":r=[null===i[2]?s[0]:i[2]*h,null===i[3]?s[1]:i[3]*h],null!==(o=i[4])&&0!==o||(o=this.scale),l=!0;break;case"Fit":case"FitB":r=[0,0],l=!0;break;case"FitH":case"FitBH":r=[0,null===i[2]?s[1]:i[2]*h],l=!0;break;case"FitV":case"FitBV":r=[null===i[2]?s[0]:i[2]*h,0],l=!0;break;case"FitR":r=[i[2]*h,i[5]*h],c=!1,l=!0}if(l){this.rescale(o,!1);var d=this;i=function(e){r=transform(e.ctm,r),c&&(r[1]=e.height()-r[1]),d.scroll_to(n,r)};a.loaded?i(a):(this.load_page(n,void 0,i),this.scroll_to(n))}}},scroll_to:function(e,t){var i=this.pages;if(!(0>e||e>=i.length)){i=i[e].view_position(),void 0===t&&(t=[0,0]);var n=this.container;n.scrollLeft+=t[0]-i[0],n.scrollTop+=t[1]-i[1]}},get_current_view_hash:function(){var e=[],t=this.pages[this.cur_page_idx];e.push(t.num),e.push("XYZ");var i=t.view_position();i=transform(t.ictm,[i[0],t.height()-i[1]]);return e.push(i[0]/this.scale),e.push(i[1]/this.scale),e.push(this.scale),JSON.stringify(e)}},pdf2htmlEX.Viewer=Viewer;
})();
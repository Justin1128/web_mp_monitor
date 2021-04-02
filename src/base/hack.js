/**
 * 监听spa应用页面跳转
 */
/**
 * hack pushstate replaceState
 * 派送historystatechange historystatechange事件
 * @export
 * @param {('pushState' | 'replaceState')} e
 */
export function hackState(e) {
    let t = history[e]
    if ("function" == typeof t) {
        history[e] = function (n, i, s) {
            // !window['__bb_onpopstate_'] && hackOnpopstate(); // 调用pushState或replaceState时hack Onpopstate
            let c = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments),
                u = location.href,
                f = t.apply(history, c);
            console.log('changggggggggggggggggg')
            let customEvent=new CustomEvent('historystatechanged',{detail:window.location.href})
            window.dispatchEvent(customEvent);
            
            // if (!s || "string" != typeof s) return f;
            // if (s === u) return f;
            // try {
            //     let l = u.split("#"),
            //         h = s.split("#"),
            //         p = parseUrl(l[0]),
            //         d = parseUrl(h[0]),
            //         g = l[1] && l[1].replace(/^\/?(.*)/, "$1"),
            //         v = h[1] && h[1].replace(/^\/?(.*)/, "$1");
            //     p !== d ? dispatchCustomEvent("historystatechanged", d) : g !== v && dispatchCustomEvent("historystatechanged", v)
            // } catch (m) {
            //     warn("[retcode] error in " + e + ": " + m)
            // }
            return f
        }
        // history[e].toString = fnToString(e)
    }
}

export function hackOnpopstate() {
    window['__bb_onpopstate_'] = window.onpopstate
    window.onpopstate = function () {
      for (var r = arguments.length, a = new Array(r), o = 0; o < r; o++) a[o] = arguments[o];
      let page = Config.enableSPA ? parseHash(location.hash.toLowerCase()) : location.pathname.toLowerCase()
      setPage(page, false)
      if (window.__bb_onpopstate_) return window.__bb_onpopstate_.apply(this, a)
    }
  }
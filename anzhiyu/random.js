var posts=["/post/43128.html","/post/59887.html","/post/14780.html","/post/36894.html","/post/33825.html","/post/36809.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };
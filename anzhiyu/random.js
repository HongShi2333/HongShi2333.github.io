var posts=["/post/45382.html","/post/5975.html","/post/42496.html","/post/56354.html","/post/61849.html","/post/21570.html","/post/43757.html","/post/26312.html","/post/27433.html","/post/62072.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };
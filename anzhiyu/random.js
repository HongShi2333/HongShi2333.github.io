var posts=["/post/42496.html","/post/62072.html","/post/45382.html","/post/61849.html","/post/26312.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };
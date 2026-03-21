// 首页一图流加载优化
/**
 * @description 实现medium的渐进加载背景的效果
 */
(function() {
    class ProgressiveLoad {
      constructor(smallSrc, largeSrc) {
        this.smallSrc = smallSrc;
        this.largeSrc = largeSrc;
        this.initTpl();
        this.container.addEventListener('animationend', () => {
          this.smallStage.style.display = 'none'; 
        }, {once: true});
      }
  
      initTpl() {
        this.container = document.createElement('div');
        this.smallStage = document.createElement('div');
        this.largeStage = document.createElement('div');
        this.smallImg = new Image();
        this.largeImg = new Image();
        this.container.className = 'pl-container';
        this.smallStage.className = 'pl-img pl-blur';
        this.largeStage.className = 'pl-img';
        this.container.appendChild(this.smallStage);
        this.container.appendChild(this.largeStage);
        this.smallImg.onload = this._onSmallLoaded.bind(this);
        this.largeImg.onload = this._onLargeLoaded.bind(this);
      }
  
      progressiveLoad() {
        this.smallImg.src = this.smallSrc;
        this.largeImg.src = this.largeSrc;
      }
  
      _onLargeLoaded() {
        this.largeStage.classList.add('pl-visible');
        this.largeStage.style.backgroundImage = `url('${this.largeSrc}')`;
      }
  
      _onSmallLoaded() {
        this.smallStage.classList.add('pl-visible');
        this.smallStage.style.backgroundImage = `url('${this.smallSrc}')`;
      }
    }
  
    const executeLoad = (config, target) => {
      console.log('执行渐进背景替换');
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const loader = new ProgressiveLoad(
        isMobile ? config.mobileSmallSrc : config.smallSrc,
        isMobile ? config.mobileLargeSrc : config.largeSrc
      );
      if (target.children[0]) {
        target.insertBefore(loader.container, target.children[0]);
      }
      loader.progressiveLoad();
    };
  
    const ldconfig = {
      light: {
        smallSrc: 'https://idnwtf-weather.static.hf.space/desktop/d-background7.jpg', //浅色模式 小图链接 尽可能配置小于100k的图片 
        largeSrc: 'https://idnwtf-weather.static.hf.space/desktop/d-background7.jpg', //浅色模式 大图链接 最终显示的图片
        mobileSmallSrc: 'https://cas-bridge.xethub.hf.co/xet-bridge-us/69beb6c705a4f1fa942c82f8/0793ef4e866fb223170fbec5fba3caa75316c74716fc1c899d2be5eb0b879790?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cas%2F20260321%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260321T152535Z&X-Amz-Expires=3600&X-Amz-Signature=f3fa094f474613ae78520cfe315fb0e013e3456a1f5f0625089cc7c6b52ca785&X-Amz-SignedHeaders=host&X-Xet-Cas-Uid=public&response-content-disposition=inline%3B+filename*%3DUTF-8%27%27m-background27.jpg%3B+filename%3D%22m-background27.jpg%22%3B&response-content-type=image%2Fjpeg&x-amz-checksum-mode=ENABLED&x-id=GetObject&Expires=1774110335&Policy=eyJTdGF0ZW1lbnQiOlt7IkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc3NDExMDMzNX19LCJSZXNvdXJjZSI6Imh0dHBzOi8vY2FzLWJyaWRnZS54ZXRodWIuaGYuY28veGV0LWJyaWRnZS11cy82OWJlYjZjNzA1YTRmMWZhOTQyYzgyZjgvMDc5M2VmNGU4NjZmYjIyMzE3MGZiZWM1ZmJhM2NhYTc1MzE2Yzc0NzE2ZmMxYzg5OWQyYmU1ZWIwYjg3OTc5MCoifV19&Signature=OXkP0YEGpdrtVKs4IYc91s3dZkZIhWl4R83C1LYsUWNVq9MGyO8wY8Ui2TzvXo67zj-e37MnoNLq1PGVXgxeSvsgpcvTD8EShIXMZ6jL09LZql4xqlqtmKyCDrZC8FiNOUBxPJWYN7S9An3jqIKGppRlKFwzRIwcxYLdk2skOBzatWaSglb-cwKq2ZpgZfG201t0RALtb4eMrGhHU-f-lqCbEuSFdCurQBxTH7JwekpT2R%7EUQcVpxeVulLAY4A7n4a6wONuf7djeuOUd1AWEugCMNXdlGVEueKEe2VL--HKh40H9zZH%7EQnC1KufjPFHj7oew7hRWMkAVX6VkxYoW4g__&Key-Pair-Id=K2L8F4GPSG1IFC', //手机端浅色小图链接 尽可能配置小于100k的图片
        mobileLargeSrc: 'https://cas-bridge.xethub.hf.co/xet-bridge-us/69beb6c705a4f1fa942c82f8/0793ef4e866fb223170fbec5fba3caa75316c74716fc1c899d2be5eb0b879790?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cas%2F20260321%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260321T152535Z&X-Amz-Expires=3600&X-Amz-Signature=f3fa094f474613ae78520cfe315fb0e013e3456a1f5f0625089cc7c6b52ca785&X-Amz-SignedHeaders=host&X-Xet-Cas-Uid=public&response-content-disposition=inline%3B+filename*%3DUTF-8%27%27m-background27.jpg%3B+filename%3D%22m-background27.jpg%22%3B&response-content-type=image%2Fjpeg&x-amz-checksum-mode=ENABLED&x-id=GetObject&Expires=1774110335&Policy=eyJTdGF0ZW1lbnQiOlt7IkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc3NDExMDMzNX19LCJSZXNvdXJjZSI6Imh0dHBzOi8vY2FzLWJyaWRnZS54ZXRodWIuaGYuY28veGV0LWJyaWRnZS11cy82OWJlYjZjNzA1YTRmMWZhOTQyYzgyZjgvMDc5M2VmNGU4NjZmYjIyMzE3MGZiZWM1ZmJhM2NhYTc1MzE2Yzc0NzE2ZmMxYzg5OWQyYmU1ZWIwYjg3OTc5MCoifV19&Signature=OXkP0YEGpdrtVKs4IYc91s3dZkZIhWl4R83C1LYsUWNVq9MGyO8wY8Ui2TzvXo67zj-e37MnoNLq1PGVXgxeSvsgpcvTD8EShIXMZ6jL09LZql4xqlqtmKyCDrZC8FiNOUBxPJWYN7S9An3jqIKGppRlKFwzRIwcxYLdk2skOBzatWaSglb-cwKq2ZpgZfG201t0RALtb4eMrGhHU-f-lqCbEuSFdCurQBxTH7JwekpT2R%7EUQcVpxeVulLAY4A7n4a6wONuf7djeuOUd1AWEugCMNXdlGVEueKEe2VL--HKh40H9zZH%7EQnC1KufjPFHj7oew7hRWMkAVX6VkxYoW4g__&Key-Pair-Id=K2L8F4GPSG1IFC', //手机端浅色大图链接 最终显示的图片
        enableRoutes: ['/'],
        },
      dark: {
        smallSrc: 'https://cas-bridge.xethub.hf.co/xet-bridge-us/69beb6c705a4f1fa942c82f8/097a7675d1f0687c79c98bcf7234fe3dc2fae8e8509d9ed560446719d3e3e131?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cas%2F20260321%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260321T152131Z&X-Amz-Expires=3600&X-Amz-Signature=3de561ed80ecbe9d9bb226ff631beba14af2aa860c42f44bb8486ebb721f0778&X-Amz-SignedHeaders=host&X-Xet-Cas-Uid=public&response-content-disposition=inline%3B+filename*%3DUTF-8%27%27d-background8.jpg%3B+filename%3D%22d-background8.jpg%22%3B&response-content-type=image%2Fjpeg&x-amz-checksum-mode=ENABLED&x-id=GetObject&Expires=1774110091&Policy=eyJTdGF0ZW1lbnQiOlt7IkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc3NDExMDA5MX19LCJSZXNvdXJjZSI6Imh0dHBzOi8vY2FzLWJyaWRnZS54ZXRodWIuaGYuY28veGV0LWJyaWRnZS11cy82OWJlYjZjNzA1YTRmMWZhOTQyYzgyZjgvMDk3YTc2NzVkMWYwNjg3Yzc5Yzk4YmNmNzIzNGZlM2RjMmZhZThlODUwOWQ5ZWQ1NjA0NDY3MTlkM2UzZTEzMSoifV19&Signature=b9EUKetCzSF-kSDuR793KcgpHuW9IPlz5m1UcNG%7EHt0Ny-CtqkSoaZN1m0RJziPi0MbpAe4NPIyzn-eYynXznOeKfhPncF55mJT8NFuksiObFnLm0vTf9DGa0aEVvXYAMZe11k0o8nlz-9xCXOsDnU8lN2vDIjk4WxDcs7bY81k57LhAYZSyrUEJ5neLlLd6i8WUdXKeWD4GvyzM8AcEbpZ3nbjMh-ALvMtYlQj7XhqWsgYZb9wqF11H%7EQfm%7E1Iq5XERZrx1XPZOu-Omm7p4PEyZ5ZmgNcapm-xOiqGOK3zzuNBn%7EXmSO7vPkUWbxnZN4oJ7Md9kdv6yVQrGdImvcA__&Key-Pair-Id=K2L8F4GPSG1IFC', //深色模式 小图链接 尽可能配置小于100k的图片 
        largeSrc: 'https://cas-bridge.xethub.hf.co/xet-bridge-us/69beb6c705a4f1fa942c82f8/097a7675d1f0687c79c98bcf7234fe3dc2fae8e8509d9ed560446719d3e3e131?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cas%2F20260321%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260321T152131Z&X-Amz-Expires=3600&X-Amz-Signature=3de561ed80ecbe9d9bb226ff631beba14af2aa860c42f44bb8486ebb721f0778&X-Amz-SignedHeaders=host&X-Xet-Cas-Uid=public&response-content-disposition=inline%3B+filename*%3DUTF-8%27%27d-background8.jpg%3B+filename%3D%22d-background8.jpg%22%3B&response-content-type=image%2Fjpeg&x-amz-checksum-mode=ENABLED&x-id=GetObject&Expires=1774110091&Policy=eyJTdGF0ZW1lbnQiOlt7IkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc3NDExMDA5MX19LCJSZXNvdXJjZSI6Imh0dHBzOi8vY2FzLWJyaWRnZS54ZXRodWIuaGYuY28veGV0LWJyaWRnZS11cy82OWJlYjZjNzA1YTRmMWZhOTQyYzgyZjgvMDk3YTc2NzVkMWYwNjg3Yzc5Yzk4YmNmNzIzNGZlM2RjMmZhZThlODUwOWQ5ZWQ1NjA0NDY3MTlkM2UzZTEzMSoifV19&Signature=b9EUKetCzSF-kSDuR793KcgpHuW9IPlz5m1UcNG%7EHt0Ny-CtqkSoaZN1m0RJziPi0MbpAe4NPIyzn-eYynXznOeKfhPncF55mJT8NFuksiObFnLm0vTf9DGa0aEVvXYAMZe11k0o8nlz-9xCXOsDnU8lN2vDIjk4WxDcs7bY81k57LhAYZSyrUEJ5neLlLd6i8WUdXKeWD4GvyzM8AcEbpZ3nbjMh-ALvMtYlQj7XhqWsgYZb9wqF11H%7EQfm%7E1Iq5XERZrx1XPZOu-Omm7p4PEyZ5ZmgNcapm-xOiqGOK3zzuNBn%7EXmSO7vPkUWbxnZN4oJ7Md9kdv6yVQrGdImvcA__&Key-Pair-Id=K2L8F4GPSG1IFC', //深色模式 大图链接 最终显示的图片
        mobileSmallSrc: 'https://cas-bridge.xethub.hf.co/xet-bridge-us/69beb6c705a4f1fa942c82f8/43fec36e57c0dcffeb40735587c1a743ccc7226916d1a273ef2bc144473ad529?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cas%2F20260321%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260321T152356Z&X-Amz-Expires=3600&X-Amz-Signature=8e8ca870dde4b2842ceb708375f494539dc8d5e1ad21d5d703582cf5e9874922&X-Amz-SignedHeaders=host&X-Xet-Cas-Uid=public&response-content-disposition=inline%3B+filename*%3DUTF-8%27%27m-background3.jpg%3B+filename%3D%22m-background3.jpg%22%3B&response-content-type=image%2Fjpeg&x-amz-checksum-mode=ENABLED&x-id=GetObject&Expires=1774110236&Policy=eyJTdGF0ZW1lbnQiOlt7IkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc3NDExMDIzNn19LCJSZXNvdXJjZSI6Imh0dHBzOi8vY2FzLWJyaWRnZS54ZXRodWIuaGYuY28veGV0LWJyaWRnZS11cy82OWJlYjZjNzA1YTRmMWZhOTQyYzgyZjgvNDNmZWMzNmU1N2MwZGNmZmViNDA3MzU1ODdjMWE3NDNjY2M3MjI2OTE2ZDFhMjczZWYyYmMxNDQ0NzNhZDUyOSoifV19&Signature=SoYNmui5W1Kp9xywIVTLJcafYbvR-j6s0WWcMoTYTNjbncbwGkV7UISzS-WVya95IWZGfl44PGVdG8nn6dbMqy2IeelR%7EGVDAGhC6oDGzO2%7EsPMLXkEMHBPjpt3a4M-138pvytN36jraeB4EGOdGMxa-7P-trwtiv4ZbdG8O2qTwTP0cBVWh4ngYDG%7EB0cQl8Mp3gGNFWScQaMspUxV0Uzsel2rJpWTkWWNAy6fcNrqUNnPtBucUnbzXmcECfyyEc-lzuCtz4-2ntjeJ8hSW%7EdQoH1CnraCxMIpEgSKGHCJoeTchrU47ra53uF6EA4nxeoxt%7EgvzSsVseUmfgTd%7ENA__&Key-Pair-Id=K2L8F4GPSG1IFC', //手机端深色模式小图链接 尽可能配置小于100k的图片
        mobileLargeSrc: 'https://cas-bridge.xethub.hf.co/xet-bridge-us/69beb6c705a4f1fa942c82f8/43fec36e57c0dcffeb40735587c1a743ccc7226916d1a273ef2bc144473ad529?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cas%2F20260321%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260321T152356Z&X-Amz-Expires=3600&X-Amz-Signature=8e8ca870dde4b2842ceb708375f494539dc8d5e1ad21d5d703582cf5e9874922&X-Amz-SignedHeaders=host&X-Xet-Cas-Uid=public&response-content-disposition=inline%3B+filename*%3DUTF-8%27%27m-background3.jpg%3B+filename%3D%22m-background3.jpg%22%3B&response-content-type=image%2Fjpeg&x-amz-checksum-mode=ENABLED&x-id=GetObject&Expires=1774110236&Policy=eyJTdGF0ZW1lbnQiOlt7IkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc3NDExMDIzNn19LCJSZXNvdXJjZSI6Imh0dHBzOi8vY2FzLWJyaWRnZS54ZXRodWIuaGYuY28veGV0LWJyaWRnZS11cy82OWJlYjZjNzA1YTRmMWZhOTQyYzgyZjgvNDNmZWMzNmU1N2MwZGNmZmViNDA3MzU1ODdjMWE3NDNjY2M3MjI2OTE2ZDFhMjczZWYyYmMxNDQ0NzNhZDUyOSoifV19&Signature=SoYNmui5W1Kp9xywIVTLJcafYbvR-j6s0WWcMoTYTNjbncbwGkV7UISzS-WVya95IWZGfl44PGVdG8nn6dbMqy2IeelR%7EGVDAGhC6oDGzO2%7EsPMLXkEMHBPjpt3a4M-138pvytN36jraeB4EGOdGMxa-7P-trwtiv4ZbdG8O2qTwTP0cBVWh4ngYDG%7EB0cQl8Mp3gGNFWScQaMspUxV0Uzsel2rJpWTkWWNAy6fcNrqUNnPtBucUnbzXmcECfyyEc-lzuCtz4-2ntjeJ8hSW%7EdQoH1CnraCxMIpEgSKGHCJoeTchrU47ra53uF6EA4nxeoxt%7EgvzSsVseUmfgTd%7ENA__&Key-Pair-Id=K2L8F4GPSG1IFC', //手机端深色大图链接 最终显示的图片
        enableRoutes: ['/'],
        },
      };
  
      const getCurrentTheme = () => {
        return document.documentElement.getAttribute('data-theme'); 
      }
  
      const onThemeChange = () => {
        const currentTheme = getCurrentTheme();
        const config = ldconfig[currentTheme];
        initProgressiveLoad(config);
        document.addEventListener("DOMContentLoaded", function() {
          initProgressiveLoad(config);
        });
      
        document.addEventListener("pjax:complete", function() {
          onPJAXComplete(config);
        });
      }
  
      let initTheme = getCurrentTheme();
      let initConfig = ldconfig[initTheme];
      initProgressiveLoad(initConfig);
  
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === "data-theme" && location.pathname === '/') {
          onThemeChange();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]  
    });
  
    function initProgressiveLoad(config) {
      const container = document.querySelector('.pl-container');
      if (container) {
        container.remove();
      }
      const target = document.getElementById('page-header');
      if (target && target.classList.contains('full_page')) {
        executeLoad(config, target);
      }
    }
  
    function onPJAXComplete(config) {
      const target = document.getElementById('page-header');
      if (target && target.classList.contains('full_page')) {
        initProgressiveLoad(config);
      }
    }
  
  })();
  
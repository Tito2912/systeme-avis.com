// Google Tag Manager – Tracking affiliation ULTRA PREMIUM
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX'); // Remplace GTM-XXXXXXX par ton ID

// BONUS : Tracking boutons
document.querySelectorAll('.cta').forEach(function(btn){
  btn.addEventListener('click',function(){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'event':'cta_click','page':'[PAGE_NAME]'});
  });
});

// BONUS : Scroll tracking (exemple)
window.addEventListener('scroll', function(){
  if(window.scrollY > 600){
    window.dataLayer.push({'event':'scroll_60pct'});
  }
});

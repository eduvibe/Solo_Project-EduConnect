window.addEventListener('load', function () {
    const loadingOverlay = document.getElementById('loading-overlay');
    const content = document.getElementById('content');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
    if (content) {
      content.style.display = 'block';
    }
  });
  


var ftBtn = document.getElementById('button-addon2');
if (ftBtn) {
  ftBtn.addEventListener('click', function() {
    var searchInput = document.getElementById('searchBar');
    var searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
    var tutorCards = document.querySelectorAll('.card');

    if (searchQuery.trim() === '') {
      tutorCards.forEach(function(card) {
        card.style.display = 'block';
      });
    } else {
      tutorCards.forEach(function(card) {
        var subjectEl = card.querySelector('.subject');
        var locationEl = card.querySelector('.location');
        var experienceEl = card.querySelector('.experience');
        var nameEl = card.querySelector('.tutortitle');
        var subjectText = subjectEl ? subjectEl.textContent.toLowerCase() : '';
        var locationText = locationEl ? locationEl.textContent.toLowerCase() : '';
        var experienceText = experienceEl ? experienceEl.textContent.toLowerCase() : '';
        var nameText = nameEl ? nameEl.textContent.toLowerCase() : '';

        if (subjectText.includes(searchQuery) || 
            locationText.includes(searchQuery) || 
            experienceText.includes(searchQuery) || 
            nameText.includes(searchQuery)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
  });
}



window.addEventListener('load', function () {
  var preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'none';
});

    // Initialize AOS
    if (typeof AOS !== 'undefined' && AOS && AOS.init) {
      AOS.init();
    }

// mobile nav toggler (shared)
var mBtn = document.getElementById('mobileMenuBtn');
var mNav = document.getElementById('mobileNav');
if (mBtn && mNav) {
  mBtn.addEventListener('click', function() {
    if (mNav.classList.contains('hidden')) {
      mNav.classList.remove('hidden');
    } else {
      mNav.classList.add('hidden');
    }
  });
}

// account modal (index)
(function(){
  var modal = document.getElementById('accountModal');
  if (!modal) return;

  var closeBtn = document.getElementById('closeAccount');
  var tabLogin = document.getElementById('accountTabLogin');
  var tabSignup = document.getElementById('accountTabSignup');
  var paneLogin = document.getElementById('accountLoginPane');
  var paneSignup = document.getElementById('accountSignupPane');

  function setMode(mode){
    if (mode === 'signup') {
      if (paneLogin) paneLogin.classList.add('hidden');
      if (paneSignup) paneSignup.classList.remove('hidden');
      if (tabLogin) { tabLogin.classList.remove('btn-dark'); tabLogin.classList.add('btn-outline-dark'); }
      if (tabSignup) { tabSignup.classList.remove('btn-outline-dark'); tabSignup.classList.add('btn-dark'); }
    } else {
      if (paneSignup) paneSignup.classList.add('hidden');
      if (paneLogin) paneLogin.classList.remove('hidden');
      if (tabSignup) { tabSignup.classList.remove('btn-dark'); tabSignup.classList.add('btn-outline-dark'); }
      if (tabLogin) { tabLogin.classList.remove('btn-outline-dark'); tabLogin.classList.add('btn-dark'); }
    }
  }

  function open(mode){
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setMode(mode || 'login');
  }

  function close(){
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  var manage = document.getElementById('manageAccount');
  var manageMobile = document.getElementById('manageAccountMobile');
  var openLogin = document.getElementById('openLogin');
  var openSignup = document.getElementById('openSignup');
  var openLoginMobile = document.getElementById('openLoginMobile');
  var openSignupMobile = document.getElementById('openSignupMobile');

  if (manage) manage.addEventListener('click', function(e){ e.preventDefault(); open('login'); });
  if (manageMobile) manageMobile.addEventListener('click', function(e){ e.preventDefault(); open('login'); });
  if (openLogin) openLogin.addEventListener('click', function(e){ e.preventDefault(); open('login'); });
  if (openLoginMobile) openLoginMobile.addEventListener('click', function(e){ e.preventDefault(); open('login'); });
  if (openSignup) openSignup.addEventListener('click', function(e){ e.preventDefault(); open('signup'); });
  if (openSignupMobile) openSignupMobile.addEventListener('click', function(e){ e.preventDefault(); open('signup'); });

  if (closeBtn) closeBtn.addEventListener('click', function(){ close(); });
  if (tabLogin) tabLogin.addEventListener('click', function(){ setMode('login'); });
  if (tabSignup) tabSignup.addEventListener('click', function(){ setMode('signup'); });

  modal.addEventListener('click', function(e){
    if (e.target === modal) close();
  });

  window.addEventListener('keydown', function(e){
    if (e.key === 'Escape') close();
  });
})();

// dynamic tutors for findtutor
(function(){
  var tutorsContainer = document.querySelector('.tutors');
  if (!tutorsContainer) return;
  function fetchFirstOk(urls, options) {
    var list = Array.isArray(urls) ? urls : [urls];
    var i = 0;
    function next() {
      if (i >= list.length) return Promise.reject(new Error('all failed'));
      var url = list[i++];
      return fetch(url, options).then(function(r){
        if (!r.ok) throw new Error('not ok');
        return r;
      }).catch(function(){
        return next();
      });
    }
    return next();
  }
  fetchFirstOk(['/api/tutors', '/api/tutors.php'], {headers:{'Accept':'application/json'}})
    .then(function(r){return r.json()})
    .then(function(list){
      if (!Array.isArray(list) || !list.length) return;
      tutorsContainer.innerHTML = '';
      list.forEach(function(t){
        var card = document.createElement('div');
        card.className = 'card indtutor expt';
        var img = document.createElement('img');
        img.src = t.image || '';
        img.className = 'image-fluid';
        var name = document.createElement('div');
        name.className = 'tutortitle';
        name.innerHTML = '<strong>Name:</strong>'+ (t.name||'');
        var rating = document.createElement('div');
        rating.className = 'rating';
        var ratingImg = document.createElement('img');
        ratingImg.src = '/images/star.PNG';
        rating.appendChild(ratingImg);
        var location = document.createElement('div');
        location.className = 'location';
        location.innerHTML = '<strong>Location:</strong>'+ (t.location||'');
        var subject = document.createElement('div');
        subject.className = 'subject';
        subject.innerHTML = '<strong>Subject:</strong>'+ (t.subject||'');
        var experience = document.createElement('div');
        experience.className = 'experience';
        experience.innerHTML = '<strong>Experience:</strong>'+ (t.experience||'');
        var phone = document.createElement('div');
        phone.className = 'phont';
        phone.innerHTML = '<strong>Phone No:</strong>'+ (t.phone||'');
        var email = document.createElement('div');
        email.className = 'Email';
        email.innerHTML = '<strong>Email:</strong>'+ (t.email||'');
        var socialsLi = document.createElement('li');
        var socials = document.createElement('div');
        socials.className = 'socials';
        var tw = document.createElement('i'); tw.className='bi bi-twitter';
        var fb = document.createElement('i'); fb.className='bi bi-facebook';
        var ln = document.createElement('i'); ln.className='bi bi-linkedin';
        socials.appendChild(tw); socials.appendChild(fb); socials.appendChild(ln);
        socialsLi.appendChild(socials);
        var a = document.createElement('a');
        a.href = '/tutordetails.html';
        a.className = 'btn btn-success';
        a.textContent = ' Check out';
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(rating);
        card.appendChild(location);
        card.appendChild(subject);
        card.appendChild(experience);
        card.appendChild(phone);
        card.appendChild(email);
        card.appendChild(socialsLi);
        card.appendChild(a);
        tutorsContainer.appendChild(card);
      });
    })
    .catch(function(){});
})();

// auth handlers for index modals
(function(){
  var signUpForm = document.getElementById('signUpForm');
  var signINForm = document.getElementById('signINForm');
  function dashboardPath(role) {
    var r = (role || '').toLowerCase();
    if (r === 'superadmin') return '/dashboard/superadmin/';
    if (r === 'admin') return '/dashboard/admin/';
    if (r === 'teacher') return '/dashboard/teacher/';
    return '/dashboard/parent/';
  }
  function fetchFirstOk(urls, options) {
    var list = Array.isArray(urls) ? urls : [urls];
    var i = 0;
    function next() {
      if (i >= list.length) return Promise.reject(new Error('all failed'));
      var url = list[i++];
      return fetch(url, options).then(function(r){
        if (!r.ok) throw new Error('not ok');
        return r;
      }).catch(function(){
        return next();
      });
    }
    return next();
  }
  function postJSON(urls, body) {
    var options = {
      method: 'POST',
      headers: {'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify(body)
    };
    return fetchFirstOk(urls, options)
      .then(function(r){return r.json().then(function(d){return {ok:true, data:d}})})
      .catch(function(){
        return fetch(Array.isArray(urls) ? urls[0] : urls, options)
          .then(function(r){return r.json().then(function(d){return {ok:r.ok, data:d}})});
      });
  }
  if (signUpForm) {
    signUpForm.addEventListener('submit', function(e){
      e.preventDefault();
      var fullName = document.getElementById('fullName') ? document.getElementById('fullName').value : '';
      var email = document.getElementById('signup_email') ? document.getElementById('signup_email').value : '';
      var password = document.getElementById('signup_password') ? document.getElementById('signup_password').value : '';
      var role = document.getElementById('signup_role') ? document.getElementById('signup_role').value : '';
      postJSON(['/api/auth/register', '/api/auth/register.php'], {fullName: fullName, email: email, password: password, role: role})
      .then(function(res){
        if (res.ok) {
          var m = document.getElementById('accountModal'); if (m){m.classList.add('hidden');m.classList.remove('flex');}
          var user = res.data && res.data.user ? res.data.user : null;
          window.location.href = dashboardPath(user && user.role ? user.role : '');
        } else {
          alert(res.data && res.data.error ? res.data.error : 'Registration failed');
        }
      }).catch(function(){alert('Network error')});
    });
  }
  if (signINForm) {
    signINForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = document.getElementById('login_email') ? document.getElementById('login_email').value : '';
      var password = document.getElementById('login_password') ? document.getElementById('login_password').value : '';
      postJSON(['/api/auth/login', '/api/auth/login.php'], {email: email, password: password})
      .then(function(res){
        if (res.ok) {
          var m = document.getElementById('accountModal'); if (m){m.classList.add('hidden');m.classList.remove('flex');}
          var user = res.data && res.data.user ? res.data.user : null;
          window.location.href = dashboardPath(user && user.role ? user.role : '');
        } else {
          alert(res.data && res.data.error ? res.data.error : 'Login failed');
        }
      }).catch(function(){alert('Network error')});
    });
  }
  function updateAuthUI(){
    fetchFirstOk(['/api/auth/me', '/api/auth/me.php'], {headers:{'Accept':'application/json'}})
      .then(function(r){return r.json()})
      .then(function(me){
        var ma=document.getElementById('manageAccount');var lo=document.getElementById('logoutLink');
        var mam=document.getElementById('manageAccountMobile');var lom=document.getElementById('logoutLinkMobile');
        var showAuth = me && me.authenticated;
        function show(el, v){ if(!el) return; if(v){el.classList.remove('hidden')} else {el.classList.add('hidden')} }
        if (showAuth){
          show(ma,false); show(lo,true);
          show(mam,false); show(lom,true);
        } else {
          show(ma,true); show(lo,false);
          show(mam,true); show(lom,false);
        }
      })
      .catch(function(){});
  }
  var lo=document.getElementById('logoutLink'); if(lo){lo.addEventListener('click',function(e){e.preventDefault();fetchFirstOk(['/api/auth/logout','/api/auth/logout.php']).then(function(){updateAuthUI()}).catch(function(){updateAuthUI()})})}
  var lom=document.getElementById('logoutLinkMobile'); if(lom){lom.addEventListener('click',function(e){e.preventDefault();fetchFirstOk(['/api/auth/logout','/api/auth/logout.php']).then(function(){updateAuthUI()}).catch(function(){updateAuthUI()})})}
  updateAuthUI();
})();




//scripts for page loader
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



    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        preloader.style.display = 'none';
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

// dynamic tutors for findtutor
(function(){
  var tutorsContainer = document.querySelector('.tutors');
  if (!tutorsContainer) return;
  fetch('/api/tutors.php', {headers:{'Accept':'application/json'}})
    .then(function(r){return r.ok?r.json():[]})
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
  function postJSON(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: {'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify(body)
    }).then(function(r){return r.json().then(function(d){return {ok:r.ok, data:d}})});
  }
  if (signUpForm) {
    signUpForm.addEventListener('submit', function(e){
      e.preventDefault();
      var fullName = document.getElementById('fullName') ? document.getElementById('fullName').value : '';
      var email = document.getElementById('signup_email') ? document.getElementById('signup_email').value : '';
      var password = document.getElementById('signup_password') ? document.getElementById('signup_password').value : '';
      postJSON('/api/auth/register.php', {fullName: fullName, email: email, password: password})
      .then(function(res){
        if (res.ok) {
          alert('Registration successful');
          var modal = document.getElementById('signUpModal'); if (modal){modal.classList.add('hidden');modal.classList.remove('flex');}
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
      postJSON('/api/auth/login.php', {email: email, password: password})
      .then(function(res){
        if (res.ok) {
          alert('Login successful');
          var modal = document.getElementById('signINModal'); if (modal){modal.classList.add('hidden');modal.classList.remove('flex');}
          updateAuthUI();
        } else {
          alert(res.data && res.data.error ? res.data.error : 'Login failed');
        }
      }).catch(function(){alert('Network error')});
    });
  }
  function updateAuthUI(){
    fetch('/api/auth/me.php',{headers:{'Accept':'application/json'}}).then(function(r){return r.json()}).then(function(me){
      var l1=document.getElementById('openLogin');var s1=document.getElementById('openSignup');var lo=document.getElementById('logoutLink');
      var l2=document.getElementById('openLoginMobile');var s2=document.getElementById('openSignupMobile');var lom=document.getElementById('logoutLinkMobile');
      var showAuth = me && me.authenticated;
      function show(el, v){ if(!el) return; if(v){el.classList.remove('hidden')} else {el.classList.add('hidden')} }
      if (showAuth){
        show(l1,false); show(s1,false); show(lo,true);
        show(l2,false); show(s2,false); show(lom,true);
      } else {
        show(l1,true); show(s1,true); show(lo,false);
        show(l2,true); show(s2,true); show(lom,false);
      }
    }).catch(function(){});
  }
  var lo=document.getElementById('logoutLink'); if(lo){lo.addEventListener('click',function(e){e.preventDefault();fetch('/api/auth/logout.php').then(function(){updateAuthUI()})})}
  var lom=document.getElementById('logoutLinkMobile'); if(lom){lom.addEventListener('click',function(e){e.preventDefault();fetch('/api/auth/logout.php').then(function(){updateAuthUI()})})}
  updateAuthUI();
})();




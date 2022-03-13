const userName = document.getElementById('name');
const password = document.getElementById('password');
const form = document.getElementById('form');
const errorElement = document.getElementById('error');
const rptPassword = document.getElementById('rpt_password');
const button = document.getElementById('Rbutton');


form.addEventListener('submit', (e) => {
    // console.log(e['submitter'].id)
    if (e['submitter'].id === 'Rbutton') {
        return;
    }
    let messages = []
    console.log(password.value);
    if (userName.value.length == 0) {
      messages.push('User Name must not be empty');
    }
    else if (password.value.length < 4) {
      messages.push('Password must be longer than 4 characters');
    }
  
    else if (password.value.length >= 20) {
      messages.push('Password must be less than 20 characters');
    }
  
    else if (password.value != rptPassword.value) {
      messages.push('Password not match');
    }
  
    if (messages.length > 0) {
      e.preventDefault();
      errorElement.innerText = messages.join(', ');
    }
  })

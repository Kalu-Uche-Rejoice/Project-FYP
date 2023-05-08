function registration(params) {
    //if the email contains @ cu.edu.ng then show the div for staff number
    var email =document.getElementById('email');
}


function test (){
    var submit = document.getElementById('submit')
    var email =document.getElementById('email');
    var password = document.getElementById('password');
    var matNo = document.getElementById('matricNo')
    var staffNo = document.getElementById('staffNo')
    const emailTest = 'cu.edu.ng'
    var validityTest = email.value.includes(emailTest)
    if (validityTest === false) {
      email.style.borderColor = 'red'
    } else if (password.value.length <8) {
      password.style.borderColor = 'red'
    }else{
      email.style.borderColor = 'gray'
      password.style.borderColor = 'gray';
      if (email.value.includes('stu.cu.edu.ng')) {
        matNo.style.display = "block"
      } else {
        staffNo.style.display = "block"
      }
      submit.classList.remove('disabled')
    }
  }
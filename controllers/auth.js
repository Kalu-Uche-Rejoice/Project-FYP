const firebase = require('../key.js');
exports.register = (req, res)=>{
    console.log(req.body)
    const user ={
        email : req.body.email,
        password: req.body.password
      }
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then((data)=>{
        console.log(data)
        return res.status(201).json(data);
        
    })
    .catch((error)=>{
        let errorCode = error.code;
        let errorMessage= error.message
        if (errorCode == 'auth/weak-pasword') {
            return res.status(500).json({error: errorMessage})
        }
        else{
               return res.status(500).json({error: errorMessage})
        }
    })
}

exports.signin = (req, res)=>{
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
    .then((user)=>{
        return res.status(200).json(user);
    })
    .catch((error)=>{
        let errorCode = error.code;
        let errorMessage= error.message
        if (errorCode) {
            return res.status(500).json({error: errorMessage})
        };
    })
}
exports.forgotpassword = (req, res)=>{
    firebase.auth().sendPasswordResetEmail(req.body.email)
    .then(()=>{
        res.status(200).json({status: "password reset email sent"})
    })
    .catch((error)=>{
        let errorCode = error.code;
        let errorMessage= error.message
        if (errorCode) {
            return res.status(500).json({error: errorMessage})
        };
    })
}
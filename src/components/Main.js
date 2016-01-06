require('normalize.css');
require('styles/App.css');

import React from 'react';
import Firebase from 'firebase';


let yeomanImage = require('../images/yeoman.png');

let ref = new Firebase("https://r-lift.firebaseio.com");
let CONFIG = {};

class AppComponent extends React.Component {

  constructor(){
    super();

    this.state = {
      auth : false
    }
  }

  componentDidMount(){
    console.log(Firebase);

    // on auth
    ref.onAuth((authData) => {
      console.log('on auth');
      if (authData) {
        this.setState({'auth' : true});

        CONFIG.authData = authData;
        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        ref.child("users").child(authData.uid).set({
          provider: authData.provider,
          name: authData.facebook.displayName
        });
      }
    });
  }

  fbLogin(){

    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  }

  addWorkout() {
    ref.child("users").child(CONFIG.authData.uid +'/workouts').push({
      label: 'Workout 1',
      exercises : [1,2,3,4,5]
    });
  }

  render() {

    let workoutBtn;
    if(this.state.auth){
      workoutBtn = <button onClick={ this.addWorkout }>add workout</button>;
    }
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
        <button onClick={ this.fbLogin }>Login with fb</button>

        {workoutBtn}

      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

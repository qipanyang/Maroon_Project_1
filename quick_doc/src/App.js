import React, { useState, useEffect} from 'react';
import "rbx/index.css";
import {Container,Title } from "rbx";
import firebase from 'firebase/app';
import 'firebase/database';
import Autocomplete from 'react-google-autocomplete';
import { makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import logo from './Images/insurance.png'
import Typography from '@material-ui/core/Typography';

import Background from './Images/background.jpg';
import Paper from '@material-ui/core/Paper';

import {FormControl, CardHeader, CardContent, CardMedia} from '@material-ui/core';



import {FilterMenu} from './filter.js';

const firebaseConfig = {
    apiKey: "AIzaSyCPlCnToFlfovuDUaAGesBUNLZw8DAxTnQ",
    authDomain: "quickdoc-8a808.firebaseapp.com",
    databaseURL: "https://quickdoc-8a808.firebaseio.com",
    projectId: "quickdoc-8a808",
    storageBucket: "quickdoc-8a808.appspot.com",
    messagingSenderId: "578559822014",
    appId: "1:578559822014:web:8e9fcfc524bea78ae4f6ef"
  };
  
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const googleKey = "AIzaSyCfjp7ZKwdAFhg773PBrwMinONqf_cGBlU";

// Won't be using this API for this slice, but for future reference if needed
// const docLocKey = 'e98def16c263c71592c3c2f74e24097a';
// const docLocUrl = 'https://api.betterdoctor.com/2016-03-01/doctors?location=37.773,-122.413,100&skip=2&limit=10&user_key=' + docLocKey;

const pageThreeStyles = makeStyles(theme => ({
 bio:{
   marginTop: 60,
   marginBottom: 10,
 },
 button:{
   marginTop: 20,
 },
 h3:{
   padding: '60 px',
   fontSize: 72,
 }
}));

const PageThree = ({pagestate,settingdoctor}) => {
  const classes = pageThreeStyles();
  var practicesSet = new Set();
  settingdoctor.doc.practices.map(practices=>practicesSet.add(practices.name));
  var insuranceSet = new Set();
  settingdoctor.doc.insurances.map(insurance=>insuranceSet.add(insurance.insurance_plan.name));
  return (
    <Container style={{marginLeft: 20, marginRight: 20}}>
    <div className={classes.bio}>
    <h3 style={{fontSize: 36, padding: '50 px', paddingTop: 40}}><strong>{settingdoctor.doc.profile.first_name + " " + settingdoctor.doc.profile.last_name}</strong></h3>
    <div style={{float: 'right'}}>
      <CardMedia><img src={settingdoctor.doc.profile.image_url}></img></CardMedia>
    </div>
    
    <p style={{marginTop: 140}}>
      <h5 style={{fontSize: 18, fontStyle: 'italic', marginBottom: 10}}>Biography</h5>
      <Divider/>
      {settingdoctor.doc.profile.bio}
    </p>

    <p style={{marginTop:60}}>
      <h5 style={{fontSize: 18, fontStyle: 'italic', marginBottom: 10}}>Practices</h5>
      <Divider/>
      {Array.from(practicesSet).map(practices =>
      <li>{practices}</li>
      )}
    </p>
    
    <p style={{marginTop:60}}>
      <h5 style={{fontSize: 18, fontStyle: 'italic', marginBottom: 10}}>Insurance Plans Taken</h5>
      <Divider/>
      {Array.from(insuranceSet).map(insurance =>
      <li>{insurance}</li>
      )}
    </p>

    <Button style={{margin: 40, float:'right'}} className={classes.button} variant="contained" color="primary" align="center" size="large" onClick={function(event){pagestate.setpage(2)}}>go back</Button>
    </div>
    </Container>
  )
}

const pageOneStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 25,
  },
  searchBar: {
    alignItems: "center",
    marginLeft: 50,
    paddingTop: 300,
    paddingBottom: 200,
    // backgroundColor: 'rgba(44, 45, 51, 0.3)',
    // backgroundSize: 'cover',
  },
  searchInput: {
    width: '70%', 
    height: 30,
    fontFamily: "Helvetica",
    fontSize: 16,
    marginTop: 30,
    paddingLeft: 15, 
  },
  logo: {
    width: 25,
    height: 25,
    marginLeft: 3,
    marginBottom: -3,
  },
  summary: {
    color: 'white',
    textAlign: "center",
  },
  button: {
    color: 'white',
  },
  background: {
    backgroundImage: `url(${Background})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    background: 'rgba(44, 45, 51, 0.3)',
  },
  overlay: {
    backgroundColor: 'rgba(44, 45, 51, 0.3)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }
}));


const Pageone = ({pagestate,jsonstate}) => {
  const switch_page = () => {
    pagestate.setpage(2)
  }

  const fetchjson = async (lat,long) => {
    const url = 'https://api.betterdoctor.com/2016-03-01/doctors?location='+ lat + ',' + long + ',100&skip=2&limit=10&user_key=e98def16c263c71592c3c2f74e24097a'
    const response = await fetch(url).then((response)=> response.json()).then((response)=> response.data);
    console.log(typeof(response))
    console.log(response)
    jsonstate.setjson(response);
  }

  const classes = pageOneStyles()

  const handleKeyPress =(event)=>{
    if(event.key === "Enter"){
      switch_page();
    }
  }

  return(
    <div className={classes.background}>
    <div className={classes.overlay}>
    <AppBar>
      <Typography variant="h6" className={classes.title} align="center">
        QuickDoc
        <img src={logo} className={classes.logo}/>
      </Typography>
    </AppBar>
    <Container className={classes.searchBar} align="center">
      <Typography variant="h5" className={classes.summary}>
          Information on local doctors at your fingertips.
      </Typography>
      <Autocomplete
          onKeyPress = {handleKeyPress}
          className={classes.searchInput}
          onPlaceSelected={(place) => {
            var lat = place.geometry.location.lat().toString();
            var lng = place.geometry.location.lng().toString();
            fetchjson(lat,lng)
          }}
          types={[]}
          componentRestrictions={{country: "usa"}}
      />
      <Button size = "large" onClick = {switch_page} className={classes.button}>
        Search
      </Button>
    </Container>
    </div>
    </div>
  )
}


const App =() => {

  const style ={
    marginTop: 40
  }
  const classes = pageOneStyles();
  const [page, setpage] = React.useState(1)
  const [json, setjson] = React.useState([]);
  const [doc,setdoc] = React.useState('');

  if (page === 1){
    return (
        <Pageone pagestate = {{page, setpage}} jsonstate={{json,setjson}} className={classes.pageone}/>
    );
  }
  else if (page == 2) {
    return (
      <Container>
        <FilterMenu pagestate = {{page,setpage}} jsonstate={{json,setjson}} settingdoctor = {{doc,setdoc}}/>
      </Container>
    );
  }
  else if (page == 3) {
    return (
      <Container>
        <AppBar>
          <Typography variant="h6" className={classes.title} align="center">
            QuickDoc
            <img src={logo} className={classes.logo}/>
          </Typography>
        </AppBar>
        <PageThree pagestate={{page,setpage}} settingdoctor = {{doc,setdoc}}/>
      </Container>
    );
  }
  
}


export default App;
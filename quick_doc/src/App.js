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
import logo from './insurance.png'
import Typography from '@material-ui/core/Typography';

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
 }
}));

const PageThree = ({pagestate,settingdoctor}) => {
  const classes = pageThreeStyles();
  var insuranceSet = new Set();
  settingdoctor.doc.insurances.map(insurance=>insuranceSet.add(insurance.insurance_plan.name))
  return (
    <Container>
    <AppBar>
          <Title align="center" >
            QuickDoc
          </Title>
    </AppBar>
    <div className={classes.bio}>
    <h3><strong>{settingdoctor.doc.profile.first_name + " " + settingdoctor.doc.profile.last_name}</strong></h3>
    
    <p>
      <Divider/>
      {settingdoctor.doc.profile.bio}
      <Divider/>
    </p>
    
    <h1>Insurance Taken:</h1>
    {Array.from(insuranceSet).map(insurance =>
      <li>{insurance}</li>
      )}
    <Button className={classes.button} variant="contained" color="primary" align="center" size="large" onClick={function(event){pagestate.setpage(2)}}>go back</Button>
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
    marginTop: 300,
    align: "center",
  },
  searchInput: {
    width: '70%', 
    height: 30,
    fontFamily: "Helvetica",
    fontSize: 16,
  },
  logo: {
    width: 25,
    height: 25,
    marginLeft: 3,
    marginBottom: -3,
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
    <Container className={classes.searchBar} align="center">
    <Autocomplete
        onKeyPress = {handleKeyPress}
        className={classes.searchInput}
        // style={{width: "70%", font:""}}
        onPlaceSelected={(place) => {
          var lat = place.geometry.location.lat().toString();
          var lng = place.geometry.location.lng().toString();
          fetchjson(lat,lng)
        }}
        types={[]}
        componentRestrictions={{country: "usa"}}
    />
    <Button size = "large" onClick = {switch_page}>
      Search
    </Button>
    </Container>
    
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
      <Container>
        <AppBar>
          <Typography variant="h6" className={classes.title} align="center">
            QuickDoc
            <img src={logo} className={classes.logo}/>
          </Typography>
        </AppBar>
        <Pageone pagestate = {{page, setpage}} jsonstate={{json,setjson}}/>
      </Container>
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
        <PageThree pagestate={{page,setpage}} settingdoctor = {{doc,setdoc}}/>
      </Container>
    );
  }
  
}


export default App;
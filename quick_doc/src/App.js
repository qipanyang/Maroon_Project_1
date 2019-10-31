import React, { useState, useEffect} from 'react';
import "rbx/index.css";
import {Container,Title } from "rbx";
import firebase from 'firebase/app';
import 'firebase/database';
import Autocomplete from 'react-google-autocomplete';
import Card from '@material-ui/core/Card';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';

import {FormControl, CardHeader, CardContent, CardMedia} from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import { sizing, spacing, positions } from '@material-ui/system';

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

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 'auto',
    height: 'auto',
  },
  gridListTile: {
    width: 'auto',
    height: 'auto',
    overflowY: 'auto',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
    width: 50,
    height: 50,
  },
  disclaimer:{
      marginBottom: 30,
  }
});

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    padding: 10,
    maxWidth: 345,
    marginTop: 20,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const pageThreeStyles = makeStyles(theme => ({
 bio:{
   marginTop: 20,
   marginBottom: 20,
 },
 button:{
   marginTop: 20,
 }
}));

const Pagetwo = ({pagestate,jsonstate,settingdoctor}) => {
  console.log(jsonstate.json)
  const doctors = jsonstate.json
  
  return (
    <div>
      {doctors.map((doctor) =>
        (<Card className={useStyles.card}>
          <h1><strong>{doctor.profile.first_name + " " + doctor.profile.last_name}</strong></h1>
          <CardMedia><img src={doctor.profile.image_url}></img></CardMedia>
          <CardContent>Located in {doctor.practices[0].visit_address.city + ", " + doctor.practices[0].visit_address.state}
          <Button size="large" onClick={function(event){settingdoctor.setdoc(doctor);pagestate.setpage(3)}}>View Doctor Bio</Button>
          </CardContent>
        </Card>))}
     </div>
  );
}

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
    <div>
    <h3><strong>{settingdoctor.doc.profile.first_name + " " + settingdoctor.doc.profile.last_name}</strong></h3>
    
    <p className={classes.bio}>
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
}));

const Pageone = ({pagestate,jsonstate}) => {
  const switch_page = () => {
    pagestate.setpage(2)
  }

  const fetchjson = async (lat,long) => {
    const url = 'https://api.betterdoctor.com/2016-03-01/doctors?location='+ lat + ',' + long + ',100&skip=2&limit=10&user_key=e98def16c263c71592c3c2f74e24097a'
    const response = await fetch(url).then((response)=> response.json()).then((response)=> response.data);
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
  const [json, setjson] = React.useState({meta: {}, data: []});
  const [doc,setdoc] = React.useState('');

  if (page === 1){
    return (
      <Container>
        <AppBar>
          <Title align="center" className={classes.title}>
            QuickDoc
          </Title>
        </AppBar>
        <Pageone pagestate = {{page, setpage}} jsonstate={{json,setjson}}/>
      </Container>
    );
  }
  else if (page == 2) {
    return (
      <Container>
        <FilterMenu pagestate = {{page,setpage}} doctors={json} settingdoctor = {{doc,setdoc}}/>
      </Container>
    );
  }
  else if (page == 3) {
    return (
<<<<<<< HEAD
        
        <PageThree pagestate={{page,setpage}} doctors={json.data} settingdoctor = {{doc,setdoc}}/>
=======
      <Container>
        <Title align="center" style = {style}>
          QuickDoc
        </Title>
        <PageThree pagestate={{page,setpage}} jsonstate={{json,setjson}} settingdoctor = {{doc,setdoc}}/>
      </Container>
>>>>>>> dc152fb0a9f083d654d9bdad860c2ee28fb7dadb
    );
  }
  
}
/*
old grid tile code
    // <FilterMenu/>
    <div className={styles.root}>
      <GridList cellHeight={'auto'} cellWidth={50} className={styles.gridList}>
        <GridListTile key="Subheader" cols={2}>
          <ListSubheader component="h1">Here is your list of Doctors</ListSubheader>
        </GridListTile>
        {doctors.map(doctor => (
          <GridListTile key={doctor.profile.image_url}>
            <img src={doctor.profile.image_url}/>
            <GridListTileBar
              title={doctor.profile.first_name+ " " + doctor.profile.last_name}
              subtitle={<span>{doctor.profile.title}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${doctor.profile.first_name}`} onClick={function(event){settingdoctor.setdoc(doctor.profile);pagestate.setpage(3)}} className={styles.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
*/

export default App;
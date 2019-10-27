import React, { useState, useEffect} from 'react';
import "rbx/index.css";
import {Container,Title } from "rbx";
import firebase from 'firebase/app';
import 'firebase/database';
import Autocomplete from 'react-google-autocomplete';

import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import AppBar from '@material-ui/core/AppBar';

import {FormControl, CardHeader, CardContent, CardMedia} from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import { sizing, spacing, positions } from '@material-ui/system';
import Card from '@material-ui/core/Card';

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

const PageThree = ({pagestate,settingdoctor}) => {
  var insuranceSet = new Set();
  settingdoctor.doc.insurances.map(insurance=>insuranceSet.add(insurance.insurance_plan.name))
  return (
    <div>
    <h3><strong>{settingdoctor.doc.profile.first_name + " " + settingdoctor.doc.profile.last_name}</strong></h3>
    <h1>Insurance Taken:</h1>
    {Array.from(insuranceSet).map(insurance =>
      <li>{insurance}</li>
      )}
    <p>{settingdoctor.doc.profile.bio}</p>
    <Button align="center" size="large" onClick={function(event){pagestate.setpage(2)}}>go back</Button>
    </div>
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

const Pageone = ({pagestate, coordinatestate}) => {
  const switch_page = () => {
    pagestate.setpage(2)
  }
  const set_coordinates = (lat, long) => {
    coordinatestate.setcoordinates(lat + "," + long)
  }
  const classes = pageOneStyles()

  return(
    <Container className={classes.searchBar} align="center">
    <Autocomplete
        className={classes.searchInput}
        // style={{width: "70%", font:""}}
        onPlaceSelected={(place) => {
          var lat = place.geometry.location.lat().toString();
          var lng = place.geometry.location.lng().toString();
          set_coordinates(lat, lng);
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
  const [coordinates, setcoordinates] = React.useState("")
  const [json, setjson] = React.useState({meta: {}, data: []});
  const [doc,setdoc] = React.useState('');
  const url = 'apiData/exampleData.json'
  //const url = 'https://api.betterdoctor.com/2016-03-01/doctors?location='+ coordinates.lat + coordinates.lng + '100&skip=2&limit=10&user_key=e98def16c263c71592c3c2f74e24097a';

  useEffect(() => {
    const fetchjson = async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setjson(json);
    }
    fetchjson();
  }, [])

  if (page === 1){
    return (
      <Container>
        <AppBar>
          <Title align="center" className={classes.title}>
            QuickDoc
          </Title>
        </AppBar>
        <Pageone pagestate = {{page, setpage}} coordinatestate = {{coordinates, setcoordinates}}/>
      </Container>
    );
  }
  else if (page == 2) {
    return (
      <Container>
        <FilterMenu pagestate = {{page,setpage}} doctors={json.data} settingdoctor = {{doc,setdoc}}/>
      </Container>
    );
  }
  else if (page == 3) {
    return (
      <Container>
        <Title align="center" style = {style}>
          QuickDoc
        </Title>
        <PageThree pagestate={{page,setpage}} doctors={json.data} settingdoctor = {{doc,setdoc}}/>
      </Container>
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
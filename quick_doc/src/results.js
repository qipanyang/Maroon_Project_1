import React from 'react'
import Box from '@material-ui/core/Box';
import { sizing, spacing, positions } from '@material-ui/system';
import Card from '@material-ui/core/Card';
// import { Typography } from 'material-ui/styles';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TypoGraphy from '@material-ui/core/Typography';

// list of symptoms "selected"
// diagnosis w/ accuracy + doctor type
// list of doctors in area

const styles = theme => ({
    card: {
        padding: 10,
        width: "50%",
        marginTop: 20,
    },

    disclaimer:{
        marginBottom: 30,
    }
});

class Result extends React.Component {
  render() {
    const { classes } = this.props;

    return (
            <Grid container>
                <Grid item xs={6}>
                <Grid container direction="column" spacing={3}>
                <TypoGraphy variant="h5">{"Your Results"}</TypoGraphy>
                
                <Grid item>
                <strong>Your symptoms entered:</strong>
                <ul>
                    <li>- fever</li>
                    <li>- sneezing</li>
                </ul>
                </Grid>
                
                <Grid item>
                <strong>60% Accuracy: Common Cold</strong>
                </Grid>
                
                <Grid item>
                <h5>A <strong>general practitioner</strong> would be a good first stop.</h5>
                </Grid>
                
                
                </Grid >
                </Grid>

                <Grid item xs={6}>
                <Grid container direction="column" spacing={2}>
                <TypoGraphy variant="h5">{"General Practitioners in Your Area"}</TypoGraphy>
                
                <Grid item>
                <strong>Evanston, IL</strong>
                
                <Box className={classes.box}>
                <Card className={classes.card}>
                    <div>
                    <h5><strong>Northwestern University Health Services</strong></h5>
                    <h5>635 Emerson St</h5>
                    <h5>Evanston, IL</h5>
                    <h5>(123) 123 - 1234</h5>
                    <h5>8 am - 6 pm Mon - Fri</h5>
                    </div>
                </Card>

                <Card className={classes.card}>
                    <h5><strong>Dr. Sally John, M.D.</strong></h5>
                    <h5>General Practitioner</h5>
                    <h5>2305 Sheridan Rd</h5>
                    <h5>Evanston, IL</h5>
                    <h5>(111) 222 - 3333</h5>
                    <h5>9 am - 5 pm Mon - Fri</h5>
                </Card>

                <Card className={classes.card}>
                    <h5><strong>Dr. Joe Steve, M.D.</strong></h5>
                    <h5>General Practitioner</h5>
                    <h5>1234 Davis St</h5>
                    <h5>Evanston, IL</h5>
                    <h5>(444) 222 - 1111</h5>
                    <h5>9 am - 5 pm Mon - Sat</h5>
                </Card>
                </Box>
                </Grid>
                
                <Grid item className={classes.disclaimer}>
                <p><strong>A reminder:</strong> QuickDoc is not a professional opinion and is merely intended to provide possible insight. Always go see a health care professional. If symptoms are severe, call 911 for help.</p>
                </Grid>
                </Grid>
                </Grid>
            </Grid>

    )
  }
}


Result.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Result);
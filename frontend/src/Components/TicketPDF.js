import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const TicketPDF = ({ bookingDetails }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.websiteName}>TrainEase</Text>
          <View style={styles.details}>
            <View style={styles.detail}>
              <Text style={styles.label}>User</Text>
              <Text style={styles.value}>{bookingDetails.username}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.label}>Train</Text>
              <Text style={styles.value}>{bookingDetails.train_name}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.label}>Departure Station & Time</Text>
              <Text style={styles.value}>{bookingDetails.start_st} | {bookingDetails.start_time}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.label}>Destination Station & Time</Text>
              <Text style={styles.value}>{bookingDetails.end_st} | {bookingDetails.end_time}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.label}>Departure Date</Text>
              <Text style={styles.value}>{bookingDetails.departure_date}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.label}>Class Type</Text>
              <Text style={styles.value}>{bookingDetails.class_type}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.label}>Number of Seats</Text>
              <Text style={styles.value}>{bookingDetails.seats}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.label}>Total Price</Text>
              <Text style={styles.value}>{bookingDetails.seats * bookingDetails.price}</Text>
            </View>
          </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  websiteName: {
    fontSize: "25px",
    marginTop: "40px",
    fontWeight: 'bold',
    textAlign: "center"
  },
  details: {
    justifyContent: "center",
    margin: "20px",
    flexDirection: 'column',
    width: '500px'
  },
  detail: {
    marginLeft: "30px",
    marginBottom: "10px"
  },
  label: {
    fontSize: "12px"
  },
  value: {
    fontSize: "15px"
  }
});

export default TicketPDF;

import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomButton from '../../components/customButton';

const STAR = '\u2605';

const getDeliveryText = (deliveryValue) => {
  if (typeof deliveryValue === 'boolean') {
    return deliveryValue ? 'Yes' : 'No';
  }

  return String(deliveryValue).toLowerCase() === 'yes' ? 'Yes' : 'No';
};

export default function PostChoiceScreen({ navigation, route }) {
  const { chosenRestaurant } = route.params ?? {};

  const handleOpenWebsite = async () => {
    if (!chosenRestaurant?.website) {
      return;
    }

    const targetUrl = chosenRestaurant.website.startsWith('http')
      ? chosenRestaurant.website
      : `https://${chosenRestaurant.website}`;

    const canOpen = await Linking.canOpenURL(targetUrl);

    if (canOpen) {
      Linking.openURL(targetUrl);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headline}>Enjoy your meal!</Text>

      <View style={styles.detailsBox}>
        <Text style={styles.restaurantName}>{chosenRestaurant?.name}</Text>

        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cuisine: </Text>
          <Text>{chosenRestaurant?.cuisine}</Text>
        </Text>
        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price: </Text>
          <Text>{'$'.repeat(Number(chosenRestaurant?.price) || 0)}</Text>
        </Text>
        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>Rating: </Text>
          <Text>{STAR.repeat(Number(chosenRestaurant?.rating) || 0)}</Text>
        </Text>
        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone: </Text>
          <Text>{chosenRestaurant?.phone}</Text>
        </Text>
        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address: </Text>
          <Text>{chosenRestaurant?.address}</Text>
        </Text>
        <Text
          onPress={handleOpenWebsite}
          style={[styles.detailRow, styles.websiteValue]}
        >
          <Text style={styles.detailLabel}>Website: </Text>
          <Text>{chosenRestaurant?.website}</Text>
        </Text>
        <Text style={styles.detailRow}>
          <Text style={styles.detailLabel}>Delivery: </Text>
          <Text>{getDeliveryText(chosenRestaurant?.delivery)}</Text>
        </Text>
      </View>

      <CustomButton
        onPress={() => navigation.popToTop()}
        text="All Done"
        width="94%"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  detailRow: {
    fontSize: 17,
    marginTop: 12,
  },
  detailsBox: {
    borderColor: '#c0c0c0',
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 24,
    padding: 20,
    width: '94%',
  },
  headline: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: 'center',
  },
  restaurantName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  websiteValue: {
    color: '#0b66c3',
  },
});

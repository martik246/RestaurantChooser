import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomButton from '../../components/customButton';

const STAR = '\u2605';

const getRandom = (min, max) => {
  const adjustedMin = Math.ceil(min);
  const adjustedMax = Math.floor(max);
  return Math.floor(Math.random() * (adjustedMax - adjustedMin + 1)) + adjustedMin;
};

const getDeliveryLabel = (deliveryValue) => {
  if (typeof deliveryValue === 'boolean') {
    return deliveryValue ? 'DOES' : 'DOES NOT';
  }

  return String(deliveryValue).toLowerCase() === 'yes' ? 'DOES' : 'DOES NOT';
};

export default function ChoiceScreen({ navigation, route }) {
  const initialParticipants = route.params?.participants ?? [];
  const initialRestaurants = route.params?.restaurants ?? [];

  const [participants, setParticipants] = useState(initialParticipants);
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [chosenRestaurant, setChosenRestaurant] = useState(null);
  const [selectedVisible, setSelectedVisible] = useState(false);
  const [vetoVisible, setVetoVisible] = useState(false);

  const availableVetoParticipants = useMemo(
    () => participants.filter((participant) => participant.vetoed === 'no'),
    [participants]
  );

  const vetoDisabled = !availableVetoParticipants.length;
  const vetoText = vetoDisabled ? 'No Vetoes Left' : 'Veto';

  const selectRandomRestaurant = () => {
    if (!restaurants.length) {
      Alert.alert('No Restaurants Left', 'There are no restaurants left to choose from.');
      return;
    }

    // Pick a random restaurant only from the already filtered candidate list.
    const selectedIndex = getRandom(0, restaurants.length - 1);
    const selectedRestaurant = restaurants[selectedIndex];

    setChosenRestaurant(selectedRestaurant);
    setSelectedVisible(true);
  };

  const handleAccept = () => {
    if (!chosenRestaurant) {
      return;
    }

    // Close the modal first so the final screen is not hidden behind it on web.
    setSelectedVisible(false);

    setTimeout(() => {
      navigation.navigate('PostChoiceScreen', {
        chosenRestaurant,
      });
    }, 0);
  };

  const handleVetoPress = () => {
    setSelectedVisible(false);
    setVetoVisible(true);
  };

  const handleVetoBy = (person) => {
    // Mark the selected participant as someone who has already used a veto.
    const updatedParticipants = participants.map((participant) => (
      participant.key === person.key
        ? { ...participant, vetoed: 'yes' }
        : participant
    ));

    // Remove the vetoed restaurant so it cannot be selected again later.
    const updatedRestaurants = restaurants.filter(
      (restaurant) => restaurant?.key !== chosenRestaurant?.key
    );

    const stillCanVeto = updatedParticipants.some((participant) => participant.vetoed === 'no');

    setParticipants(updatedParticipants);
    setRestaurants(updatedRestaurants);
    setVetoVisible(false);
    setSelectedVisible(false);

    if (!updatedRestaurants.length) {
      Alert.alert(
        'No Restaurants Left',
        'Every available restaurant has been removed from consideration.'
      );
      navigation.popToTop();
      return;
    }

    if (updatedRestaurants.length === 1) {
      navigation.navigate('PostChoiceScreen', {
        chosenRestaurant: updatedRestaurants[0],
      });
      return;
    }

    if (!stillCanVeto) {
      const fallbackRestaurant = updatedRestaurants[getRandom(0, updatedRestaurants.length - 1)];

      navigation.navigate('PostChoiceScreen', {
        chosenRestaurant: fallbackRestaurant,
      });
      return;
    }

    Alert.alert(
      'Veto Registered',
      `${person.firstName} vetoed ${chosenRestaurant?.name}. Choose again from the remaining restaurants.`
    );
  };

  const renderParticipant = ({ item }) => (
    <View style={styles.choiceScreenListItem}>
      <Text style={styles.choiceScreenListItemName}>
        {item.firstName} {item.lastName} ({item.relationship})
      </Text>
      <Text>Vetoed: {item.vetoed || 'no'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Choice Screen</Text>

      <FlatList
        data={participants.filter(Boolean)}
        keyExtractor={(item) => item.key}
        renderItem={renderParticipant}
        style={styles.choiceScreenListContainer}
      />

      <CustomButton
        onPress={selectRandomRestaurant}
        text="Randomly Choose"
        width="94%"
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={selectedVisible}
      >
        {chosenRestaurant ? (
          <View style={styles.selectedContainer}>
            <View style={styles.selectedInnerContainer}>
              <Text style={styles.selectedName}>{chosenRestaurant.name}</Text>
              <View style={styles.selectedDetails}>
                <Text style={styles.selectedDetailsLine}>
                  This is a {STAR.repeat(Number(chosenRestaurant.rating) || 0)} star
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  {chosenRestaurant.cuisine} restaurant
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  with a price rating of {'$'.repeat(Number(chosenRestaurant.price) || 0)}
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  that {getDeliveryLabel(chosenRestaurant.delivery)} deliver
                </Text>
              </View>

              <CustomButton
                onPress={handleAccept}
                text="Accept"
                width="94%"
              />
              <CustomButton
                buttonStyle={styles.vetoButton}
                disabled={vetoDisabled}
                onPress={handleVetoPress}
                text={vetoText}
                width="94%"
              />
            </View>
          </View>
        ) : (
          <View style={styles.selectedContainer}>
            <Text>No restaurant selected.</Text>
          </View>
        )}
      </Modal>

      <Modal
        animationType="slide"
        onRequestClose={() => {}}
        transparent={false}
        visible={vetoVisible}
      >
        <View style={styles.vetoContainer}>
          <View style={styles.vetoContainerInner}>
            <Text style={styles.vetoHeadline}>Who is vetoing?</Text>
            <ScrollView style={styles.vetoScrollViewContainer}>
              {availableVetoParticipants.map((participant) => (
                <TouchableOpacity
                  key={participant.key}
                  onPress={() => handleVetoBy(participant)}
                  style={styles.vetoParticipantContainer}
                >
                  <Text style={styles.vetoParticipantName}>
                    {participant.firstName} {participant.lastName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.vetoButtonContainer}>
              <CustomButton
                onPress={() => {
                  setVetoVisible(false);
                  setSelectedVisible(true);
                }}
                text="Never Mind"
                width="94%"
              />
              <CustomButton
                buttonStyle={styles.secondaryButton}
                onPress={() => {
                  setVetoVisible(false);
                  setSelectedVisible(false);
                  navigation.popToTop();
                }}
                text="Main Menu"
                width="94%"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  choiceScreenListContainer: {
    width: '94%',
  },
  choiceScreenListItem: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    marginBottom: 4,
    marginTop: 4,
    paddingBottom: 10,
    paddingTop: 10,
  },
  choiceScreenListItemName: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
  headline: {
    fontSize: 30,
  },
  selectedContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  selectedDetails: {
    alignItems: 'center',
    paddingBottom: 80,
    paddingTop: 80,
  },
  selectedDetailsLine: {
    fontSize: 18,
  },
  selectedInnerContainer: {
    alignItems: 'center',
  },
  selectedName: {
    fontSize: 32,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    marginTop: 12,
  },
  vetoButton: {
    marginTop: 12,
  },
  vetoButtonContainer: {
    alignItems: 'center',
    paddingTop: 40,
    width: '100%',
  },
  vetoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  vetoContainerInner: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vetoHeadline: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vetoParticipantContainer: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  vetoParticipantName: {
    fontSize: 24,
  },
  vetoScrollViewContainer: {
    height: '50%',
    marginTop: 20,
  },
});

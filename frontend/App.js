import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health'

/* Permission options */
const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
}

AppleHealthKit.initHealthKit(permissions, error => {
  /* Called after we receive a response from the system */

  if (error) {
    console.log('[ERROR] Cannot grant permissions!')
  }

  /* Can now read or write to HealthKit */

  let options = {
    startDate: new Date(2021, 0, 0).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
    limit: 10, // optional; default no limit
    ascending: true, // optional; default false
  }
  AppleHealthKit.getSleepSamples(options, (err, results) => {
    if (err) {
      return;
    }
    console.log(results)
  }
  );
})

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

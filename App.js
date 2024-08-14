// App.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Game from './Game';




const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Game />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default App;

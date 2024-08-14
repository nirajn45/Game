// src/Game.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import Sound from 'react-native-sound';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, useAnimatedGestureHandler } from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const fruits = [
  require('./assets/apple.png'),
  require('./assets/banana.jpeg'),
  require('./assets/orange.jpeg'),
];

const Game = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const basketPosition = useSharedValue((width / 2) - 50);
  const fruitPosition = useSharedValue({ x: Math.random() * (width - 50), y: -50 });
  const fruitIndex = Math.floor(Math.random() * fruits.length);

  useEffect(() => {
    const interval = setInterval(() => {
      fruitPosition.value = { x: Math.random() * (width - 50), y: -50 };
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fruitPosition.value = withTiming({ x: fruitPosition.value.x, y: height - 150 }, { duration: 3000 });
    }, 1000);

    return () => clearInterval(interval);
  }, [fruitPosition]);

  const playSound = () => {
    const catchSound = new Sound('catch.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      catchSound.play();
    });
  };

  const panGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      basketPosition.value = event.translationX + (width / 2) - 50;
    },
  });

  const basketStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: basketPosition.value }],
    };
  });

  const fruitStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: fruitPosition.value.x }, { translateY: fruitPosition.value.y }],
    };
  });

  useEffect(() => {
    const checkCollision = () => {
      if (
        fruitPosition.value.y > height - 200 &&
        fruitPosition.value.x > basketPosition.value - 50 &&
        fruitPosition.value.x < basketPosition.value + 100
      ) {
        setScore(score + 1);
        playSound();
        fruitPosition.value = { x: Math.random() * (width - 50), y: -50 };
      } else if (fruitPosition.value.y > height - 50) {
        setGameOver(true);
      }
    };

    const interval = setInterval(checkCollision, 100);
    return () => clearInterval(interval);
  }, [fruitPosition, basketPosition]);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    fruitPosition.value = { x: Math.random() * (width - 50), y: -50 };
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Catch the Fruit!</Text>
      <Text style={styles.score}>Score: {score}</Text>
      {gameOver ? (
        <TouchableOpacity onPress={resetGame} style={styles.restartButton}>
          <Text style={styles.restartButtonText}>Restart</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Animated.Image source={fruits[fruitIndex]} style={[styles.fruit, fruitStyle]} />
          <PanGestureHandler onGestureEvent={panGestureEvent}>
            <Animated.View style={[styles.basket, basketStyle]}>
              <Image source={require('./assets/basket.jpeg')} style={styles.basketImage} />
            </Animated.View>
          </PanGestureHandler>
        </>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    color: '#343a40',
  },
  score: {
    fontSize: 24,
    marginBottom: 20,
    color: '#495057',
  },
  restartButton: {
    padding: 20,
    backgroundColor: '#007bff',
    borderRadius: 10,
  },
  restartButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  fruit: {
    width: 50,
    height: 50,
    position: 'absolute',
  },
  basket: {
    width: 100,
    height: 100,
    position: 'absolute',
    bottom: 50,
  },
  basketImage: {
    width: 100,
    height: 100,
  },
});

export default Game;

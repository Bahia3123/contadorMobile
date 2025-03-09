import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createStore } from 'redux';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ícones modernos

// Actions
const START = 'START';
const STOP = 'STOP';
const RESET = 'RESET';
const TICK = 'TICK';
const SET_TIME = 'SET_TIME';
const INCREMENT_TIME = 'INCREMENT_TIME';
const DECREMENT_TIME = 'DECREMENT_TIME';

const start = () => ({ type: START });
const stop = () => ({ type: STOP });
const reset = () => ({ type: RESET });
const tick = () => ({ type: TICK });
const setTime = (hours, minutes, seconds) => ({ type: SET_TIME, payload: { hours, minutes, seconds } });
const incrementTime = () => ({ type: INCREMENT_TIME });
const decrementTime = () => ({ type: DECREMENT_TIME });

// Reducer
const initialState = { hours: 0, minutes: 0, seconds: 0, running: false };
const timerReducer = (state = initialState, action) => {
  switch (action.type) {
    case START:
      return { ...state, running: true };
    case STOP:
      return { ...state, running: false };
    case RESET:
      return { hours: 0, minutes: 0, seconds: 0, running: false };
    case SET_TIME:
      return { ...state, ...action.payload, running: false };
    case TICK:
      if (!state.running) return state;
      let { hours, minutes, seconds } = state;
      if (hours === 0 && minutes === 0 && seconds === 0) {
        return { ...state, running: false }; // Para quando chegar a zero
      }
      if (seconds === 0) {
        if (minutes === 0) {
          hours--;
          minutes = 59;
        } else {
          minutes--;
        }
        seconds = 59;
      } else {
        seconds--;
      }
      return { hours, minutes, seconds, running: true };
    case INCREMENT_TIME:
      return { ...state, seconds: state.seconds + 10 };
    case DECREMENT_TIME:
      if (state.seconds > 0) {
        return { ...state, seconds: state.seconds - 10 };
      }
      return state;
    default:
      return state;
  }
};

const store = createStore(timerReducer);

// Timer Component
const Timer = () => {
  const { hours, minutes, seconds, running } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [inputHours, setInputHours] = useState('0');
  const [inputMinutes, setInputMinutes] = useState('0');
  const [inputSeconds, setInputSeconds] = useState('0');

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => dispatch(tick()), 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (num) => String(num).padStart(2, '0');

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={inputHours}
          onChangeText={setInputHours}
          placeholder="HH"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={inputMinutes}
          onChangeText={setInputMinutes}
          placeholder="MM"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={inputSeconds}
          onChangeText={setInputSeconds}
          placeholder="SS"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => dispatch(setTime(parseInt(inputHours) || 0, parseInt(inputMinutes) || 0, parseInt(inputSeconds) || 0))}>
          <Text style={styles.buttonText}>Definir Time</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => dispatch(running ? stop() : start())}>
          <Text style={styles.buttonText}>{running ? "Pausar" : "Iniciar"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => dispatch(reset())}>
          <Text style={styles.buttonText}>Resetar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.adjustContainer}>
        <TouchableOpacity style={styles.adjustButton} onPress={() => dispatch(incrementTime())}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.adjustButton} onPress={() => dispatch(decrementTime())}>
          <Icon name="minus" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Tela 1 - Tema Claro
const ScreenOne = ({ navigation }) => (
  <View style={styles.screenLight}>
    <Timer />
    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ScreenTwo')}>
      <Text style={styles.navButtonText}>Ir para Tela 2</Text>
    </TouchableOpacity>
  </View>
);

// Tela 2 - Tema Escuro
const ScreenTwo = ({ navigation }) => (
  <View style={styles.screenDark}>
    <Timer />
    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ScreenOne')}>
      <Text style={styles.navButtonText}>Ir para Tela 1</Text>
    </TouchableOpacity>
  </View>
);

const Stack = createStackNavigator();

const App = () => (
  <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ScreenOne" component={ScreenOne} options={{ title: 'Tela 1' }} />
        <Stack.Screen name="ScreenTwo" component={ScreenTwo} options={{ title: 'Tela 2' }} />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>
);

const styles = StyleSheet.create({
  timerContainer: { alignItems: 'center', margin: 20 },
  timerText: { fontSize: 72, fontWeight: 'bold', marginBottom: 20, color: '#fff' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { 
    borderWidth: 1, 
    borderColor: '#fff', 
    padding: 12, 
    margin: 5, 
    width: 60, 
    textAlign: 'center', 
    fontSize: 20, 
    borderRadius: 10, 
    backgroundColor: '#333', 
    color: '#fff' 
  },
  buttonContainer: { marginVertical: 20 },
  button: { 
    backgroundColor: '#2196F3', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    marginBottom: 10, 
    borderRadius: 30, 
    width: 200, 
    alignItems: 'center' 
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  adjustContainer: { flexDirection: 'row', marginBottom: 20 },
  adjustButton: { 
    backgroundColor: '#4CAF50', 
    padding: 10, 
    marginHorizontal: 10, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  // Tela 1 - Tema Claro
  screenLight: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#A52A2A' },
  // Tela 2 - Tema Escuro
  screenDark: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#333' },
  navButton: { 
    marginTop: 20, 
    backgroundColor: '#2196F3', 
    paddingVertical: 12, 
    paddingHorizontal: 40, 
    borderRadius: 30, 
    width: 200, 
    alignItems: 'center' 
  },
  navButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default App;

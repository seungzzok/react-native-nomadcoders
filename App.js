import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { colors } from "./theme";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState([]);

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (e) => setText(e);
  const saveToDos = async (toSave) => [
    await AsyncStorage.setItem("@toDos", JSON.stringify(toSave)),
  ];
  const loadToDo = async () => {
    const s = await AsyncStorage.getItem("@toDos");
    setToDos(JSON.parse(s));
  };
  const addToDo = async () => {
    if (text === "") return;
    const newToDos = [...toDos, { id: Date.now(), text: text, work: working }];
    setToDos(newToDos);
    saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = async (id) => {
    Alert.alert("삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          const newToDos = toDos.filter((el) => el.id !== id);
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  useEffect(() => {
    loadToDo();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnTxt, color: working ? "white" : colors.gray }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnTxt,
              color: !working ? "white" : colors.gray,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={styles.input}
          value={text}
          placeholder={working ? "Add a to do" : "Where do you want to go?"}
          onChangeText={onChangeText}
          onSubmitEditing={addToDo}
        />

        <ScrollView style={styles.toDos}>
          {toDos
            .filter((el) => el.work === working)
            .map((el, idx) => (
              <View key={el.id} style={styles.toDo}>
                <Text style={styles.toDoTxt}>{el.text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(el.id)}>
                  <MaterialIcons name="cancel" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnTxt: {
    fontSize: 28,
    fontWeight: 600,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  toDos: {},
  toDo: {
    backgroundColor: colors.toDoBg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 8,
    borderRadius: 10,
  },
  toDoTxt: {
    color: "white",
    fontSize: 16,
  },
});

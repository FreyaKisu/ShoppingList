import React from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet
} from "react-native";
import { SQLite } from "expo";

const db = SQLite.openDatabase("shoppingdb.db");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", amount: "", items: [] };
  }

  componentDidMount() {
    // Create shopping items table
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, amount text, name text);"
      );
    });
    this.updateList();
  }

  saveItem = () => {
    db.transaction(
      tx => {
        tx.executeSql("insert into items (amount, name) values (?, ?)", [
          this.state.amount,
          this.state.name
        ]);
      },
      null,
      this.updateList
    );
  };

  updateList = () => {
    db.transaction(tx => {
      tx.executeSql("select * from items", [], (_, { rows }) =>
        this.setState({ items: rows._array })
      );
    });
  };

  deleteItem = id => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from items where id = ?;`, [id]);
      },
      null,
      this.updateList
    );
  };

  listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  buttonClear = () => {
    this.setState({ inputOne: "", items: [] });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 70
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            style={{ width: 200, borderColor: "gray", borderWidth: 1 }}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
          />
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            style={{ width: 200, borderColor: "gray", borderWidth: 1 }}
            onChangeText={amount => this.setState({ amount })}
            value={this.state.amount}
          />
        </View>
        <View
          style={{
            flex: 1,
            width: 150,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-around",
            padding: 20
          }}
        >
          <View style={styles.buttonContainer}>
            <Button onPress={this.saveItem} title="Add" />
            <Button onPress={this.buttonClear} title="Clear list" />
          </View>
          <Text
            style={{
              margin: 10,
              fontSize: 20,
              flex: 1,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-around"
            }}
          >
            Shopping List
          </Text>
        </View>
        <FlatList
          style={{ marginLeft: "5%" }}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.listcontainer}>
              <Text style={{ fontSize: 18 }}>
                {item.name}, {item.amount}{" "}
              </Text>
              <Text
                style={{ fontSize: 18, color: "#0000ff" }}
                onPress={() => this.deleteItem(item.id)}
              >
                Bought
              </Text>
            </View>
          )}
          data={this.state.items}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  buttonContainer: {
    width: 200,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    padding: 20
  },
  listcontainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center"
  }
});

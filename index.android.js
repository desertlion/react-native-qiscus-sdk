/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
//Row Components
import Row from './Row';

// React native qiscus sdk bridge
// method : login(email, username, avatarLink, successCallback)
//          startChat(email, title)
const Qiscuss = NativeModules.MyChatModule;

export default class nativechat extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource: ds,
    };
  
    // Build Up Dummy Sections Header
    this.data = {};
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    alphabet.map((_,index) => {
      const currentChar = alphabet[index];
      this.data[currentChar] = [];
    });

  }


  async componentWillMount() {
    // Fetching random contacts data
    const response = await fetch('https://randomuser.me/api/?results=100&inc=name,picture,email');
    if (response.status === 200) {
      const data = await response.json();
      // Generate Row Data for each data in results
      data.results.map((value) => this.processData(value));
    }
  }


  renderRow(rowData) {
    return (
      <TouchableOpacity onPress={() => Qiscuss.startChat(rowData.email, rowData.username)}>
        <Row {...rowData} />
      </TouchableOpacity>
    )
  }

  //row data builder
  async processData(data) {
    const email = data.email;
    const username = `${data.name.first} ${data.name.last}`;
    const firstChar = username.toUpperCase()[0];
    const avatar = data.picture.large;
    Qiscuss.login(email, username, avatar, (email, username, avatar) => {
      if (!this.data[firstChar]) { 
        return;
      }
      else{
        this.data[firstChar].push({email, username, avatar});

        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(this.data),
        })
      }
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Contacts</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={(sectionData,character) => <Text style={{ fontSize: 18 }}>{character}</Text>}
          enableEmptySections
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  header: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#7899dd',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerText:{
    fontSize: 22,
    fontWeight: '400',
    color: '#fff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('nativechat', () => nativechat);

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './login';
import Main from './Main';
import MyFlow from './myApp/myFlow';
import AllFlow from './myApp/allFlow';
import Leave from './myApp/leave';
import Apply from './myApp/apply';
import Apro from './myApp/apro';
import FlowDetail from './myApp/flowDetail';
import AproDetails from './myApp/aproDetails';


const Stack = createStackNavigator();

export default class Route extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="main" component={Main} options={{ title: '主页面' }}/>
          <Stack.Screen name="login" component={Login} options={{ title: '登录页面' }}/>
          <Stack.Screen name="myFlow" component={MyFlow} options={{ title: '我的流程' }}/>
          <Stack.Screen name="allFlow" component={AllFlow} options={{ title: '全部流程' }}/>
          <Stack.Screen name="apro" component={Apro} options={{ title: '审批' }}/>
          <Stack.Screen name="leave" component={Leave} options={{ title: '请假' }}/>
          <Stack.Screen name="apply" component={Apply} options={{ title: '申请流程' }}/>
          <Stack.Screen name="flowDetail" component={FlowDetail} options={{ title: '流程详情' }}/>
          <Stack.Screen name="aproDetails" component={AproDetails} options={{ title: '审批' }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

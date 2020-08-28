import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {
  Button,
  Steps,
  Tabs,
  List,
  WingBlank,
  Grid,
} from '@ant-design/react-native';
import './utils/host';

const Step = Steps.Step;
const Item = List.Item;
const data = [
  {
    icon: 'http://47.97.202.111:8081/img/rn/%E8%AF%B7%E5%81%87.png',
    text: '请假',
  },
  {
    icon: 'http://47.97.202.111:8081/img/rn/%E7%94%B3%E8%AF%B7.png',
    text: '申请',
  },
  {
    icon: 'http://47.97.202.111:8081/img/rn/%E5%AE%A1%E6%89%B9.png',
    text: '审批',
  },
  {
    icon: 'http://47.97.202.111:8081/img/rn/%E6%B5%81%E7%A8%8B.png',
    text: '全部流程',
  },
  {
    icon: 'http://47.97.202.111:8081/img/rn/%E6%88%91%E7%9A%84.png',
    text: '我的流程',
  },
];

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      user: undefined,
      goTime: '',
      outTime: '',
      goStatus: undefined,
      outStatus: undefined,
      step: -1,

      id: '',
      name: '',
      phone: '',
      email: '',
      address: '',
    };
  }

  handlePress = (_el, index) => {
    switch (index) {
      case 0:
        this.props.navigation.push('leave');
        break;
      case 1:
        this.props.navigation.push('apply');
        break;
      case 2:
        this.props.navigation.push('apro');
        break;
      case 3:
        this.props.navigation.push('allFlow');
        break;
      case 4:
        this.props.navigation.push('myFlow');
        break;
      default:
        break;
    }
  };

  handleClick = () => {
    storage.remove({
      key: 'user',
    });
    console.log('用户下线');
    this.props.navigation.replace('login');
  };

  getSign(id) {
    fetch(global.config.url +  '/exp/sign/getSign?userId=' + id)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          this.setState(
            {
              goTime: res.data.goTime,
              outTime: res.data.outTime,
              goStatus: res.data.goStatus,
              outStatus: res.data.outStatus,
              step: res.data.step - 1,
            },
            () => {
              console.log('更新完毕');
            },
          );
        }
      })

      .catch((error) => {
        console.error(error);
      });
  }

  //上班打卡
  go(id) {
    fetch(global.config.url + '/exp/sign/daySign', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: id,
      }),
    }).then((response) => {
      // 获取到网络请求返回的对象
      response
        .json()
        .then((result) => {
          if (result.code === 200) {
            this.setState(
              {
                goTime: result.data.goTime,
                outTime: result.data.outTime,
                goStatus: result.data.goStatus,
                outStatus: result.data.outStatus,
                step: result.data.step - 1,
              },
              () => {
                console.log('更新完毕');
              },
            );
          }
        })
        .then(() => {
          console.log('刷新页面');
        })
        .catch((error) => {
          // 网络请求失败，处理错误信息
        });
    });
  }

  out(id) {
    fetch(global.config.url + '/exp/sign/leaveSign', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: id,
      }),
    }).then((response) => {
      // 获取到网络请求返回的对象
      response
        .json()
        .then((result) => {
          if (result.code === 200) {
            this.setState(
              {
                goTime: result.data.goTime,
                outTime: result.data.outTime,
                goStatus: result.data.goStatus,
                outStatus: result.data.outStatus,
                step: result.data.step - 1,
              },
              () => {
                console.log('更新完毕');
              },
            );
          }
        })
        .catch((error) => {
          // 网络请求失败，处理错误信息
        });
    });
  }

  onSign = () => {
    //今日未打卡
    if (this.state.step === -1) {
      console.log('上班打卡');
      this.go(this.state.id);
    }
    //今日打过上班卡 点击下班打卡
    else if (this.state.step === 0) {
      console.log('下班打卡');
      this.out(this.state.id);
    } else {
    }
  };

  componentDidMount() {
    storage
      .load({
        key: 'user',
      })
      .then((ret) => {
        // 如果找到数据，则在then方法中返回

        this.getSign(ret.id);
        this.setState({
          id: ret.id,
          name: ret.name,
          phone: ret.phone,
          email: ret.email,
          address: ret.address,
        });
      })
      .catch(() => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        this.props.navigation.replace('login');
      });
  }

  render() {
    const tabs = [{title: '签到'}, {title: '应用'}, {title: '我的'}];
    return (
      <View style={{flex: 1}}>
        <Tabs tabs={tabs} tabBarPosition="bottom">
          <View
            style={{
              backgroundColor: '#fff',
            }}>
            <View
              style={{
                marginTop: 60,
                marginLeft: 30,
              }}>
              <WingBlank size="lg">
                <Steps
                  size="small"
                  current={this.state.step}
                  direction="vertical">
                  <Step
                    title={
                      <View>
                        <Text style={{ color : this.state.goStatus === 2 ? 'red': ''}}>上班</Text>
                      </View>
                    }
                    description={
                      <View>
                        <Text style={{ color : this.state.goStatus === 2 ? 'red': ''}}>{this.state.goTime}</Text>
                      </View>
                    }
                  />
                  <Step
                    title={
                      <View>
                        <Text style={{ color : this.state.outStatus === 2 ? 'red': ''}}>下班</Text>
                      </View>
                    }
                    description={
                      <View>
                        <Text style={{ color : this.state.outStatus === 2 ? 'red': ''}}>{this.state.outTime}</Text>
                      </View>
                    }
                  />
                </Steps>
              </WingBlank>
            </View>
            <View style={{backgroundColor: '#C0C0C0', height: 0.1}}></View>
            <View style={{marginTop: 80}}>
              <WingBlank size="lg">
                <Button type="primary" onPress={this.onSign}>
                  签到
                </Button>
              </WingBlank>
            </View>
          </View>
          <View>
            <Grid
              data={data}
              columnNum={3}
              hasLine={false}
              onPress={this.handlePress}
            />
          </View>
          <View style={{}}>
            <ScrollView
              style={{backgroundColor: '#fff'}}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <List>
                <Item
                  align="middle"
                  extra={
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60,
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '100',
                          paddingRight: 20,
                        }}>
                        {this.state.id}
                      </Text>
                    </View>
                  }
                  multipleLine>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingLeft: 30,
                    }}>
                    用户id
                  </Text>
                </Item>
                <Item
                  align="middle"
                  extra={
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60,
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '100',
                          paddingRight: 20,
                        }}>
                        {this.state.name}
                      </Text>
                    </View>
                  }
                  multipleLine>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingLeft: 30,
                    }}>
                    姓名
                  </Text>
                </Item>
                <Item
                  align="middle"
                  extra={
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60,
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '100',
                          paddingRight: 20,
                        }}>
                        {this.state.phone}
                      </Text>
                    </View>
                  }
                  multipleLine>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingLeft: 30,
                    }}>
                    电话
                  </Text>
                </Item>
                <Item
                  align="middle"
                  extra={
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60,
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '100',
                          paddingRight: 20,
                        }}>
                        {this.state.email}
                      </Text>
                    </View>
                  }
                  multipleLine>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingLeft: 30,
                    }}>
                    邮箱
                  </Text>
                </Item>
                <Item
                  align="middle"
                  extra={
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60,
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '100',
                          paddingRight: 20,
                        }}>
                        {this.state.address}
                      </Text>
                    </View>
                  }
                  multipleLine>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingLeft: 30,
                    }}>
                    工作位置
                  </Text>
                </Item>
                <Item
                  align="middle"
                  extra={
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60,
                      }}>
                      <Text
                        style={{
                          color: 'red',
                          fontSize: 15,
                          fontWeight: '100',
                          paddingRight: 20,
                        }}>
                        退出登录
                      </Text>
                    </View>
                  }
                  onPress={this.handleClick}
                  multipleLine>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingLeft: 30,
                    }}>
                    操作
                  </Text>
                </Item>
              </List>
            </ScrollView>
          </View>
        </Tabs>
      </View>
    );
  }
}

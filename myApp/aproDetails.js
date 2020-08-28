import React, {Component} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {
  Button,
  InputItem,
  List,
  Picker,
  Provider,
  TextareaItem,
} from '@ant-design/react-native';

const data = [
  {
    value: 1,
    label: '同意',
  },
  {
    value: 2,
    label: '退回',
  },
];

export default class Apply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flowId: undefined,

      myId: undefined,
      myName: '',

      data: [],
      value: '',
      type: '',
      title: '',
      pickerValue: [],
      startDate: undefined,
      endDate: undefined,
      user: '',
      id: undefined,
      remark: '',
      cost: 0,

      nextId: undefined,
      nextName: '',

      mystatus: undefined,

      list: [],
    };
  }

  userChange = (value) => {
    console.log([].concat(value[0].username));

    this.setState({
      user: value,
      nextId: value[0].id,
      nextName: value[0].username,
    });
  };

  onChange = (value) => {
    console.log(value);
    this.setState({value: value, mystatus: value[0]});
  };

  reamrkChange = (value) => {
    this.setState({
      remark: value,
    });
  };

  //获取用户里列表
  getUser() {
    fetch(global.config.url + '/exp/user/getUserList?startPosition=0&limit=100')
      .then((response) => response.json())
      .then((res) => {
        if (res.datas) {
          console.log(res.datas);
          const data = res.datas;
          let list = [];

          for (let i in data) {
            list.push({
              key: data[i].id,
              value: {
                id: data[i].id,
                username: data[i].name,
              },
              label: data[i].name,
            });
          }
          const obj = {
            key: -1,
            value: {
              id: -1,
              username: '无下一环',
            },
            label: '无下一环',
          };
          list.push(obj);
          this.setState({
            list: list,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  apro(userId, flowId, status, remark, nextUser, nextName) {
    fetch(global.config.url + '/exp/flow/apro', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        flowId: flowId,
        status: status,
        remark: remark,
        nextUser: nextUser,
        nextName: nextName,
      }),
    }).then((response) => {
      // 获取到网络请求返回的对象
      response
        .json()
        .then((result) => {
          if (result.code === 200) {
            console.log(result.msg);
          } else {
            alert('发起失败');
          }
        })
        .catch((error) => {
          // 网络请求失败，处理错误信息
        });
    });
  }

  submit = () => {
    this.apro(
      this.state.myId,
      this.state.flowId,
      this.state.mystatus,
      this.state.remark,
      this.state.nextId,
      this.state.nextName,
    );
  };

  componentDidMount() {
    storage
      .load({
        key: 'user',
      })
      .then((ret) => {
        // 如果找到数据，则在then方法中返回
        this.setState({
          myId: ret.id,
          myName: ret.name,
        });
      })
      .catch(() => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        this.props.navigation.replace('login');
      });

    if (this.props.route.params !== undefined) {
      const {flowId} = this.props.route.params;
      this.setState({
        flowId: flowId,
      });
    }
    this.getUser();
  }

  render() {
    return (
      <Provider>
        <ScrollView
          style={{flex: 1}}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <List renderHeader={'填写信息'}>
            <Picker
              data={data}
              cols={1}
              value={this.state.value}
              onChange={this.onChange}>
              <List.Item arrow="horizontal" onPress={this.onPress}>
                审批意见
              </List.Item>
            </Picker>

            <Picker
              data={this.state.list}
              cols={1}
              value={this.state.user}
              onChange={this.userChange}>
              <List.Item arrow="horizontal" onPress={this.onPress}>
                下一审批人
              </List.Item>
            </Picker>
            <TextareaItem
              rows={4}
              placeholder="审批备注"
              style={{paddingVertical: 5, paddingLeft: 15}}
              onChange={this.reamrkChange}
            />
            <List.Item>
              <Button onPress={this.submit} type="primary">
                提交
              </Button>
            </List.Item>
          </List>
        </ScrollView>
      </Provider>
    );
  }
}

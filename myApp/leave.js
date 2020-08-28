import React, {Component} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {
  Button,
  InputItem,
  List,
  Picker,
  Provider,
  DatePicker,
  TextareaItem,
} from '@ant-design/react-native';
import moment from 'moment';
moment.locale('zh-cn');

const data = [
  {
    value: '年假',
    label: '年假',
  },
  {
    value: '事假',
    label: '事假',
  },
  {
    value: '病假',
    label: '病假',
  },
];

export default class Leave extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

      nextId: undefined,
      nextName: '',

      startdate: '',
      starthms: '',
      enddate: '',
      endhms: '',

      list: [],
    };
  }

  onChange = (value) => {
    console.log(value);
    this.setState({value: value, type: value[0]});
  };

  startTimeChange = (value) => {
    let year = value.getFullYear();
    let mon =
      value.getMonth() + 1 > 9
        ? value.getMonth() + 1
        : '0' + (value.getMonth() + 1);
    let day = value.getDate() > 9 ? value.getDate() : '0' + value.getDate();
    let formatDate = year + '-' + mon + '-' + day;

    let h = value.getHours() > 9 ? value.getHours() : '0' + value.getHours();
    let m =
      value.getMinutes() > 9 ? value.getMinutes() : '0' + value.getMinutes();
    let formatHms = h + ':' + m + ':00';

    this.setState({
      startDate: value,
      startdate: formatDate,
      starthms: formatHms,
    });
  };

  endTimeChange = (value) => {
    let year = value.getFullYear();
    let mon =
      value.getMonth() + 1 > 9
        ? value.getMonth() + 1
        : '0' + (value.getMonth() + 1);
    let day = value.getDate() > 9 ? value.getDate() : '0' + getDate();
    let formatDate = year + '-' + mon + '-' + day;

    let h = value.getHours() > 9 ? value.getHours() : '0' + value.getHours();
    let m =
      value.getMinutes() > 9 ? value.getMinutes() : '0' + value.getMinutes();
    let formatHms = h + ':' + m + ':00';

    this.setState({
      endDate: value,
      enddate: formatDate,
      endhms: formatHms,
    });
  };

  onPress = () => {
    console.log('anxia');
  };

  userChange = (value) => {
    console.log([].concat(value[0].username));

    this.setState({
      user: value,
      nextId: value[0].id,
      nextName: value[0].username,
    });
  };

  titleChange = (value) => {
    this.setState({
      title: value,
    });
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
          this.setState({
            list: list,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //开始流程
  addFlow(
    title,
    userId,
    userName,
    nextUserId,
    nextUserName,
    startDate,
    startHms,
    endDate,
    endHms,
    cost,
    type,
    status,
    remark,
  ) {
    fetch(global.config.url + '/exp/flow/addFlow', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        userId: userId,
        userName: userName,
        nextUserId: nextUserId,
        nextUsername: nextUserName,
        startDate: startDate,
        startHms: startHms,
        endDate: endDate,
        endHms: endHms,
        cost: cost,
        type: type,
        status: status,
        remark: remark,
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
    console.log(
      this.state.title,
      this.state.myId,
      this.state.myName,
      this.state.nextId,
      this.state.nextName,
      this.state.startdate,
      this.state.starthms,
      this.state.enddate,
      this.state.endhms,
      0,
      this.state.type,
      1,
      this.state.remark,
    );
    this.addFlow(
      this.state.title,
      this.state.myId,
      this.state.myName,
      this.state.nextId,
      this.state.nextName,
      this.state.startdate,
      this.state.starthms,
      this.state.enddate,
      this.state.endhms,
      0,
      this.state.type,
      1,
      this.state.remark,
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
            <InputItem onChange={this.titleChange} placeholder="输入请假标题">
              标题
            </InputItem>
            <Picker
              data={data}
              cols={1}
              value={this.state.value}
              onChange={this.onChange}>
              <List.Item arrow="horizontal" onPress={this.onPress}>
                假种选择
              </List.Item>
            </Picker>
            <DatePicker
              value={this.state.startDate}
              mode="datetime"
              defaultDate={new Date()}
              onChange={this.startTimeChange}
              format="YYYY-MM-DD HH:mm">
              <List.Item arrow="horizontal">开始时间</List.Item>
            </DatePicker>
            <DatePicker
              value={this.state.endDate}
              mode="datetime"
              defaultDate={new Date()}
              onChange={this.endTimeChange}
              format="YYYY-MM-DD HH:mm">
              <List.Item arrow="horizontal">预计结束时间</List.Item>
            </DatePicker>
            <Picker
              data={this.state.list}
              cols={1}
              value={this.state.user}
              onChange={this.userChange}>
              <List.Item arrow="horizontal" onPress={this.onPress}>
                审批人
              </List.Item>
            </Picker>
            <TextareaItem
              rows={4}
              placeholder="输入请假理由"
              autoHeight
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

import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {
  Accordion,
  List,
  WingBlank,
  Steps,
  Button,
} from '@ant-design/react-native';
import {formatStatus} from '../utils/FlowStatus';

const Item = List.Item;
const Step = Steps.Step;

export default class FlowDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      userId: undefined,
      activeSections: [1, 0],
      steps: [
        {title: '申请', description: '08:00:00'},
        {title: '同意', description: '09:00:00'},
      ],
      bttype: 0,
      list: [],

      title: '',
      id: '',
      username: '',
      type: '',
      status: '',
      cost: '',
      startTime: '',
      endTime: '',
      remark: '',
    };
  }

  //终端流程
  tem(userId, id) {
    fetch(global.config.url + '/exp/flow/stop', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        id: id,
      }),
    }).then((response) => {
      // 获取到网络请求返回的对象
      response
        .json()
        .then((result) => {
          if (result.code === 200) {
            this.props.navigation.goBack();  
          } else {
            alert('中断失败');
          }
        })
        .catch((error) => {
          // 网络请求失败，处理错误信息
        });
    });
  }

  delete = () => {
    this.tem(this.state.userId, this.state.id);
  };

  apro = () => {
    this.props.navigation.push('aproDetails', {
      flowId: this.state.id,

    });
  }

  onChange = (activeSections) => {
    this.setState({activeSections});
  };

  //获取流程信息
  getFlow(id) {
    fetch(global.config.url + '/exp/flow/findFlowById?id=' + id)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          this.setState({
            title: res.data.title,
            id: res.data.id,
            username: res.data.userName,
            type: res.data.type,
            status: formatStatus(res.data.status),
            cost: res.data.cost,
            startTime: res.data.startDate + ' ' + res.data.startHms,
            endTime: res.data.endDate + ' ' + res.data.endHms,
            remark: res.data.remark,
          });
        }
      })

      .catch((error) => {
        console.error(error);
      });
  }

  //获取流程图
  getFlowMain(id) {
    fetch(global.config.url + '/exp/flow/getFlowMain?id=' + id)
      .then((response) => response.json())
      .then((res) => {
        if (res.datas) {
          console.log(res.datas);
          const data = res.datas;
          let list = [];
          for (let i in data) {
            list.push(
              <Step
                key={i}
                title={
                  <View>
                    <Text style={{color: data[i].status === 2 ? 'red' : ''}}>
                      {data[i].remark ? data[i].remark : '等待审批'}
                    </Text>
                  </View>
                }
                description={
                  <View>
                    <Text style={{color: data[i].status === 2 ? 'red' : ''}}>
                      操作人:{data[i].userName}
                    </Text>
                    <Text style={{color: data[i].status === 2 ? 'red' : ''}}>
                      {data[i].time}
                    </Text>
                  </View>
                }
              />,
            );
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

  componentDidMount() {
    storage
      .load({
        key: 'user',
      })
      .then((ret) => {
        // 如果找到数据，则在then方法中返回
        this.setState({
          userId: ret.id,
        });
      })
      .catch(() => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        this.props.navigation.replace('login');
      });
    if (this.props.route.params !== undefined) {
      const {id, type} = this.props.route.params;
      this.setState({
        id: id,
        bttype: type,
      });

      this.getFlow(id);
      this.getFlowMain(id);
    }
  }

  render() {
    return (
      <ScrollView
        style={{flex: 1}}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <List renderHeader={'流程信息'}>
          <Item extra={this.state.title} arrow="empty">
            任务标题
          </Item>
          <Item extra={this.state.id} arrow="empty">
            流程编码
          </Item>
          <Item extra={this.state.username} arrow="empty">
            发起人
          </Item>
          <Item extra={this.state.type} arrow="empty">
            流程类型
          </Item>
          <Item extra={this.state.status} arrow="empty">
            流程状态
          </Item>
          <Item extra={this.state.cost} arrow="empty">
            预算
          </Item>
          <Item extra={this.state.startTime} arrow="empty">
            开始时间
          </Item>
          <Item extra={this.state.endTime} arrow="empty">
            预计结束时间
          </Item>
          <Item extra={this.state.remark} arrow="empty">
            流程备注
          </Item>
          <Accordion
            onChange={this.onChange}
            activeSections={this.state.activeSections}>
            <Accordion.Panel header="流程图">
              <View style={{marginTop: 20, paddingLeft: 20}}>
                <WingBlank size="lg">
                  <Steps size="small" current={100} direction="vertical">
                    {this.state.list}
                  </Steps>
                </WingBlank>
              </View>
            </Accordion.Panel>
          </Accordion>
          <WingBlank size="lg">
            <Button
              type="primary"
              onPress={this.delete}
              style={{display: this.state.bttype === 1 ? 'flex' : 'none'}}>
              撤销流程
            </Button>
          </WingBlank>
          <WingBlank size="lg">
            <Button
              type="primary"
              onPress={this.apro}
              style={{display: this.state.bttype === 2 ? 'flex' : 'none'}}>
              审批
            </Button>
          </WingBlank>
        </List>
      </ScrollView>
    );
  }
}

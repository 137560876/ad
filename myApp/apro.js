import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import MyCard from '../component/card';
import { formatStatus } from '../utils/FlowStatus';
import '../utils/host';


export default class Apro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  link = (id) => {
    this.props.navigation.push('flowDetail', {
      id: id,
      type: 2,
    });
  };

  //获取全部流程
  getFlow(id) {
    fetch(
      global.config.url + '/exp/flow/getAproFlowList?startPosition=0&limit=100&userId=' +
        id,
    )
      .then((response) => response.json())
      .then((res) => {
        if (res.datas) {
          console.log(res.datas);
          const data = res.datas;
          let list = [];
          for (let i in data) {
            list.push(
              <MyCard
                key={data[i].id}
                id={data[i].id}
                title={data[i].title}
                user={data[i].userName}
                context={data[i].remark}
                status={formatStatus(data[i].status)}
                date={data[i].startDate}
                link={() => {
                  this.link(data[i].id);
                }}
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

  //获取所有用户
  getUser(){
    fetch(global.config.url + '/getUserList?startPosition=0&limit=100')
    .then((response) => response.json())
    .then((res) => {
      if (res.datas) {
        console.log(res.datas);
        
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

        this.getFlow(ret.id);
      })
      .catch(() => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        this.props.navigation.replace('login');
      });
  }

  render() {
    return (
      <ScrollView
        style={{backgroundColor: '#fff'}}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {this.state.list}
      </ScrollView>
    );
  }
}

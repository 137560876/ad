import React from 'react';
import {View, Image} from 'react-native';
import {
  WhiteSpace,
  Button,
  WingBlank,
  InputItem,
} from '@ant-design/react-native';
import './utils/host';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      user: undefined,
    };
  }

  login(username, password) {
    fetch(global.config.url + '/exp/user/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((response) => {
      // 获取到网络请求返回的对象
      response
        .json()
        .then((result) => {
          if (result.code === 200) {
            console.log(result.datas[0]);
            storage.save({
              key: 'user', // 注意:请不要在key中使用_下划线符号!
              data: result.datas[0],
              // 如果不指定过期时间，则会使用defaultExpires参数
              // 如果设为null，则永不过期
              expires: 1000 * 3600,
            });
            this.props.navigation.replace('main');
          } else {
            alert("用户名或密码错误")
          }
        })
        .catch((error) => {
          // 网络请求失败，处理错误信息
          alert(error)
        });
    });
  }

  handleClick = (e) => {
    
    this.login(this.state.username, this.state.password);
  };

  render() {
    return (
      <View>
        <WhiteSpace />
        <WingBlank>
          <View style={{height: 80}}></View>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              source={require('./android/app/src/image/tx.png')}
              style={{
                width: 150,
                height: 150,
              }}></Image>
          </View>
          <WhiteSpace size="xl" />
          <WhiteSpace size="xl" />
          <InputItem
            defaultValue="xx"
            onChange={(value) => {
              this.setState({
                username: value,
              });
            }}
            value={this.state.username}
            placeholder="输入用户名">
            标题
          </InputItem>
          <WhiteSpace size="xs" />
          <InputItem
            type="password"
            value={this.state.password}
            onChange={(value) => {
              this.setState({
                password: value,
              });
            }}
            placeholder="输入密码">
            密码
          </InputItem>
          <WhiteSpace size="xl" />
          <Button type="primary" onPress={this.handleClick}>
            登录
          </Button>
        </WingBlank>
      </View>
    );
  }
}

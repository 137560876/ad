import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Card, WhiteSpace, WingBlank} from '@ant-design/react-native';
export default class MyCard extends Component {
  myClick =() => {
    this.props.link();
    
  }

  render() {
    return (
      <View>
        <WhiteSpace size="lg" />
        <WingBlank size="lg">
          <TouchableOpacity
            onPress={() => {
              this.myClick(this.props.id);
            }}>
            <Card>
              <Card.Header
                title={
                  <View>
                    <View>
                      <Text>{this.props.title}</Text>
                    </View>
                    <View style={{marginTop: 5}}>
                      <Text style={{color: '#808080'}}>{this.props.user}</Text>
                    </View>
                  </View>
                }
              />
              <Card.Body>
                <View style={{height: 42}}>
                  <Text style={{marginLeft: 16}}>{this.props.context}</Text>
                </View>
              </Card.Body>
              <Card.Footer
                content={this.props.status}
                extra={this.props.date}
              />
            </Card>
          </TouchableOpacity>
        </WingBlank>
      </View>
    );
  }
}

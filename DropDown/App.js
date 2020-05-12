import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {Data} from './Arr';
import MultiSelectItem from './MultipleSelect';

const Dropdown = () => {
  const [state, changeState] = useState();

  const {viewStyle} = dropDown;
  return (
    <View style={viewStyle}>
      <Text>welcm to drpdwn</Text>
      <SearchableDropdown
        onTextChange={text => changeState(text)}
        onItemSelect={item => alert(JSON.stringify(item))}
        containerStyle={{padding: 5}}
        textInputStyle={{
          padding: 12,
          borderWidth: 2,
          borderColor: '#ffd700',
          borderRadius: 5,
        }}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: '#ddd',
          borderColor: '#bbb',
          borderWidth: 1,
          borderRadius: 5,
        }}
        itemTextStyle={{color: '#222'}}
        itemsContainerStyle={{maxHeight: 400}}
        items={Data}
        defaultIndex={2}
        placeholder="Enter the Text"
        resetValue={false}
        underlineColorAndroid="transparent"
      />
      {/* <MultiSelectItem/> */}
    </View>
  );
};
export default Dropdown;

const dropDown = StyleSheet.create({
  viewStyle: {
    flex: 1,
    marginTop: 50,
  },
});
